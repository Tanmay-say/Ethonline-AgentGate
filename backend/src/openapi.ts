export const openApiDocument = {
  openapi: "3.0.3",
  info: { title: "AgentGate API", version: "0.1.0", description: "Testnet-only recipient-address privacy payment API." },
  servers: [{ url: "https://backend-production-1ce76.up.railway.app" }],
  paths: {
    "/health": { get: { operationId: "healthStatus", responses: { "200": { description: "Service health" }, "503": { description: "Database unavailable" } } } },
    "/healthz": { get: { operationId: "health", responses: { "200": { description: "Service health" } } } },
    "/v1/capabilities": { get: { operationId: "getCapabilities", responses: { "200": { description: "Locked capabilities and privacy boundary" } } } },
    "/v1/payments/prepare": { post: { operationId: "preparePayment", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/PreparePaymentRequest" } } } }, responses: { "201": { description: "Prepared payment" }, "200": { description: "Existing idempotent payment" }, "409": { description: "Idempotency conflict" } } } },
    "/v1/payments/{id}": { get: { operationId: "getPayment", security: [{ bearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "200": { description: "Payment status without stealth internals" }, "404": { description: "Unknown payment" } } } }
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" }, signerBearerAuth: { type: "http", scheme: "bearer" } },
    parameters: { PaymentId: { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } } },
    schemas: {
      PreparePaymentRequest: { type: "object", required: ["payer", "recipient", "mode", "token", "amount", "idempotency_key"], properties: { payer: { type: "string" }, recipient: { type: "string", description: "Normal wallet address for either mode; STEALTH uses it only to resolve Agent B's registered stealth identity" }, mode: { type: "string", enum: ["standard", "stealth"] }, token: { type: "string" }, amount: { type: "string" }, idempotency_key: { type: "string" } } },
      RecipientRegistration: { type: "object", required: ["agent_id", "normal_address", "stealth_meta_address", "fingerprint"], properties: { agent_id: { type: "string" }, normal_address: { type: "string" }, stealth_meta_address: { type: "string" }, fingerprint: { type: "string" } } },
      TransactionSubmission: { type: "object", required: ["transaction_hash", "mode"], properties: { transaction_hash: { type: "string" }, mode: { type: "string", enum: ["standard", "stealth"] }, stealth_address: { type: "string" }, ephemeral_public_key: { type: "string" }, view_tag: { type: "string" } } }
    }
  }
} as const;
