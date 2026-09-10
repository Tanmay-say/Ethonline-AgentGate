import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";
import { MemoryPaymentRepository } from "./repository.js";
import { PaymentService } from "./service.js";

function createService() {
  const config = loadConfig({ NODE_ENV: "test", API_BEARER_TOKEN: "test-api-token-123456", SIGNER_BEARER_TOKEN: "test-signer-token-123456" });
  return new PaymentService(new MemoryPaymentRepository(), config);
}

const input = {
  payer: "0x1111111111111111111111111111111111111111" as `0x${string}`,
  recipientMetaAddress: "st:eth:0xrecipient-scheme-1",
  recipientFingerprint: "fp-test-123456",
  token: "0x2222222222222222222222222222222222222222" as `0x${string}`,
  amount: "5",
  idempotencyKey: "intent-123456"
};

describe("PaymentService", () => {
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
