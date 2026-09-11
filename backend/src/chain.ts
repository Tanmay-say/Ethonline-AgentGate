import { createPublicClient, http, parseEventLogs } from "viem";
import { baseSepolia } from "viem/chains";
import type { Config } from "./config.js";
import type { PaymentJob } from "./domain.js";

const erc20TransferAbi = [{
  type: "event",
  name: "Transfer",
  inputs: [
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "value", type: "uint256" }
  ]
}] as const;

const erc5564AnnouncementAbi = [{
  type: "event",
  name: "Announcement",
  inputs: [
    { indexed: true, name: "schemeId", type: "uint256" },
    { indexed: true, name: "stealthAddress", type: "address" },
    { indexed: true, name: "caller", type: "address" },
    { indexed: false, name: "ephemeralPubKey", type: "bytes" },
    { indexed: false, name: "metadata", type: "bytes" }
  ]
}] as const;

export type ChainPaymentResult = {
  status: "SUBMITTED" | "CONFIRMING" | "CONFIRMED" | "RECONCILING" | "REVERTED";
  reason?: string;
};

function createBaseClient(rpcUrl: string) {
  return createPublicClient({ chain: baseSepolia, transport: http(rpcUrl) });
}

export class BaseSepoliaVerifier {
  private readonly client: ReturnType<typeof createBaseClient>;

  constructor(private readonly config: Config) {
    this.client = createBaseClient(config.BASE_SEPOLIA_RPC_URL);
  }

  async verifyPayment(job: PaymentJob, transactionHash: `0x${string}`): Promise<ChainPaymentResult> {
    if (job.mode === "STEALTH" && (!this.config.HELPER_ADDRESS || !job.stealthAddress)) return { status: "RECONCILING", reason: "payment plan lacks helper or stealth destination" };
    let transaction;
    try {
      transaction = await this.client.getTransaction({ hash: transactionHash });
    } catch {
      return { status: "SUBMITTED", reason: "transaction is not visible on the configured RPC yet" };
    }
    const expectedTarget = job.mode === "STANDARD" ? job.tokenAddress : this.config.HELPER_ADDRESS;
    if (!expectedTarget || transaction.from.toLowerCase() !== job.payer.toLowerCase() || transaction.to?.toLowerCase() !== expectedTarget.toLowerCase()) {
      return { status: "RECONCILING", reason: "transaction sender or helper mismatch" };
    }
    let receipt;
    try {
      receipt = await this.client.getTransactionReceipt({ hash: transactionHash });
    } catch {
      return { status: "SUBMITTED", reason: "transaction is pending confirmation" };
    }
    if (receipt.status === "reverted") return { status: "REVERTED", reason: "helper transaction reverted" };
    const transferLogs = parseEventLogs({ abi: erc20TransferAbi, logs: receipt.logs, eventName: "Transfer", strict: false });
    const transfer = transferLogs.find((log) => log.address.toLowerCase() === job.tokenAddress.toLowerCase() &&
      log.args.from !== undefined && log.args.to !== undefined && log.args.from.toLowerCase() === job.payer.toLowerCase() &&
      log.args.to.toLowerCase() === (job.mode === "STANDARD" ? job.recipient : job.stealthAddress)!.toLowerCase() && log.args.value === job.amountBaseUnits);
    if (!transfer) return { status: "RECONCILING", reason: "exact token transfer was not verified" };
    if (job.mode === "STANDARD") {
      const latest = await this.client.getBlockNumber();
      const confirmations = latest - receipt.blockNumber + 1n;
      return { status: confirmations >= BigInt(this.config.FINALITY_BLOCKS + 1) ? "CONFIRMED" : "CONFIRMING" };
    }
    const announcements = parseEventLogs({ abi: erc5564AnnouncementAbi, logs: receipt.logs, eventName: "Announcement", strict: false });
    const announcement = announcements.find((log) => log.args.schemeId === 1n && log.args.stealthAddress !== undefined && log.args.stealthAddress.toLowerCase() === job.stealthAddress!.toLowerCase());
    if (!announcement) return { status: "RECONCILING", reason: "matching ERC-5564 Announcement was not verified" };
    const latest = await this.client.getBlockNumber();
    const confirmations = latest - receipt.blockNumber + 1n;
    return { status: confirmations >= BigInt(this.config.FINALITY_BLOCKS + 1) ? "CONFIRMED" : "CONFIRMING" };
  }
}
