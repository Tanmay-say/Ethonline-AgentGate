# AgentGate backend

Native Windows Node.js/TypeScript Express service for the AgentGate testnet MVP.

## Local setup

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run build
npm.cmd test
npm.cmd run dev
```

The development process does not require Docker, WSL, Linux, or Docker Compose. The server and Phase 0 command load `backend/.env` automatically. Production requires `DATABASE_URL` and the deployed Base Sepolia configuration; production never uses the in-memory repository.

Apply `supabase/migrations/001_initial.sql` to the Supabase SQL editor before setting `DATABASE_URL`. Credentials are intentionally not committed; add them later through Railway environment variables or a local `.env` file.

## Local signer modes

The signer defaults to `SIGNER_MODE=MANUAL` and requires typing `APPROVE <payment_id>` after reviewing the exact intent. `SIGNER_MODE=AUTONOMOUS_DEMO` is bounded to the deployed Base Sepolia USDC/helper, one USDC per payment, five USDC per UTC day, and an exact helper calldata shape. It requires `AUTONOMOUS_DEMO_JOURNAL_PATH` outside the repository. Use only a disposable testnet wallet and provide `AGENTGATE_SIGNER_PRIVATE_KEY` to the isolated signer process; never place that key in `.env`, plans, logs, or this repository.

Register Agent B's `agent_id`, normal address, and public stealth identity once through `POST /v1/recipients`. A later STEALTH prepare request may contain only that normal address; the public payment response does not include the registered stealth metadata, while the signer-only plan does.
