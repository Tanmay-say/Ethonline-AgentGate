import { createPublicClient, getAddress, http } from "viem";
import { baseSepolia } from "viem/chains";
import { ERC5564_CONTRACT_ADDRESS, ERC6538_CONTRACT_ADDRESS } from "@scopelift/stealth-address-sdk/dist/config/index.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const client = createPublicClient({ chain: baseSepolia, transport: http(config.BASE_SEPOLIA_RPC_URL) });

const chainId = await client.getChainId();
const checks: { name: string; ok: boolean; value: string | number }[] = [{ name: "chain_id", ok: chainId === 84532, value: chainId }];
for (const [name, address] of [["erc5564_announcer", ERC5564_CONTRACT_ADDRESS]] as const) {
  const code = await client.getCode({ address: getAddress(address) });
  checks.push({ name, ok: Boolean(code && code !== "0x"), value: code ? `${code.slice(0, 10)}...` : "0x" });
}
const registryCode = await client.getCode({ address: getAddress(ERC6538_CONTRACT_ADDRESS) });
checks.push({ name: "erc6538_registry_info", ok: Boolean(registryCode && registryCode !== "0x"), value: registryCode ? `${registryCode.slice(0, 10)}...` : "0x" });
if (config.USDC_ADDRESS) {
  const code = await client.getCode({ address: getAddress(config.USDC_ADDRESS) });
  checks.push({ name: "configured_usdc", ok: Boolean(code && code !== "0x"), value: code ? `${code.slice(0, 10)}...` : "0x" });
} else {
  checks.push({ name: "configured_usdc", ok: false, value: "USDC_ADDRESS is not configured" });
}
console.table(checks);
if (checks.some((check) => !check.ok && check.name !== "erc6538_registry_info")) {
  console.error("PHASE_0_BLOCKED: Base Sepolia is not locked until every required check passes.");
  process.exitCode = 1;
} else {
  console.log("PHASE_0_PASS: Base Sepolia may be locked after recording the verified addresses and evidence.");
}
