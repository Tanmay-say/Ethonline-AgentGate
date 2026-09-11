import { createHash, randomUUID } from "node:crypto";
import { parseUnits } from "viem";
import type { Config } from "./config.js";
import { PAYMENT_TRANSITIONS, PRIVACY_NOTICE, type PaymentJob, type PaymentRepository, type PaymentState, type PrepareInput, type PaymentMode } from "./domain.js";
import type { BaseSepoliaVerifier } from "./chain.js";
import { deriveStealthDestination } from "./stealth.js";

export class PaymentService {
  constructor(private readonly repository: PaymentRepository, private readonly config: Config) {}

  async prepare(input: PrepareInput): Promise<{ job: PaymentJob; existed: boolean }> {
    const mode: PaymentMode = input.mode ?? "STEALTH";
    const recipient = input.recipient ?? input.recipientMetaAddress ?? "";
    let recipientMetaAddress = input.recipientMetaAddress;
    let recipientFingerprint = input.recipientFingerprint;
    if (mode === "STANDARD") {
      if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) throw new Error("INVALID_STANDARD_RECIPIENT");
      recipientMetaAddress = undefined;
      recipientFingerprint = undefined;
    } else {
      const registration = recipientMetaAddress && recipientFingerprint ? undefined : await this.repository.findRecipientRegistration(recipient);
      recipientMetaAddress ??= registration?.stealthMetaAddress;
      recipientFingerprint ??= registration?.fingerprint;
      if (!recipientMetaAddress || !recipientFingerprint) throw new Error("STEALTH_RECIPIENT_NOT_REGISTERED");
    }
    const canonical = JSON.stringify({ payer: input.payer, mode, recipient, amount: input.amount.trim(), token: input.token.toLowerCase(), idempotencyKey: input.idempotencyKey });
    const requestHash = createHash("sha256").update(canonical).digest("hex");
    const existing = await this.repository.findByIdempotencyKey(input.idempotencyKey);
    if (existing) {
      if (existing.requestHash !== requestHash) throw new Error("IDEMPOTENCY_BODY_CONFLICT");
      return { job: existing, existed: true };
    }

    const amountBaseUnits = parseUnits(input.amount, this.config.USDC_DECIMALS);
    if (amountBaseUnits <= 0n || amountBaseUnits > this.config.MAX_PAYMENT_BASE_UNITS) {
      throw new Error("AMOUNT_OUT_OF_POLICY");
    }
    if (this.config.USDC_ADDRESS && input.token.toLowerCase() !== this.config.USDC_ADDRESS.toLowerCase()) {
      throw new Error("TOKEN_NOT_ALLOWED");
    }
    const createdAt = new Date();
    const job: PaymentJob = {
      id: randomUUID(), idempotencyKey: input.idempotencyKey, requestHash, payer: input.payer,
      mode, recipient, recipientMetaAddress, recipientFingerprint,
      chainId: this.config.BASE_SEPOLIA_CHAIN_ID, tokenAddress: input.token, amount: input.amount,
      amountBaseUnits, expiresAt: new Date(createdAt.getTime() + this.config.PLAN_TTL_SECONDS * 1000).toISOString(),
      state: "PREPARED", createdAt: createdAt.toISOString(), updatedAt: createdAt.toISOString()
    };
    await this.repository.insert(job);
    return { job, existed: false };
  }

  async get(id: string): Promise<PaymentJob> {
    const job = await this.repository.findById(id);
    if (!job) throw new Error("NOT_FOUND");
    return job;
  }

  async registerRecipient(agentId: string, normalAddress: string, stealthMetaAddress: string, fingerprint: string): Promise<void> {
    if (!/^0x[a-fA-F0-9]{40}$/.test(normalAddress)) throw new Error("INVALID_RECIPIENT_ADDRESS");
    try { deriveStealthDestination(stealthMetaAddress); } catch { throw new Error("INVALID_STEALTH_META_ADDRESS"); }
    await this.repository.upsertRecipientRegistration({ agentId, normalAddress: normalAddress as `0x${string}`, stealthMetaAddress, fingerprint, updatedAt: new Date().toISOString() });
  }

  async updateState(id: string, state: PaymentState, transferTxHash?: `0x${string}`, announceTxHash?: `0x${string}`): Promise<PaymentJob> {
    const job = await this.get(id);
    if (!PAYMENT_TRANSITIONS[job.state].includes(state)) throw new Error("INVALID_STATE_TRANSITION");
    if (state === "EXPIRED" && new Date(job.expiresAt).getTime() > Date.now()) throw new Error("PLAN_NOT_EXPIRED");
    return this.repository.update(id, { state, transferTxHash, announceTxHash });
  }

  async submitTransaction(id: string, transactionHash: `0x${string}`, stealthAddress?: `0x${string}`, ephemeralPublicKey?: string, viewTag?: string, verifier?: BaseSepoliaVerifier): Promise<{ job: PaymentJob; reason?: string }> {
    const job = await this.get(id);
    if (job.state !== "PREPARED" && job.state !== "SUBMITTED" && job.state !== "CONFIRMING" && job.state !== "RECONCILING") throw new Error("INVALID_SUBMISSION_STATE");
    if (new Date(job.expiresAt).getTime() < Date.now()) {
      const expired = await this.repository.update(id, { state: "EXPIRED" });
      return { job: expired };
    }
    const submitted = await this.repository.update(id, { state: "SUBMITTED", transferTxHash: transactionHash, ...(stealthAddress ? { stealthAddress } : {}), ...(ephemeralPublicKey ? { ephemeralPublicKey } : {}), ...(viewTag ? { viewTag } : {}) });
    if (!verifier) return { job: submitted, reason: "chain verifier unavailable" };
    const result = await verifier.verifyPayment(submitted, transactionHash);
    const verified = await this.repository.update(id, { state: result.status });
    return { job: verified, reason: result.reason };
  }

  response(job: PaymentJob) {
    return { payment_id: job.id, state: job.state, mode: job.mode, recipient: job.recipient, chain_id: job.chainId, token: job.tokenAddress,
      amount: job.amount, amount_base_units: job.amountBaseUnits.toString(), expires_at: job.expiresAt,
      transfer_tx_hash: job.transferTxHash ?? null, announce_tx_hash: job.announceTxHash ?? null,
      privacy_notice: PRIVACY_NOTICE };
  }

  signerPlan(job: PaymentJob) {
    return { ...this.response(job), payer: job.payer, recipient_meta_address: job.recipientMetaAddress ?? null, recipient_fingerprint: job.recipientFingerprint ?? null, expires_at: job.expiresAt };
  }
}
