# AgentGate Backend

Native Node.js/TypeScript Express backend service and CLI companions for the AgentGate testnet payment gateway on Base Sepolia.

---

## 🏗️ Architecture

The backend provides:
1. **Idempotent Payment Planning API**: Validates payment requests, enforces daily volume and per-payment caps, resolves registered recipient stealth meta-addresses, and generates fresh ERC-5564 stealth destinations.
2. **Phase 0 System Verification**: Verifies on-chain bytecode, RPC connectivity, USDC tokens, and singleton announcer contracts.
3. **Isolated Signer CLI (`signer-cli.ts`)**: An out-of-band signing process with independent approval gates and strict policy enforcement.
4. **Offline Recipient Companion (`recipient-cli.ts`)**: Offline ERC-5564 key generator, announcement log scanner, and autonomous spender.

```text
  [ AI Agent / MCP Client ]
             │
             │ POST /v1/payments/prepare
             ▼
  ┌───────────────────────────────┐
  │      Express API Service      │
  │  - ScopeLift ERC-5564 Deriver │
  │  - Spending Caps & Policies   │
  │  - Supabase / Postgres Store  │
  └──────────────┬────────────────┘
                 │
                 │ Returns Plan: state = PREPARED (Idempotent)
                 ▼
  ═════════════════════════════════
   CUSTODY BOUNDARY (NO KEYS HERE)
  ═════════════════════════════════
                 │
                 ▼
  ┌───────────────────────────────┐
  │     Isolated Signer CLI       │
  │  - Manual or Autonomous Demo  │
  │  - Checks Calldata & Limits   │
  │  - Signs with viem            │
  └──────────────┬────────────────┘
                 │
                 ▼
          [ Base Sepolia ]
```

---

## 🚀 Quick Start

### 1. Installation

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example configuration:
```bash
cp .env.example .env
```

Key environment variables:
```env
# Network Configuration
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# On-Chain Contracts (Base Sepolia)
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
HELPER_ADDRESS=0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c
ANNOUNCER_ADDRESS=0x55649E01B5Df198D18D95b5cc5051630cfD45564
REGISTRY_ADDRESS=0x6538E6bf4B0eBd30A8Ea093027Ac2422ce5d6538

# Persistence (Supabase Postgres or In-Memory)
DATABASE_URL=postgresql://user:password@host:5432/postgres

# Security & Limits
DAILY_MAX_USDC=5
PER_PAYMENT_MAX_USDC=1
API_BEARER_TOKEN=your-secret-api-token
SIGNER_BEARER_TOKEN=your-secret-signer-token
```

> [!IMPORTANT]
> Apply `supabase/migrations/001_initial.sql` to your Supabase SQL editor before setting `DATABASE_URL`. For local testing, omitting `DATABASE_URL` uses an in-memory repository.

### 3. Run Tests & Phase 0 Verification

```bash
# Run unit & integration tests
npm test

# Run Phase 0 on-chain bytecode & RPC verification
npm run phase0
```

### 4. Start Development Server

```bash
npm run dev
```

The API starts at `http://localhost:3000`.

---

## 📡 REST API Reference

### `GET /health` & `GET /healthz`
Healthcheck endpoint for container orchestration and uptime monitors.
- **Response `200 OK`**: `{ "status": "ok", "timestamp": "..." }`

### `GET /v1/capabilities`
Returns operational capabilities, network metadata, and contract addresses.
- **Response `200 OK`**:
```json
{
  "chain_id": 84532,
  "network": "base-sepolia",
  "token": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "helper": "0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c",
  "announcer": "0x55649E01B5Df198D18D95b5cc5051630cfD45564",
  "privacy": {
    "supported": "recipient-address privacy via ERC-5564",
    "not_supported": "sender anonymity, hidden amounts, hidden timing"
  }
}
```

### `POST /v1/payments/prepare`
Prepares an unsigned payment plan. Requires an `idempotency_key`.
- **Request Body**:
```json
{
  "payer": "0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC",
  "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
  "amount": "1",
  "token": "USDC",
  "mode": "stealth",
  "idempotency_key": "req_847291a"
}
```
- **Response `201 Created`**:
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
  "next_step": "local_signer_review"
}
```

### `GET /v1/payments/:id`
Retrieves status and transaction hashes of a prepared payment.

### `POST /v1/recipients`
Registers an agent handle, normal EVM address, and public ERC-5564 stealth meta-address.

---

## 🔐 Isolated Local Signer (`npm run signer`)

The signer operates outside the agent's filesystem and shell context to sign prepared transactions.

### Modes

1. **`MANUAL` (Default)**:
   - Prints full transaction calldata, recipient address, and amount in plain text.
   - Requires explicit operator input: `APPROVE <payment_id>` before signing.
   ```bash
   npm run signer -- --mode MANUAL
   ```

2. **`AUTONOMOUS_DEMO`**:
   - Bounded demo mode for automated evaluations.
   - Enforces strict invariants:
     - Target contract must be the verified Base Sepolia helper (`0x30981Aa2...1e0c`).
     - Token must be Base Sepolia testnet USDC.
     - Maximum **1 USDC** per payment.
     - Maximum **5 USDC** per UTC day.
     - Calldata must match exact atomic helper function selector.
     - Tracks daily usage in an isolated file specified by `AUTONOMOUS_DEMO_JOURNAL_PATH`.
   ```bash
   npm run signer -- --mode AUTONOMOUS_DEMO
   ```

> [!CAUTION]
> Provide `AGENTGATE_SIGNER_PRIVATE_KEY` only directly to the isolated signer process. Never put signing keys in backend environment files, repository commits, or database stores.

---

## 🔍 Offline Recipient Scanner (`npm run recipient`)

Recipients independently scan the blockchain and spend their funds without contacting AgentGate:

```bash
# 1. Generate new ERC-5564 spending and viewing keys
npm run recipient -- generate-keys

# 2. Scan Base Sepolia ERC-5564 announcements for incoming payments
npm run recipient -- scan \
  --rpc https://sepolia.base.org \
  --viewing-key <PRIVATE_VIEWING_KEY> \
  --spending-key <PRIVATE_SPENDING_KEY>

# 3. Transfer accumulated funds from a stealth address to a cold wallet
npm run recipient -- sweep \
  --stealth-address <STEALTH_ADDR> \
  --to <DESTINATION_ADDR>
```

---

## 📜 Scripts Reference

| Command | Action |
|---|---|
| `npm run dev` | Run development server with `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server in production |
| `npm test` | Execute test suite using Vitest |
| `npm run phase0` | Run preflight contract and RPC verification |
| `npm run signer` | Launch isolated local transaction signer |
| `npm run recipient` | Launch recipient key generator and scanner CLI |
