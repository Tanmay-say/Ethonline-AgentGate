export const PRIVACY_NOTICE =
  "Supported: recipient-address privacy. Not supported: sender anonymity, hidden amounts, hidden timing, or guaranteed unlinkability after spending. The sender's wallet is publicly visible as the source of the transfer and announcement.";

export const PAYMENT_STATES = [
  "PREPARED",
  "SUBMITTED",
  "CONFIRMING",
  "CONFIRMED",
  "RECONCILING",
  "REVERTED",
  "REJECTED",
  "EXPIRED"
] as const;
export const PAYMENT_MODES = ["STANDARD", "STEALTH"] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export type PaymentState = (typeof PAYMENT_STATES)[number];

export type PaymentJob = {
  id: string;
  idempotencyKey: string;
  requestHash: string;
  payer: `0x${string}`;
  mode: PaymentMode;
  recipient: string;
  recipientMetaAddress?: string;
  recipientFingerprint?: string;
  chainId: number;
  tokenAddress: `0x${string}`;
  amount: string;
  amountBaseUnits: bigint;
  stealthAddress?: `0x${string}`;
  ephemeralPublicKey?: string;
  viewTag?: string;
  helperAddress?: `0x${string}`;
  announcerAddress?: `0x${string}`;
  expiresAt: string;
  state: PaymentState;
  transferTxHash?: `0x${string}`;
  announceTxHash?: `0x${string}`;
  transactionHash?: `0x${string}`;
  createdAt: string;
  updatedAt: string;
};

export type PrepareInput = {
  payer: `0x${string}`;
  mode?: PaymentMode;
  recipient?: string;
  recipientMetaAddress?: string;
  recipientFingerprint?: string;
  token: `0x${string}`;
  amount: string;
  idempotencyKey: string;
};

export type RecipientRegistration = { agentId: string; normalAddress: `0x${string}`; stealthMetaAddress: string; fingerprint: string; updatedAt: string };

export type PaymentRepository = {
  findByIdempotencyKey(key: string): Promise<PaymentJob | undefined>;
  findById(id: string): Promise<PaymentJob | undefined>;
  insert(job: PaymentJob): Promise<void>;
  update(id: string, patch: Partial<PaymentJob>): Promise<PaymentJob>;
  findRecipientRegistration(recipient: string): Promise<RecipientRegistration | undefined>;
  upsertRecipientRegistration(registration: RecipientRegistration): Promise<void>;
};

export const PAYMENT_TRANSITIONS: Record<PaymentState, readonly PaymentState[]> = {
  PREPARED: ["SUBMITTED", "REJECTED", "EXPIRED"],
  SUBMITTED: ["CONFIRMING", "RECONCILING", "REVERTED"],
  CONFIRMING: ["CONFIRMED", "RECONCILING", "REVERTED"],
  CONFIRMED: [],
  RECONCILING: ["CONFIRMING", "CONFIRMED", "REVERTED"],
  REVERTED: [],
  REJECTED: [],
  EXPIRED: []
};
