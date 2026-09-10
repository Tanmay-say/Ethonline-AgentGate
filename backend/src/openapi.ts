export const openApiDocument = {
  openapi: "3.0.3",
  info: { title: "AgentGate API", version: "0.1.0", description: "Testnet-only recipient-address privacy payment API." },
  servers: [{ url: "https://REPLACE_WITH_RAILWAY_DOMAIN" }],
  paths: {
    "/healthz": { get: { operationId: "health", responses: { "200": { description: "Service health" } } } },
    "/v1/capabilities": { get: { operationId: "getCapabilities", responses: { "200": { description: "Locked capabilities and privacy boundary" } } } },
    "/v1/recipients/{address}/meta-address": { get: { operationId: "getRecipientMetaAddress", security: [{ bearerAuth: [] }], parameters: [{ name: "address", in: "path", required: true, schema: { type: "string" } }], responses: { "404": { description: "Registry discovery unavailable; provide a manually verified meta-address" } } } },
    "/v1/payments/prepare": { post: { operationId: "preparePayment", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/PreparePaymentRequest" } } } }, responses: { "201": { description: "Prepared payment" }, "200": { description: "Existing idempotent payment" }, "409": { description: "Idempotency conflict" } } } },
    "/v1/payments/{id}": { get: { operationId: "getPayment", security: [{ bearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "200": { description: "Payment status" }, "404": { description: "Unknown payment" } } } },
    "/v1/payments/{id}/announce-tx": { get: { operationId: "getAnnouncementTransaction", security: [{ bearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], responses: { "503": { description: "Announcement contract configuration pending" } } } },
    "/v1/payments/{id}/transactions": { post: { operationId: "submitPaymentTransaction", security: [{ signerBearerAuth: [] }], parameters: [{ "$ref": "#/components/parameters/PaymentId" }], requestBody: { required: true, content: { "application/json": { schema: { "$ref": "#/components/schemas/TransactionUpdate" } } } }, responses: { "200": { description: "Updated payment status" }, "409": { description: "Invalid transition" } } } }
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" }, signerBearerAuth: { type: "http", scheme: "bearer" } },
    parameters: { PaymentId: { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } } },
    schemas: {
      PreparePaymentRequest: { type: "object", required: ["payer", "recipient_meta_address", "recipient_fingerprint", "token", "amount", "idempotency_key"], properties: { payer: { type: "string" }, recipient_meta_address: { type: "string" }, recipient_fingerprint: { type: "string" }, token: { type: "string" }, amount: { type: "string" }, idempotency_key: { type: "string" } } },
      TransactionUpdate: { type: "object", required: ["state"], properties: { state: { type: "string", enum: ["SUBMITTED", "CONFIRMING", "CONFIRMED", "RECONCILING", "REVERTED", "REJECTED", "EXPIRED"] }, transfer_tx_hash: { type: "string" }, announce_tx_hash: { type: "string" } } }
    }
  }
} as const;
