export const openApiDocument = {
  openapi: "3.0.3",
  info: { title: "AgentGate API", version: "0.1.0", description: "Testnet-only recipient-address privacy payment API." },
  servers: [{ url: "https://REPLACE_WITH_RAILWAY_DOMAIN" }],
  paths: {
    "/healthz": { get: { operationId: "health", responses: { "200": { description: "Service health" } } } },
    "/v1/capabilities": { get: { operationId: "getCapabilities", responses: { "200": { description: "Locked capabilities and privacy boundary" } } } },
    "/v1/recipients": { post: { operationId: "registerRecipient", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/RecipientRegistration" } } } }, responses: { "201": { description: "Recipient registered" } } } },
    "/v1/payments/prepare": { post: { operationId: "preparePayment", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/PreparePaymentRequest" } } } }, responses: { "201": { description: "Prepared payment" }, "200": { description: "Existing idempotent payment" }, "409": { description: "Idempotency conflict" } } } },
    "/v1/payments/{id}": { get: { operationId: "getPayment", security: [{ bearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "200": { description: "Payment status without stealth internals" }, "404": { description: "Unknown payment" } } } },
    "/v1/payments/{id}/signer-plan": { get: { operationId: "getSignerPlan", security: [{ signerBearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "200": { description: "Signer-only plan with internal stealth data" } } } },
    "/v1/payments/{id}/announce-tx": { get: { operationId: "getAnnouncementTransaction", security: [{ bearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "503": { description: "Announcement contract configuration pending" } } } },
    "/v1/payments/{id}/transactions": { post: { operationId: "submitPaymentTransaction", security: [{ signerBearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/TransactionSubmission" } } } }, responses: { "200": { description: "Chain-verified payment status" }, "409": { description: "Invalid submission" } } } }
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
