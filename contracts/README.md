# AgentGate contracts

Foundry project for the optional atomic Base Sepolia payment helper.

The ERC-5564 Announcer and ERC-6538 Registry are canonical contracts verified during Phase 0. ERC-6538 discovery is not required for MVP payments; recipients provide a manually verified scheme-1 meta-address.

## Windows setup

The repository already contains a local `.env`; keep `DEPLOYER_PRIVATE_KEY` local. Run from `contracts` after installing Foundry and adding `forge-std`:

```powershell
forge install --no-git https://github.com/foundry-rs/forge-std lib/forge-std
forge build
forge test
forge script script/Deploy.s.sol --rpc-url $env:BASE_SEPOLIA_RPC_URL --broadcast --verify
```

Do not run deployment until the helper tests, exact allowance policy, and human approval flow pass.
