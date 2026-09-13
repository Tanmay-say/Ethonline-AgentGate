# AgentGate Frontend

The official web application and developer interface for **AgentGate**, hosted live at [ethagentgate.vercel.app](https://ethagentgate.vercel.app).

---

## ✨ Features

- **Payment Studio**: Intuitive UI to prepare stealth payments, inspect generated payment plans, and view derived ERC-5564 stealth destinations.
- **Custody Boundary Visualizer**: Explains how AgentGate isolates signing keys from AI agents and cloud servers.
- **On-Chain Proof Explorer**: Links directly to verified demo transactions and deployed contracts on BaseScan.
- **Injected Wallet Integration**: Connects to MetaMask, Coinbase Wallet, or Rabby, with automatic network switching to **Base Sepolia (Chain ID: 84532)**.
- **Bazantic & MCP Guide**: Step-by-step instructions and recipes for integrating autonomous agents.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Local Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example configuration:
```bash
cp .env.example .env
```

Default environment variables:
```env
# AgentGate API Endpoint
VITE_API_URL=https://agentgate.bazgateway.com

# Base Sepolia Contract Addresses
VITE_CHAIN_ID=84532
VITE_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
VITE_HELPER_ADDRESS=0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will run locally at `http://localhost:5173`.

---

## 📦 Build & Deployment

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output is generated in `frontend/dist/`.

---

## 🔒 Security Principles

1. **Zero Key Storage**: The web application never asks for, stores, or accesses private signing keys.
2. **Read-Only Coordination**: The web interface connects to read and prepare plans; actual token transfer signing is conducted by the user's browser wallet extension on-chain.
