# AgentGate Documentation

> **AgentGate is an agent-native USDC payment gateway for AI agents on Base Sepolia.**  
> It enables AI agents to prepare payments to other agents using standard wallet addresses, while AgentGate routes privacy-sensitive payments through fresh ERC-5564 stealth addresses with zero private key custody in the gateway.

Official Website: [https://ethagentgate.vercel.app](https://ethagentgate.vercel.app)  
GitHub Repository: [https://github.com/Tanmay-say/Ethonline-AgentGate](https://github.com/Tanmay-say/Ethonline-AgentGate)  
Bazantic Gateway: [https://agentgate.bazgateway.com](https://agentgate.bazgateway.com)  
Live MCP Endpoint: [https://agentgate.bazgateway.com/mcp](https://agentgate.bazgateway.com/mcp)

---

## 1. Quick Start: Direct MCP Connection

AgentGate is integrated natively with the **Model Context Protocol (MCP)** via Bazantic. You can directly connect AI agents, Claude Code, Codex CLI, or Cursor to AgentGate without writing custom integration glue code.

### Option A: Codex / Claude Code CLI (One-Liner)

To connect your agent in one command:

```bash
codex mcp add backend-production --url https://agentgate.bazgateway.com/mcp
```

### Option B: Cursor / Claude Desktop (`mcp_config.json`)

Add AgentGate to your `mcp_config.json` configuration file:

```json
{
  "mcpServers": {
    "backend-production": {
      "url": "https://agentgate.bazgateway.com/mcp"
    }
  }
}
```

### Option C: Bazantic CLI Command

Execute requests directly using the Bazantic agent CLI:

```bash
baz curl https://agentgate.bazgateway.com --account wallet --json
```

---

## 2. What AgentGate Actually Is

The simplest explanation:

> **AgentGate lets AI agents prepare USDC payments to other agents using a normal wallet address, while AgentGate routes privacy-sensitive payments through a fresh ERC-5564 stealth address.**

The user or calling agent **never** needs to understand or manage ERC-5564 internals:
- ❌ No stealth meta-address required from user
- ❌ No ephemeral public key required from user
- ❌ No view tag required from user
- ❌ No curve arithmetic required from user

The user simply requests:
> *"Send 1 USDC privately to Agent B (0xA3b44...)."*

AgentGate resolves registered recipient metadata internally and generates a fresh one-time stealth destination.

---

## 3. Supported vs. Not Supported Privacy Scope

To maintain technical honesty and accuracy, AgentGate adheres to the following privacy specification:

- **Supported:** Recipient-address privacy. ERC-5564 avoids paying the recipient's primary address directly; an observer on BaseScan cannot link the stealth destination back to the recipient's public address without possessing the recipient's private viewing key.
- **Not Supported:** Sender anonymity, hidden amounts, hidden timing, or guaranteed unlinkability after spending. The sender's wallet is publicly visible as the source of the transfer and announcement.

---

## 4. System Architecture & Signer Isolation

```text
USER / AGENT
     │
     │ "Send 1 USDC privately to Agent B"
     ▼
┌───────────────────────────────┐
│           FRONTEND            │
│   https://ethagentgate.vercel.app  │
└───────────────┬───────────────┘
                │
                │ Agent prompt / Tool call
                ▼
┌───────────────────────────────┐
│       BAZANTIC GATEWAY        │
│   https://agentgate.bazgateway.com  │
│         (/mcp Endpoint)       │
└───────────────┬───────────────┘
                │
                │ Forwards preparePayment
                ▼
┌───────────────────────────────┐
│       AGENTGATE BACKEND       │
│    (Railway Production API)   │
└───────────────┬───────────────┘
                │
    ┌───────────┴───────────┐
    │ Recipient resolution  │
    │ Policy & spending cap │
    │ Fresh stealth derived │
    └───────────┬───────────┘
                ▼
┌───────────────────────────────┐
│     PAYMENT PLAN: PREPARED    │
│   (Idempotent, Zero Funds)    │
└───────────────┬───────────────┘
                │
       CUSTODY BOUNDARY (KEYS STAY OUTSIDE GATEWAY)
                │
                ▼
┌───────────────────────────────┐
│     ISOLATED LOCAL SIGNER     │
│   (Reviews plan, signs tx)    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         BASE SEPOLIA          │
│    Helper: 0x30981Aa2...1e0c  │
│    1 USDC Transfer + Announce │
└───────────────────────────────┘
```

### The Non-Negotiable Custody Boundary
- Bazantic, the MCP server, and the public Railway API **never hold or see the private signing key**.
- The gateway only prepares plans with state **`PREPARED`** (`next_step: local_signer_review`).
- Actual transaction signing and broadcasting are handled by an authorized isolated signer.
- This prevents AI agents from accidentally draining funds during model hallucination or retry loops.

---

## 5. The 6 Bazantic MCP Tools

The AgentGate MCP server exposes 6 structured JSON-RPC 2.0 tools:

| Tool | Purpose | Status |
|---|---|---|
| `preparePayment` | Prepares an idempotent stealth or standard payment plan | **Core Tool** |
| `getPayment` | Retrieves payment job state by `payment_id` | Live |
| `getCapabilities` | Returns Base Sepolia chain ID, token, helper, and announcer | Live |
| `health` | Readiness probe verifying database and service health | Live |
| `healthStatus` | High-level operational status | Live |
| `info` | Service metadata and versioning | Live |

### Example MCP `preparePayment` Tool Request:

```json
{
  "name": "preparePayment",
  "arguments": {
    "payer": "0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC",
    "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
    "amount": "1",
    "token": "USDC",
    "mode": "stealth",
    "idempotency_key": "mcp_req_9921b"
  }
}
```

### Returned Response:

```json
{
  "payment_id": "7b2600b6-53cd-4c36-953e-dc6711dad528",
  "state": "PREPARED",
  "mode": "STEALTH",
  "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
  "chain_id": 84532,
  "token": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "amount": "1",
  "amount_base_units": "1000000",
  "expires_at": "2026-09-13T07:48:46.847Z",
  "transfer_tx_hash": null,
  "announce_tx_hash": null,
  "next_step": "local_signer_review"
}
```

---

## 6. Bazantic Recipe

**Recipe Identifier:** `agentgate-private-usdc-payment`  
**Description:** Prepare privacy-preserving USDC payments to registered AgentGate recipients on Base Sepolia using ERC-5564 stealth addresses.

```yaml
recipe: agentgate-private-usdc-payment
service: https://agentgate.bazgateway.com
action: preparePayment

inputs:
  - payer: "${agent_wallet}"
  - recipient: "${agent_b_normal_address}"
  - amount: "${amount_usdc}"

enforced:
  token: "USDC"
  mode: "stealth"
  network: "base-sepolia"

state: PREPARED
security_boundary: "Private keys remain in isolated local companion."
```

---

## 7. Smart Contracts on Base Sepolia (Chain ID: 84532)

| Contract | Address | Verification |
|---|---|---|
| **AgentGate Payment Helper** | `0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c` | Sourcify & BaseScan Verified |
| **Base Sepolia USDC** | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Official Circle Testnet USDC |
| **ERC-5564 Announcer** | `0x55649E01B5Df198D18D95b5cc5051630cfD45564` | Standard Singleton |
| **ERC-6538 Registry** | `0x6538E6bf4B0eBd30A8Ea093027Ac2422ce5d6538` | Standard Singleton |

---

## 8. Verified On-Chain Proof

We have executed and confirmed an on-chain transaction proving this complete architecture on Base Sepolia:

- **Transaction Hash:** [`0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca`](https://sepolia.basescan.org/tx/0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca)
- **Payer (Agent A):** `0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC`
- **Recipient (Agent B):** `0xA3b44f604589354cB65b6DAd431486aB7383D833`
- **Fresh Stealth Destination:** `0x941D7869fAb7D6e88444dD0Bd62B295BA946f8C1`
- **Amount:** `1.000000 USDC`
- **Helper Contract:** `0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c`
- **Execution Proof:**
  - Transfer of 1 USDC to the derived stealth address succeeded.
  - ERC-5564 Announcement was emitted with ephemeral public key and view tag.
  - The recipient independently discovers the announcement and can spend the funds using their private spending key.

---

## 9. Public REST API Reference

All endpoints are reachable through the Bazantic Gateway:

### `GET /health`
Returns database readiness and endpoint status.

### `GET /v1/capabilities`
Returns chain ID (`84532`), network name (`base-sepolia`), token contract address, helper contract address, and privacy notices.

### `POST /v1/payments/prepare`
Prepares a payment plan.
```bash
curl -X POST "https://agentgate.bazgateway.com/v1/payments/prepare" \
  -H "Content-Type: application/json" \
  -d '{
    "payer": "0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC",
    "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
    "amount": "1",
    "token": "USDC",
    "mode": "stealth",
    "idempotency_key": "unique-request-id"
  }'
```

### `GET /v1/payments/:id`
Retrieves public status of a prepared payment by ID.

---

## 10. Security Invariants for Developers

1. **Zero Secrets in Frontend:** The frontend and browser runtimes never request or store private keys (`AGENTGATE_SIGNER_PRIVATE_KEY`), bearer tokens, or Supabase credentials.
2. **Prepared is not Sent:** `state: "PREPARED"` means the plan was verified and recorded; funds do not move until the authorized local signer executes the transaction.
3. **Idempotency Guarantee:** Payment preparation requires a client-provided `idempotency_key`, preventing duplicate transactions under agent retry conditions.
