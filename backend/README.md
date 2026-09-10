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
