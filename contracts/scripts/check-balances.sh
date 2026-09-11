#!/usr/bin/env bash
set -euo pipefail

export PATH="/c/Users/lenovo/.foundry/bin:$PATH"
set -a
source "$(dirname "$0")/../.env"
set +a

echo "CHAIN_ID=$(cast chain-id --rpc-url "$BASE_SEPOLIA_RPC_URL")"
echo "DEPLOYER_NATIVE_BALANCE=$(cast balance "$PUBLIC_KEY" --rpc-url "$BASE_SEPOLIA_RPC_URL")"
echo "DEPLOYER_TEST_USDC_BALANCE=$(cast call 0x036CbD53842c5426634e7929541eC2318f3dCF7e 'balanceOf(address)(uint256)' "$PUBLIC_KEY" --rpc-url "$BASE_SEPOLIA_RPC_URL")"
