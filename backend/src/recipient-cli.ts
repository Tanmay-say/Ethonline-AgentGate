import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { loadConfig } from "./config.js";
import { createRecipientKeys, recoverStealthAddress } from "./stealth.js";

const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ type: "bool" }] }
] as const;
type Keys = ReturnType<typeof createRecipientKeys>;
type Announcement = { stealthAddress: `0x${string}`; ephemeralPublicKey: `0x${string}`; viewTag: `0x${string}`; token?: `0x${string}`; amountBaseUnits?: string };
function fail(message: string): never { throw new Error(message); }
async function main() {
  const [command, arg] = process.argv.slice(2);
  if (command === "generate") {
    if (!arg || arg.includes("Ethonline_AgentGate")) fail("Choose a backup path outside the repository");
    const keys = createRecipientKeys();
    await writeFile(arg, JSON.stringify(keys, null, 2), { flag: "wx", mode: 0o600 });
    console.log(JSON.stringify({ stealth_meta_address_uri: keys.stealthMetaAddressURI, backup_file: arg }, null, 2));
    return;
  }
  if (command === "recover") {
    if (!arg || !process.argv[3]) fail("Usage: recover <keys.json> <announcement.json>");
    const keys = JSON.parse(await readFile(arg, "utf8")) as Keys;
    const announcement = JSON.parse(await readFile(process.argv[3], "utf8")) as Announcement;
    const recovered = recoverStealthAddress(keys, announcement);
    console.log(JSON.stringify({ stealth_address: recovered.stealthAddress, ownership_verified: true, private_key_held_in_memory: true }, null, 2));
    return;
  }
  if (command === "spend") {
    const keysPath = arg, announcementPath = process.argv[3], destination = process.argv[4];
    if (!keysPath || !announcementPath || !destination) fail("Usage: spend <keys.json> <announcement.json> <fresh-destination>");
    const config = loadConfig();
    if (!config.USDC_ADDRESS) fail("USDC_ADDRESS is required");
    const keys = JSON.parse(await readFile(keysPath, "utf8")) as Keys;
    const announcement = JSON.parse(await readFile(announcementPath, "utf8")) as Announcement;
    const recovered = recoverStealthAddress(keys, announcement);
    const client = createPublicClient({ chain: baseSepolia, transport: http(config.BASE_SEPOLIA_RPC_URL) });
    const wallet = createWalletClient({ account: privateKeyToAccount(recovered.stealthPrivateKey), chain: baseSepolia, transport: http(config.BASE_SEPOLIA_RPC_URL) });
    const token = config.USDC_ADDRESS as `0x${string}`;
    const balance = await client.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [recovered.stealthAddress] });
    if (balance === 0n) fail("STEALTH_BALANCE_IS_ZERO");
    const amount = announcement.amountBaseUnits ? BigInt(announcement.amountBaseUnits) : balance;
    if (amount > balance) fail("SPEND_EXCEEDS_STEALTH_BALANCE");
    const txHash = await wallet.writeContract({ address: token, abi: erc20Abi, functionName: "transfer", args: [destination as `0x${string}`, amount] });
    await client.waitForTransactionReceipt({ hash: txHash });
    console.log(JSON.stringify({ stealth_address: recovered.stealthAddress, balance_base_units: balance.toString(), spent_base_units: amount.toString(), destination, transaction_hash: txHash }, null, 2));
    return;
  }
  fail("Usage: generate <outside-repo-path> | recover <keys.json> <announcement.json> | spend <keys.json> <announcement.json> <destination>");
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
