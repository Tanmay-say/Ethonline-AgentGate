import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { loadConfig } from "./config.js";
import { deriveStealthDestination } from "./stealth.js";

const erc20Abi = [
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] }
] as const;
const helperAbi = [
  { type: "function", name: "payAndAnnounce", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }, { name: "stealthAddress", type: "address" }, { name: "ephemeralPublicKey", type: "bytes" }, { name: "metadata", type: "bytes" }], outputs: [] },
  { type: "function", name: "token", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "announcer", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] }
] as const;

type Plan = {
  payment_id: string;
  payer: `0x${string}`;
  recipient_meta_address: string;
  recipient_fingerprint: string;
  token: `0x${string}`;
  amount: string;
  amount_base_units?: string;
  chain_id: number;
  expires_at: string;
};

function fail(message: string): never { throw new Error(message); }
async function main() {
  const planPath = process.argv[2];
  if (!planPath) fail("Usage: npm run signer -- <prepared-plan.json>");
  const config = loadConfig();
  if (!config.HELPER_ADDRESS || !config.USDC_ADDRESS || !config.ANNOUNCER_ADDRESS) fail("USDC_ADDRESS, ANNOUNCER_ADDRESS, and HELPER_ADDRESS are required");
  const secret = process.env.AGENTGATE_SIGNER_PRIVATE_KEY;
  if (!secret || !/^0x[0-9a-fA-F]{64}$/.test(secret)) fail("AGENTGATE_SIGNER_PRIVATE_KEY must exist only in the isolated signer process environment");
  const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;
  const token = config.USDC_ADDRESS as `0x${string}`;
  const helper = config.HELPER_ADDRESS as `0x${string}`;
  const account = privateKeyToAccount(secret as `0x${string}`);
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http(config.BASE_SEPOLIA_RPC_URL) });
  const walletClient = createWalletClient({ account, chain: baseSepolia, transport: http(config.BASE_SEPOLIA_RPC_URL) });
  const chainId = await publicClient.getChainId();
  if (chainId !== config.BASE_SEPOLIA_CHAIN_ID || plan.chain_id !== chainId) fail("CHAIN_ID_MISMATCH");
  if (account.address.toLowerCase() !== plan.payer.toLowerCase()) fail("SIGNER_ACCOUNT_DOES_NOT_MATCH_PLAN_PAYER");
  if (new Date(plan.expires_at).getTime() <= Date.now()) fail("PLAN_EXPIRED");
  if (plan.token.toLowerCase() !== config.USDC_ADDRESS.toLowerCase()) fail("TOKEN_MISMATCH");
  const [helperToken, helperAnnouncer] = await Promise.all([
    publicClient.readContract({ address: helper, abi: helperAbi, functionName: "token" }),
    publicClient.readContract({ address: helper, abi: helperAbi, functionName: "announcer" })
  ]);
  if (helperToken.toLowerCase() !== token.toLowerCase()) fail("HELPER_TOKEN_IMMUTABLE_MISMATCH");
  if (helperAnnouncer.toLowerCase() !== config.ANNOUNCER_ADDRESS.toLowerCase()) fail("HELPER_ANNOUNCER_IMMUTABLE_MISMATCH");
  const amount = BigInt(plan.amount_base_units ?? parseUnits(plan.amount, config.USDC_DECIMALS).toString());
  if (amount <= 0n || amount > config.MAX_PAYMENT_BASE_UNITS) fail("AMOUNT_OUT_OF_POLICY");
  const stealth = deriveStealthDestination(plan.recipient_meta_address);
  const [balance, allowance] = await Promise.all([
    publicClient.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [account.address] }),
    publicClient.readContract({ address: token, abi: erc20Abi, functionName: "allowance", args: [account.address, helper] })
  ]);
  if (balance < amount) fail("INSUFFICIENT_USDC_BALANCE");
  const metadata = stealth.viewTag;
  const intent = { payment_id: plan.payment_id, chain_id: chainId, signer: account.address, helper, token, amount_base_units: amount.toString(), stealth_address: stealth.stealthAddress, ephemeral_public_key: stealth.ephemeralPublicKey, view_tag: stealth.viewTag, recipient_fingerprint: plan.recipient_fingerprint };
  console.log(JSON.stringify(intent, null, 2));
  const rl = createInterface({ input, output });
  const approval = (await rl.question(`Type APPROVE ${plan.payment_id} to authorize this exact testnet payment: `)).trim();
  if (approval !== `APPROVE ${plan.payment_id}`) fail("HUMAN_APPROVAL_NOT_GRANTED");
  if (allowance < amount) {
    const approvalHash = await walletClient.writeContract({ address: token, abi: erc20Abi, functionName: "approve", args: [helper, amount] });
    await publicClient.waitForTransactionReceipt({ hash: approvalHash });
    console.log(`approval_tx_hash=${approvalHash}`);
  }
  const txHash = await walletClient.writeContract({ address: helper, abi: helperAbi, functionName: "payAndAnnounce", args: [amount, stealth.stealthAddress, stealth.ephemeralPublicKey, metadata] });
  console.log(`payment_tx_hash=${txHash}`);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log(JSON.stringify({ ...intent, transaction_hash: txHash }, null, 2));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
