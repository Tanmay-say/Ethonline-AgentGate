#!/usr/bin/env bash
set -euo pipefail

export PATH="/c/Users/lenovo/.foundry/bin:$PATH"
set -a
source "$(dirname "$0")/../.env"
set +a

export USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
export ANNOUNCER_ADDRESS=0x55649E01B5Df198D18D95b5cc5051630cfD45564
HELPER_ADDRESS="${HELPER_ADDRESS:?Set HELPER_ADDRESS to the deployed public address}"
ARGS=$(cast abi-encode 'constructor(address,address)' "$USDC_ADDRESS" "$ANNOUNCER_ADDRESS")

forge verify-contract "$HELPER_ADDRESS" src/AgentGatePaymentHelper.sol:AgentGatePaymentHelper \
  --chain-id 84532 \
  --constructor-args "$ARGS" \
  --verifier sourcify \
  --watch
