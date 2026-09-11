import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Pool } from "pg";
import { loadConfig, type Config } from "./config.js";
import { PAYMENT_MODES, PRIVACY_NOTICE } from "./domain.js";
import { MemoryPaymentRepository, PostgresPaymentRepository } from "./repository.js";
import { PaymentService } from "./service.js";
import { BaseSepoliaVerifier } from "./chain.js";
import { openApiDocument } from "./openapi.js";
import { z } from "zod";

const prepareSchema = z.object({
  payer: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  recipient: z.string().min(3),
  mode: z.enum(["standard", "stealth"]),
  token: z.union([z.literal("USDC"), z.string().regex(/^0x[a-fA-F0-9]{40}$/)]),
  amount: z.string().regex(/^\d+(\.\d{1,6})?$/),
  idempotency_key: z.string().min(8).max(128)
});

export function createApp(config: Config = loadConfig()) {
  const pool = config.DATABASE_URL ? new Pool({ connectionString: config.DATABASE_URL, ssl: { rejectUnauthorized: false } }) : undefined;
  const repository = pool ? new PostgresPaymentRepository(pool) : new MemoryPaymentRepository();
  const service = new PaymentService(repository, config);
  const verifier = new BaseSepoliaVerifier(config);
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: config.FRONTEND_ORIGIN }));
  app.use(express.json({ limit: "64kb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }));

  app.get("/healthz", (_req, res) => res.json({ status: "ok", database: pool ? "supabase-postgres" : "test-memory" }));
  app.get("/v1/capabilities", (_req, res) => res.json({ chain_id: config.BASE_SEPOLIA_CHAIN_ID, network: "base-sepolia",
    token: config.USDC_ADDRESS ?? null, token_decimals: config.USDC_DECIMALS, announcer: config.ANNOUNCER_ADDRESS ?? null,
    registry: config.REGISTRY_ADDRESS ?? null, helper: config.HELPER_ADDRESS ?? null, max_payment_base_units: config.MAX_PAYMENT_BASE_UNITS.toString(),
    privacy_notice: PRIVACY_NOTICE, integration_mode: "bazantic-pending" }));
  app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
  app.get("/v1/recipients/:address/meta-address", requireBearer(config.API_BEARER_TOKEN), (_req, res) => {
    res.status(404).json({ error: "RECIPIENT_REGISTRY_DISCOVERY_NOT_CONFIGURED", remedy: "Provide a manually verified scheme-1 stealth meta-address.", privacy_notice: PRIVACY_NOTICE });
  });

  app.post("/v1/payments/prepare", requireBearer(config.API_BEARER_TOKEN), asyncHandler(async (req, res) => {
    const parsed = prepareSchema.parse(req.body);
    const token = parsed.token === "USDC" ? config.USDC_ADDRESS : parsed.token;
    if (!token) throw new Error("USDC_NOT_CONFIGURED");
    const result = await service.prepare({ payer: parsed.payer as `0x${string}`, mode: parsed.mode.toUpperCase() as typeof PAYMENT_MODES[number], recipient: parsed.recipient, token: token as `0x${string}`, amount: parsed.amount,
      idempotencyKey: parsed.idempotency_key });
    res.status(result.existed ? 200 : 201).json({ ...service.response(result.job), next_step: "local_signer_review" });
  }));

  app.get("/v1/payments/:id", requireBearer(config.API_BEARER_TOKEN), asyncHandler(async (req, res) => {
    const job = await service.get(String(req.params.id));
    res.json({ ...service.response(job), payer: job.payer });
  }));
  app.get("/v1/payments/:id/signer-plan", requireBearer(config.SIGNER_BEARER_TOKEN), asyncHandler(async (req, res) => {
    res.json(service.signerPlan(await service.get(String(req.params.id))));
  }));
  app.post("/v1/recipients", requireBearer(config.API_BEARER_TOKEN), asyncHandler(async (req, res) => {
    const body = z.object({ agent_id: z.string().min(1).max(128), normal_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/), stealth_meta_address: z.string().min(10), fingerprint: z.string().min(8) }).parse(req.body);
    await service.registerRecipient(body.agent_id, body.normal_address, body.stealth_meta_address, body.fingerprint);
    res.status(201).json({ agent_id: body.agent_id, normal_address: body.normal_address, registered: true });
  }));
  app.get("/v1/payments/:id/announce-tx", requireBearer(config.API_BEARER_TOKEN), (_req, res) => {
    res.status(503).json({ error: "ANNOUNCEMENT_CONTRACT_NOT_CONFIGURED", privacy_notice: PRIVACY_NOTICE });
  });

  app.post("/v1/payments/:id/transactions", requireBearer(config.SIGNER_BEARER_TOKEN), asyncHandler(async (req, res) => {
    const body = z.object({ transaction_hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/), mode: z.enum(["standard", "stealth"]), stealth_address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(), ephemeral_public_key: z.string().min(4).optional(), view_tag: z.string().min(2).optional() }).superRefine((value, context) => {
      if (value.mode === "stealth" && (!value.stealth_address || !value.ephemeral_public_key || !value.view_tag)) context.addIssue({ code: "custom", message: "STEALTH_SUBMISSION_INCOMPLETE", path: ["stealth_address"] });
      if (value.mode === "standard" && (value.stealth_address || value.ephemeral_public_key || value.view_tag)) context.addIssue({ code: "custom", message: "STANDARD_SUBMISSION_MUST_NOT_INCLUDE_STEALTH_FIELDS", path: ["mode"] });
    }).parse(req.body);
    const job = await service.get(String(req.params.id));
    if (job.mode.toLowerCase() !== body.mode) throw new Error("PAYMENT_MODE_MISMATCH");
    const result = await service.submitTransaction(String(req.params.id), body.transaction_hash as `0x${string}`, body.stealth_address as `0x${string}` | undefined, body.ephemeral_public_key, body.view_tag, verifier);
    res.json({ ...service.response(result.job), verification: result.reason ?? "verified" });
  }));

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "INTERNAL_ERROR";
    const map: Record<string, number> = { NOT_FOUND: 404, IDEMPOTENCY_BODY_CONFLICT: 409, IDEMPOTENCY_CONFLICT: 409, AMOUNT_OUT_OF_POLICY: 422, TOKEN_NOT_ALLOWED: 422, INVALID_STATE_TRANSITION: 409, PLAN_NOT_EXPIRED: 409, STEALTH_RECIPIENT_NOT_REGISTERED: 422, INVALID_STANDARD_RECIPIENT: 422, INVALID_RECIPIENT_ADDRESS: 422, INVALID_STEALTH_META_ADDRESS: 422, PAYMENT_MODE_MISMATCH: 409, USDC_NOT_CONFIGURED: 503 };
    res.status(map[message] ?? (error instanceof z.ZodError ? 400 : 500)).json({ error: message, privacy_notice: PRIVACY_NOTICE });
  });
  return app;
}

function requireBearer(expected: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== `Bearer ${expected}`) return res.status(401).json({ error: "UNAUTHORIZED" });
    next();
  };
}

function asyncHandler(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => handler(req, res).catch(next);
}
