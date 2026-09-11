import { describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createRecipientKeys } from "./stealth.js";

describe("recipient-address payment UX", () => {
  it("keeps Agent A's request simple and hides stealth metadata", async () => {
    const apiToken = "api-token-for-app-test-1234";
    const signerToken = "signer-token-for-app-test-1234";
    const config = loadConfig({ NODE_ENV: "test", API_BEARER_TOKEN: apiToken, SIGNER_BEARER_TOKEN: signerToken, USDC_ADDRESS: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", ANNOUNCER_ADDRESS: "0x55649E01B5Df198D18D95b5cc5051630cfD45564", HELPER_ADDRESS: "0x315825c5FaA23a091FD442a6658e769b76f14202" });
    const server = await new Promise<Server>((resolve) => {
      const instance = createApp(config).listen(0, () => resolve(instance));
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("test server did not bind");
    const base = `http://127.0.0.1:${address.port}`;
    const headers = { "content-type": "application/json", authorization: `Bearer ${apiToken}` };
    try {
      const keys = createRecipientKeys();
      const normalAddress = "0xA3b44f604589354cB65b6DAd431486aB7383D833";
      const registration = await fetch(`${base}/v1/recipients`, { method: "POST", headers, body: JSON.stringify({ agent_id: "agentB", normal_address: normalAddress, stealth_meta_address: keys.stealthMetaAddressURI, fingerprint: "agent-b-fingerprint" }) });
      expect(registration.status).toBe(201);
      const stealth = await fetch(`${base}/v1/payments/prepare`, { method: "POST", headers, body: JSON.stringify({ payer: "0x1111111111111111111111111111111111111111", recipient: normalAddress, amount: "1", token: "USDC", mode: "stealth", idempotency_key: "api-stealth-test-1234" }) });
      expect(stealth.status).toBe(201);
      const stealthBody = await stealth.json() as Record<string, unknown>;
      expect(stealthBody.mode).toBe("STEALTH");
      expect(stealthBody.recipient_meta_address).toBeUndefined();
      expect(stealthBody.recipient_fingerprint).toBeUndefined();
      const signerPlan = await fetch(`${base}/v1/payments/${stealthBody.payment_id}/signer-plan`, { headers: { authorization: `Bearer ${signerToken}` } });
      const signerBody = await signerPlan.json() as Record<string, unknown>;
      expect(signerBody.recipient_meta_address).toBe(keys.stealthMetaAddressURI);
      const standard = await fetch(`${base}/v1/payments/prepare`, { method: "POST", headers, body: JSON.stringify({ payer: "0x1111111111111111111111111111111111111111", recipient: normalAddress, amount: "1", token: "USDC", mode: "standard", idempotency_key: "api-standard-test-1234" }) });
      expect(standard.status).toBe(201);
      expect((await standard.json()).mode).toBe("STANDARD");
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
