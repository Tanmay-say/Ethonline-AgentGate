import { z } from "zod";

const optionalAddress = z.preprocess((value) => value === "" ? undefined : value, z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional());
const runtimeToken = z.preprocess((value) => value === "" ? undefined : value, z.string().min(16).default("development-token-change-me-1234"));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  DATABASE_URL: z.string().url().optional(),
  BASE_SEPOLIA_RPC_URL: z.string().url().default("https://sepolia.base.org"),
  BASE_SEPOLIA_CHAIN_ID: z.coerce.number().int().default(84532),
  USDC_ADDRESS: optionalAddress,
  USDC_DECIMALS: z.coerce.number().int().default(6),
  ANNOUNCER_ADDRESS: optionalAddress,
  REGISTRY_ADDRESS: optionalAddress,
  HELPER_ADDRESS: optionalAddress,
  EXPLORER_URL: z.string().url().default("https://sepolia.basescan.org"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  API_BEARER_TOKEN: runtimeToken,
  SIGNER_BEARER_TOKEN: runtimeToken,
  PLAN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  FINALITY_BLOCKS: z.coerce.number().int().nonnegative().default(2),
  MAX_PAYMENT_BASE_UNITS: z.coerce.bigint().positive().default(25_000_000n),
  DAILY_PAYMENT_BASE_UNITS: z.coerce.bigint().positive().default(100_000_000n)
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  if (parsed.NODE_ENV === "production" && !parsed.DATABASE_URL) {
    throw new Error("DATABASE_URL is required in production");
  }
  if (parsed.NODE_ENV === "production" && !parsed.USDC_ADDRESS) {
    throw new Error("USDC_ADDRESS is required in production");
  }
  if (parsed.NODE_ENV === "production" && (parsed.API_BEARER_TOKEN.startsWith("development-") || parsed.SIGNER_BEARER_TOKEN.startsWith("development-"))) {
    throw new Error("API_BEARER_TOKEN and SIGNER_BEARER_TOKEN must be configured in production");
  }
  return parsed;
}
