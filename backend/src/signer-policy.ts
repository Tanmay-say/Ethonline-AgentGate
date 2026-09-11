import { encodeFunctionData } from "viem";

export const AUTONOMOUS_DEMO_CHAIN_ID = 84532;
export const AUTONOMOUS_DEMO_TOKEN = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as `0x${string}`;
export const AUTONOMOUS_DEMO_HELPER = "0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c" as `0x${string}`;
export const AUTONOMOUS_DEMO_MAX_PAYMENT_BASE_UNITS = 1_000_000n;
export const AUTONOMOUS_DEMO_MAX_DAILY_BASE_UNITS = 5_000_000n;
export const AUTONOMOUS_DEMO_MAX_PLAN_TTL_SECONDS = 900;

export function isPaymentReserved(paymentIds: string[], paymentId: string): boolean {
  return paymentIds.includes(paymentId);
}

export const autonomousHelperAbi = [{
  type: "function", name: "payAndAnnounce", stateMutability: "nonpayable",
  inputs: [{ name: "amount", type: "uint256" }, { name: "stealthAddress", type: "address" }, { name: "ephemeralPublicKey", type: "bytes" }, { name: "metadata", type: "bytes" }], outputs: []
}] as const;
const erc20TransferAbi = [{ type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ type: "bool" }] }] as const;

export type AutonomousIntent = {
  paymentId: string;
  mode?: "STANDARD" | "STEALTH";
  chainId: number;
  payer: `0x${string}`;
  token: `0x${string}`;
  helper?: `0x${string}`;
  recipient?: `0x${string}`;
  amountBaseUnits: bigint;
  stealthAddress?: `0x${string}`;
  ephemeralPublicKey?: `0x${string}`;
  metadata?: `0x${string}`;
  calldata: `0x${string}`;
  expiresAt: string;
  nowMs?: number;
};

export function expectedAutonomousCalldata(intent: { amountBaseUnits: bigint; stealthAddress: `0x${string}`; ephemeralPublicKey: `0x${string}`; metadata: `0x${string}` }): `0x${string}` {
  return encodeFunctionData({ abi: autonomousHelperAbi, functionName: "payAndAnnounce", args: [intent.amountBaseUnits, intent.stealthAddress, intent.ephemeralPublicKey, intent.metadata] });
}

export function expectedStandardCalldata(recipient: `0x${string}`, amountBaseUnits: bigint): `0x${string}` {
  return encodeFunctionData({ abi: erc20TransferAbi, functionName: "transfer", args: [recipient, amountBaseUnits] });
}

export function validateAutonomousIntent(intent: AutonomousIntent, dailySpentBaseUnits: bigint): void {
  if (intent.chainId !== AUTONOMOUS_DEMO_CHAIN_ID) throw new Error("AUTONOMOUS_DEMO_CHAIN_MUST_USE_BASE_SEPOLIA");
  if (intent.token.toLowerCase() !== AUTONOMOUS_DEMO_TOKEN.toLowerCase()) throw new Error("AUTONOMOUS_DEMO_TOKEN_NOT_ALLOWED");
  const mode = intent.mode ?? "STEALTH";
  if (mode === "STEALTH" && (!intent.helper || intent.helper.toLowerCase() !== AUTONOMOUS_DEMO_HELPER.toLowerCase())) throw new Error("AUTONOMOUS_DEMO_HELPER_NOT_ALLOWED");
  if (mode === "STANDARD" && (!intent.recipient || !/^0x[a-fA-F0-9]{40}$/.test(intent.recipient))) throw new Error("AUTONOMOUS_DEMO_STANDARD_RECIPIENT_INVALID");
  if (intent.amountBaseUnits <= 0n || intent.amountBaseUnits > AUTONOMOUS_DEMO_MAX_PAYMENT_BASE_UNITS) throw new Error("AUTONOMOUS_DEMO_PAYMENT_LIMIT_EXCEEDED");
  if (dailySpentBaseUnits < 0n || dailySpentBaseUnits + intent.amountBaseUnits > AUTONOMOUS_DEMO_MAX_DAILY_BASE_UNITS) throw new Error("AUTONOMOUS_DEMO_DAILY_LIMIT_EXCEEDED");
  const now = intent.nowMs ?? Date.now();
  const deadline = new Date(intent.expiresAt).getTime();
  if (!Number.isFinite(deadline) || deadline <= now || deadline - now > AUTONOMOUS_DEMO_MAX_PLAN_TTL_SECONDS * 1000) throw new Error("AUTONOMOUS_DEMO_DEADLINE_INVALID");
  if (mode === "STEALTH" && (!intent.stealthAddress || !intent.ephemeralPublicKey || !intent.metadata)) throw new Error("AUTONOMOUS_DEMO_STEALTH_INTENT_INCOMPLETE");
  const expected = mode === "STANDARD" ? expectedStandardCalldata(intent.recipient!, intent.amountBaseUnits) : expectedAutonomousCalldata({ ...intent, stealthAddress: intent.stealthAddress!, ephemeralPublicKey: intent.ephemeralPublicKey!, metadata: intent.metadata! });
  if (intent.calldata.toLowerCase() !== expected.toLowerCase()) throw new Error("AUTONOMOUS_DEMO_CALLDATA_MISMATCH");
}
