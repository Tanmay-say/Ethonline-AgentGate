import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";
import { MemoryPaymentRepository } from "./repository.js";
import { PaymentService } from "./service.js";
import { createRecipientKeys, deriveStealthDestination } from "./stealth.js";

function createService() {
  const config = loadConfig({ NODE_ENV: "test", API_BEARER_TOKEN: "test-api-token-123456", SIGNER_BEARER_TOKEN: "test-signer-token-123456" });
  return new PaymentService(new MemoryPaymentRepository(), config);
}

const input = {
  payer: "0x1111111111111111111111111111111111111111" as `0x${string}`,
  recipient: "agentB",
  recipientMetaAddress: "st:eth:0xrecipient-scheme-1",
  recipientFingerprint: "fp-test-123456",
  token: "0x2222222222222222222222222222222222222222" as `0x${string}`,
  amount: "5",
  idempotencyKey: "intent-123456"
};

describe("PaymentService", () => {
  it("supports STANDARD without stealth metadata", async () => {
    const service = createService();
    const result = await service.prepare({ ...input, mode: "STANDARD", recipient: "0x3333333333333333333333333333333333333333", recipientMetaAddress: undefined, recipientFingerprint: undefined });
    expect(result.job.mode).toBe("STANDARD");
    expect(result.job.recipient).toBe("0x3333333333333333333333333333333333333333");
    expect(result.job.recipientMetaAddress).toBeUndefined();
  });

  it("resolves STEALTH metadata from a registered Agent B without returning it in the public response", async () => {
    const repository = new MemoryPaymentRepository();
    const service = new PaymentService(repository, loadConfig({ NODE_ENV: "test", API_BEARER_TOKEN: "test-api-token-123456", SIGNER_BEARER_TOKEN: "test-signer-token-123456" }));
    const keys = createRecipientKeys();
    await service.registerRecipient("agentB", "0xA3b44f604589354cB65b6DAd431486aB7383D833", keys.stealthMetaAddressURI, "agent-b-fingerprint");
    const result = await service.prepare({ ...input, mode: "STEALTH", recipient: "0xA3b44f604589354cB65b6DAd431486aB7383D833", recipientMetaAddress: undefined, recipientFingerprint: undefined });
    expect(result.job.recipient).toBe("0xA3b44f604589354cB65b6DAd431486aB7383D833");
    expect(result.job.recipientMetaAddress).toBe(keys.stealthMetaAddressURI);
    expect(service.response(result.job)).not.toHaveProperty("recipientMetaAddress");
    expect(deriveStealthDestination(result.job.recipientMetaAddress!).stealthAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("rejects an unregistered STEALTH recipient", async () => {
    const service = createService();
    await expect(service.prepare({ ...input, mode: "STEALTH", recipient: "0x4444444444444444444444444444444444444444", recipientMetaAddress: undefined, recipientFingerprint: undefined })).rejects.toThrow("STEALTH_RECIPIENT_NOT_REGISTERED");
  });

  it("returns the same prepared plan for an identical idempotency request", async () => {
    const service = createService();
    const first = await service.prepare(input);
    const second = await service.prepare(input);
    expect(first.job.id).toBe(second.job.id);
    expect(second.existed).toBe(true);
    expect(first.job.state).toBe("PREPARED");
  });

  it("rejects an idempotency key reused with a different body", async () => {
    const service = createService();
    await service.prepare(input);
    await expect(service.prepare({ ...input, amount: "6" })).rejects.toThrow("IDEMPOTENCY_BODY_CONFLICT");
  });

  it("enforces the hardened payment state transitions", async () => {
    const service = createService();
    const { job } = await service.prepare(input);
    const submitted = await service.updateState(job.id, "SUBMITTED", "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(submitted.state).toBe("SUBMITTED");
    const confirming = await service.updateState(job.id, "CONFIRMING");
    expect(confirming.state).toBe("CONFIRMING");
    const confirmed = await service.updateState(job.id, "CONFIRMED");
    expect(confirmed.state).toBe("CONFIRMED");
    await expect(service.updateState(job.id, "RECONCILING")).rejects.toThrow("INVALID_STATE_TRANSITION");
  });

  it("rejects payments above the configured policy ceiling", async () => {
    const service = createService();
    await expect(service.prepare({ ...input, amount: "26" })).rejects.toThrow("AMOUNT_OUT_OF_POLICY");
  });
});
