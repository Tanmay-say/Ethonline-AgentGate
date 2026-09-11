import { describe, expect, it } from "vitest";
import { AUTONOMOUS_DEMO_HELPER, AUTONOMOUS_DEMO_TOKEN, expectedAutonomousCalldata, expectedStandardCalldata, isPaymentReserved, validateAutonomousIntent, type AutonomousIntent } from "./signer-policy.js";

function intent(overrides: Partial<AutonomousIntent> = {}): AutonomousIntent {
  const base = {
    paymentId: "demo-payment-1", chainId: 84532, payer: "0x1111111111111111111111111111111111111111" as `0x${string}`,
    token: AUTONOMOUS_DEMO_TOKEN, helper: AUTONOMOUS_DEMO_HELPER, amountBaseUnits: 1_000_000n,
    stealthAddress: "0x2222222222222222222222222222222222222222" as `0x${string}`,
    ephemeralPublicKey: "0x02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as `0x${string}`,
    metadata: "0xab" as `0x${string}`, expiresAt: new Date(Date.now() + 60_000).toISOString(), nowMs: Date.now()
  };
  const merged = { ...base, ...overrides };
  return { ...merged, calldata: expectedAutonomousCalldata(merged) } as AutonomousIntent;
}

describe("AUTONOMOUS_DEMO signer policy", () => {
  it("blocks a duplicate reservation for the same payment only", () => {
    expect(isPaymentReserved(["payment-a"], "payment-a")).toBe(true);
  });

  it("does not block a new payment because of a different stale reservation", () => {
    expect(isPaymentReserved(["stale-payment"], "payment-b")).toBe(false);
  });

  it("allows a one-USDC Base Sepolia helper payment within the daily cap", () => {
    expect(() => validateAutonomousIntent(intent(), 0n)).not.toThrow();
  });

  it("allows a one-USDC standard payment without stealth metadata", () => {
    const value = intent();
    value.mode = "STANDARD";
    value.recipient = "0x3333333333333333333333333333333333333333";
    value.helper = undefined;
    value.stealthAddress = undefined;
    value.ephemeralPublicKey = undefined;
    value.metadata = undefined;
    value.calldata = expectedStandardCalldata(value.recipient!, value.amountBaseUnits);
    expect(() => validateAutonomousIntent(value, 0n)).not.toThrow();
  });

  it("rejects a payment above the one-USDC per-payment limit", () => {
    const value = intent({ amountBaseUnits: 1_000_001n });
    expect(() => validateAutonomousIntent(value, 0n)).toThrow("AUTONOMOUS_DEMO_PAYMENT_LIMIT_EXCEEDED");
  });

  it("rejects an unauthorized helper or calldata", () => {
    expect(() => validateAutonomousIntent(intent({ helper: "0x3333333333333333333333333333333333333333" }), 0n)).toThrow("AUTONOMOUS_DEMO_HELPER_NOT_ALLOWED");
    const invalid = intent();
    invalid.calldata = "0x1234";
    expect(() => validateAutonomousIntent(invalid, 0n)).toThrow("AUTONOMOUS_DEMO_CALLDATA_MISMATCH");
  });

  it("rejects a payment that would exceed the five-USDC daily cap", () => {
    expect(() => validateAutonomousIntent(intent(), 4_000_001n)).toThrow("AUTONOMOUS_DEMO_DAILY_LIMIT_EXCEEDED");
  });
});
