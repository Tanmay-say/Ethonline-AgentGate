#!/usr/bin/env bash
set -euo pipefail

export PATH="/c/Users/lenovo/.foundry/bin:$PATH"
set -a
source "$(dirname "$0")/../.env"
set +a

HELPER_ADDRESS="${HELPER_ADDRESS:?Set HELPER_ADDRESS to the deployed public address}"
echo "HELPER_CODE_BYTES=$(cast code "$HELPER_ADDRESS" --rpc-url "$BASE_SEPOLIA_RPC_URL" | wc -c)"
echo "HELPER_TOKEN=$(cast call "$HELPER_ADDRESS" 'token()(address)' --rpc-url "$BASE_SEPOLIA_RPC_URL")"
echo "HELPER_ANNOUNCER=$(cast call "$HELPER_ADDRESS" 'announcer()(address)' --rpc-url "$BASE_SEPOLIA_RPC_URL")"
