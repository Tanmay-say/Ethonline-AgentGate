# AgentGate Smart Contracts

Foundry smart contract project for the AgentGate atomic stealth payment helper on **Base Sepolia (Chain ID: 84532)**.

---

## 🎯 Overview

AgentGate uses standard ERC-5564 stealth address infrastructure. To ensure transactions execute smoothly in a single agent step, AgentGate deploys a lightweight, atomic payment helper contract:

- **`AgentGatePaymentHelper.sol`**: An atomic contract that pulls approved USDC from the sender, transfers it to the freshly derived ERC-5564 stealth address, and emits the ERC-5564 announcement with the ephemeral public key and view tag in a **single transaction**.
- **Non-Custodial**: The helper contract never holds custody of funds; all tokens are routed immediately within the atomic transaction.
- **Canonical Singletons**: Works in tandem with the canonical ERC-5564 Announcer and ERC-6538 Registry singletons.

---

## 📍 Deployed Contracts (Base Sepolia)

| Contract | Address | Verification |
|---|---|---|
| **AgentGate Payment Helper** | [`0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c`](https://sepolia.basescan.org/address/0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c) | [Sourcify](https://repo.sourcify.dev/contracts/full_match/84532/0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c/) & BaseScan Verified |
| **Testnet USDC** | [`0x036CbD53842c5426634e7929541eC2318f3dCF7e`](https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e) | Official Circle Base Sepolia |
| **ERC-5564 Announcer** | [`0x55649E01B5Df198D18D95b5cc5051630cfD45564`](https://sepolia.basescan.org/address/0x55649E01B5Df198D18D95b5cc5051630cfD45564) | Canonical Reference Singleton |
| **ERC-6538 Registry** | [`0x6538E6bf4B0eBd30A8Ea093027Ac2422ce5d6538`](https://sepolia.basescan.org/address/0x6538E6bf4B0eBd30A8Ea093027Ac2422ce5d6538) | Canonical Reference Singleton |

---

## 🛠️ Local Setup & Testing

### Prerequisites

Install [Foundry](https://getfoundry.sh/):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 1. Install Dependencies

```bash
cd contracts
forge install --no-git https://github.com/foundry-rs/forge-std lib/forge-std
```

### 2. Build Contracts

```bash
forge build
```

### 3. Run Test Suite

```bash
# Run all tests with detailed traces
forge test -vvv
```

The test suite validates:
- Atomic USDC transfer + announcement event emission.
- Exact allowance handling and zero leftover allowance.
- Rejection of unauthorized or mismatched transfers.
- Correct encoding of Scheme-1 metadata, ephemeral public keys, and view tags.

---

## 🚀 Deployment

The deployment script is located in `script/Deploy.s.sol`.

### Environment Variables

Ensure your environment includes:
```bash
export BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
export DEPLOYER_PRIVATE_KEY="0x..."
export BASESCAN_API_KEY="your-basescan-api-key"
```

### Run Deployment

```bash
forge script script/Deploy.s.sol \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

> [!WARNING]
> Keep `DEPLOYER_PRIVATE_KEY` strictly local and ephemeral. Never commit keys or secrets to version control.

---

## 🔒 Security Invariants

1. **Immutable Target Token**: The payment helper binds immutably to the verified USDC contract on initialization.
2. **Zero Custody**: The contract does not store funds; balances after execution are always zero.
3. **No Upgradeable Proxies**: The contract is an immutable, non-upgradeable singleton with deterministic behavior.
