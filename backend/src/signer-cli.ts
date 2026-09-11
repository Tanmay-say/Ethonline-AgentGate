import "dotenv/config";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createPublicClient, createWalletClient, encodeFunctionData, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { loadConfig } from "./config.js";
import { deriveStealthDestination } from "./stealth.js";
import { AUTONOMOUS_DEMO_HELPER, AUTONOMOUS_DEMO_MAX_DAILY_BASE_UNITS, AUTONOMOUS_DEMO_TOKEN, expectedAutonomousCalldata, isPaymentReserved, validateAutonomousIntent } from "./signer-policy.js";

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
  mode?: "STANDARD" | "STEALTH" | "standard" | "stealth";
  recipient: string;
  payer: `0x${string}`;
  recipient_meta_address?: string | null;
  recipient_fingerprint?: string | null;
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
  const mode = process.env.SIGNER_MODE ?? "MANUAL";
  if (mode !== "MANUAL" && mode !== "AUTONOMOUS_DEMO") fail("SIGNER_MODE must be MANUAL or AUTONOMOUS_DEMO");
  if (!config.USDC_ADDRESS) fail("USDC_ADDRESS is required");
  const secret = process.env.AGENTGATE_SIGNER_PRIVATE_KEY;
  if (!secret || !/^0x[0-9a-fA-F]{64}$/.test(secret)) fail("AGENTGATE_SIGNER_PRIVATE_KEY must exist only in the isolated signer process environment");
  const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;
  const token = config.USDC_ADDRESS as `0x${string}`;
  const helper = config.HELPER_ADDRESS as `0x${string}` | undefined;
  const paymentMode = (plan.mode ?? "STEALTH").toUpperCase() as "STANDARD" | "STEALTH";
  const account = privateKeyToAccount(secret as `0x${string}`);
  const rpcUrl = config.BASE_SEPOLIA_RPC_URL;
  const rpcTransport = http(rpcUrl);
  const publicClient = createPublicClient({ chain: baseSepolia, transport: rpcTransport });
  const walletClient = createWalletClient({ account, chain: baseSepolia, transport: rpcTransport });
  const chainId = await publicClient.getChainId();
  if (chainId !== config.BASE_SEPOLIA_CHAIN_ID || plan.chain_id !== chainId) fail("CHAIN_ID_MISMATCH");
  if (account.address.toLowerCase() !== plan.payer.toLowerCase()) fail("SIGNER_ACCOUNT_DOES_NOT_MATCH_PLAN_PAYER");
  if (new Date(plan.expires_at).getTime() <= Date.now()) fail("PLAN_EXPIRED");
  if (plan.token.toLowerCase() !== token.toLowerCase()) fail("TOKEN_MISMATCH");
  if (paymentMode === "STEALTH" && (!helper || !config.ANNOUNCER_ADDRESS || !plan.recipient_meta_address)) fail("STEALTH_PLAN_INCOMPLETE");
  if (paymentMode === "STANDARD" && !/^0x[a-fA-F0-9]{40}$/.test(plan.recipient)) fail("INVALID_STANDARD_RECIPIENT");
  if (paymentMode === "STEALTH") {
    const [helperToken, helperAnnouncer] = await Promise.all([
      publicClient.readContract({ address: helper!, abi: helperAbi, functionName: "token" }),
      publicClient.readContract({ address: helper!, abi: helperAbi, functionName: "announcer" })
    ]);
    if (helperToken.toLowerCase() !== token.toLowerCase()) fail("HELPER_TOKEN_IMMUTABLE_MISMATCH");
    if (helperAnnouncer.toLowerCase() !== config.ANNOUNCER_ADDRESS!.toLowerCase()) fail("HELPER_ANNOUNCER_IMMUTABLE_MISMATCH");
  }
  const amount = BigInt(plan.amount_base_units ?? parseUnits(plan.amount, config.USDC_DECIMALS).toString());
  if (amount <= 0n || amount > config.MAX_PAYMENT_BASE_UNITS) fail("AMOUNT_OUT_OF_POLICY");
  const stealth = paymentMode === "STEALTH" ? deriveStealthDestination(plan.recipient_meta_address!) : undefined;
  const [balance, allowance] = await Promise.all([
    publicClient.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [account.address] }),
    paymentMode === "STEALTH" ? publicClient.readContract({ address: token, abi: erc20Abi, functionName: "allowance", args: [account.address, helper!] }) : Promise.resolve(0n)
  ]);
  if (balance < amount) fail("INSUFFICIENT_USDC_BALANCE");
  const metadata = stealth?.viewTag;
  const calldata = paymentMode === "STEALTH"
    ? expectedAutonomousCalldata({ amountBaseUnits: amount, stealthAddress: stealth!.stealthAddress, ephemeralPublicKey: stealth!.ephemeralPublicKey, metadata: metadata! })
    : encodeFunctionData({ abi: [{ type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "value", type: "uint256" }], outputs: [{ type: "bool" }] }] as const, functionName: "transfer", args: [plan.recipient as `0x${string}`, amount] });
  let journalPath: string | undefined;
  let dailySpent = 0n;
  if (mode === "AUTONOMOUS_DEMO") {
    if (token.toLowerCase() !== AUTONOMOUS_DEMO_TOKEN.toLowerCase() || (paymentMode === "STEALTH" && (!helper || helper.toLowerCase() !== AUTONOMOUS_DEMO_HELPER.toLowerCase()))) fail("AUTONOMOUS_DEMO_DEPLOYMENT_NOT_ALLOWED");
    journalPath = process.env.AUTONOMOUS_DEMO_JOURNAL_PATH;
    if (!journalPath) fail("AUTONOMOUS_DEMO_JOURNAL_PATH is required outside the repository");
    const journalRelativePath = relative(resolve(process.cwd()), resolve(journalPath));
    const journalInsideRuntime = journalRelativePath === "" || (journalRelativePath !== ".." && !journalRelativePath.startsWith(`..${sep}`) && !isAbsolute(journalRelativePath));
    if (!isAbsolute(journalPath) || journalInsideRuntime) fail("AUTONOMOUS_DEMO_JOURNAL_PATH must be absolute and outside the signer runtime");
    const journal = await readJournal(journalPath);
    dailySpent = journal.date === utcDate() ? BigInt(journal.spentBaseUnits) : 0n;
    if (isPaymentReserved(journal.paymentIds, plan.payment_id)) fail("AUTONOMOUS_DEMO_PAYMENT_ALREADY_RESERVED");
    validateAutonomousIntent({ paymentId: plan.payment_id, mode: paymentMode, chainId, payer: account.address, token, helper, recipient: plan.recipient as `0x${string}`, amountBaseUnits: amount, stealthAddress: stealth?.stealthAddress, ephemeralPublicKey: stealth?.ephemeralPublicKey, metadata, calldata, expiresAt: plan.expires_at }, dailySpent);
    await reserveJournal(journalPath, dailySpent + amount, [...(journal.date === utcDate() ? journal.paymentIds : []), plan.payment_id], plan.payment_id);
  }
  const intent = { payment_id: plan.payment_id, mode: paymentMode.toLowerCase(), chain_id: chainId, signer: account.address, helper: helper ?? null, token, recipient: plan.recipient, amount_base_units: amount.toString(), stealth_address: stealth?.stealthAddress ?? null, ephemeral_public_key: stealth?.ephemeralPublicKey ?? null, view_tag: stealth?.viewTag ?? null, recipient_fingerprint: plan.recipient_fingerprint ?? null };
  console.log(JSON.stringify(intent, null, 2));
  if (mode === "MANUAL") {
    const rl = createInterface({ input, output });
    const approval = (await rl.question(`Type APPROVE ${plan.payment_id} to authorize this exact testnet payment: `)).trim();
    if (approval !== `APPROVE ${plan.payment_id}`) fail("HUMAN_APPROVAL_NOT_GRANTED");
  }
  if (paymentMode === "STEALTH" && allowance < amount) {
    const approvalHash = await walletClient.writeContract({ address: token, abi: erc20Abi, functionName: "approve", args: [helper as `0x${string}`, amount] });
    await publicClient.waitForTransactionReceipt({ hash: approvalHash });
    console.log(`approval_tx_hash=${approvalHash}`);
  }
  const [currentBlock, currentAllowance, currentBalance] = await Promise.all([
    publicClient.getBlockNumber(),
    paymentMode === "STEALTH" ? publicClient.readContract({ address: token, abi: erc20Abi, functionName: "allowance", args: [account.address, helper!] }) : Promise.resolve(0n),
    publicClient.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [account.address] })
  ]);
  console.log(JSON.stringify({ rpc_hostname: new URL(rpcUrl).hostname, current_block: currentBlock.toString(), allowance: currentAllowance.toString(), balance: currentBalance.toString(), helper: helper ?? null, token, payment_id: plan.payment_id }, null, 2));
  const transaction = { to: (paymentMode === "STEALTH" ? helper : token) as `0x${string}`, data: calldata, value: 0n, chain: baseSepolia } as const;
  try {
    await publicClient.call({ account: account.address, to: transaction.to, data: transaction.data, value: transaction.value });
    console.log("SIMULATION_OK");
  } catch (error) {
    console.error("SIMULATION_REVERT", error instanceof Error ? error.message : error);
    return;
  }
  const txHash = await walletClient.sendTransaction(transaction);
  console.log(`payment_tx_hash=${txHash}`);
  await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log(JSON.stringify({ ...intent, transaction_hash: txHash }, null, 2));
}
type DemoJournal = { date: string; spentBaseUnits: string; paymentIds: string[] };
function utcDate(): string { return new Date().toISOString().slice(0, 10); }
async function readJournal(path: string): Promise<DemoJournal> {
  try { return JSON.parse(await readFile(path, "utf8")) as DemoJournal; }
  catch { return { date: utcDate(), spentBaseUnits: "0", paymentIds: [] }; }
}
async function reserveJournal(path: string, spentBaseUnits: bigint, paymentIds: string[], newPaymentId: string): Promise<void> {
  if (spentBaseUnits > AUTONOMOUS_DEMO_MAX_DAILY_BASE_UNITS) fail("AUTONOMOUS_DEMO_DAILY_LIMIT_EXCEEDED");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify({ date: utcDate(), spentBaseUnits: spentBaseUnits.toString(), paymentIds }, null, 2), { flag: "wx" }).catch(async (error: NodeJS.ErrnoException) => {
    if (error.code !== "EEXIST") throw error;
    const current = await readJournal(path);
    if (isPaymentReserved(current.paymentIds, newPaymentId)) fail("AUTONOMOUS_DEMO_PAYMENT_ALREADY_RESERVED");
    await writeFile(path, JSON.stringify({ date: utcDate(), spentBaseUnits: spentBaseUnits.toString(), paymentIds }, null, 2));
  });
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
