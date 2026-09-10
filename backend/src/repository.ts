import { Pool } from "pg";
import type { PaymentJob, PaymentRepository } from "./domain.js";

export class MemoryPaymentRepository implements PaymentRepository {
  private readonly jobs = new Map<string, PaymentJob>();
  private readonly keys = new Map<string, string>();

  async findByIdempotencyKey(key: string): Promise<PaymentJob | undefined> {
    const id = this.keys.get(key);
    return id ? this.jobs.get(id) : undefined;
  }

  async findById(id: string): Promise<PaymentJob | undefined> {
    return this.jobs.get(id);
  }

  async insert(job: PaymentJob): Promise<void> {
    if (this.keys.has(job.idempotencyKey)) throw new Error("IDEMPOTENCY_CONFLICT");
    this.keys.set(job.idempotencyKey, job.id);
    this.jobs.set(job.id, job);
  }

  async update(id: string, patch: Partial<PaymentJob>): Promise<PaymentJob> {
    const current = this.jobs.get(id);
    if (!current) throw new Error("NOT_FOUND");
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.jobs.set(id, updated);
    return updated;
  }
}

export class PostgresPaymentRepository implements PaymentRepository {
  constructor(private readonly pool: Pool) {}

  async findByIdempotencyKey(key: string): Promise<PaymentJob | undefined> {
    const result = await this.pool.query("select * from payment_jobs where idempotency_key = $1", [key]);
    return result.rows[0] ? rowToJob(result.rows[0]) : undefined;
  }

  async findById(id: string): Promise<PaymentJob | undefined> {
    const result = await this.pool.query("select * from payment_jobs where id = $1", [id]);
    return result.rows[0] ? rowToJob(result.rows[0]) : undefined;
  }

  async insert(job: PaymentJob): Promise<void> {
    await this.pool.query(
      `insert into payment_jobs
       (id, idempotency_key, request_hash, payer, recipient_meta_address, recipient_fingerprint,
        chain_id, token_address, amount, amount_base_units, stealth_address, ephemeral_public_key,
        view_tag, helper_address, announcer_address, expires_at, state, transfer_tx_hash,
        announce_tx_hash, created_at, updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      [job.id, job.idempotencyKey, job.requestHash, job.payer, job.recipientMetaAddress, job.recipientFingerprint,
        job.chainId, job.tokenAddress, job.amount, job.amountBaseUnits.toString(), job.stealthAddress ?? null,
        job.ephemeralPublicKey ?? null, job.viewTag ?? null, job.helperAddress ?? null, job.announcerAddress ?? null,
        job.expiresAt, job.state, job.transferTxHash ?? null, job.announceTxHash ?? null, job.createdAt, job.updatedAt]
    );
  }

  async update(id: string, patch: Partial<PaymentJob>): Promise<PaymentJob> {
    const current = await this.findById(id);
    if (!current) throw new Error("NOT_FOUND");
    const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
    await this.pool.query(
      `update payment_jobs set state=$2, transfer_tx_hash=$3, announce_tx_hash=$4,
       stealth_address=$5, ephemeral_public_key=$6, view_tag=$7, updated_at=$8 where id=$1`,
      [id, updated.state, updated.transferTxHash ?? null, updated.announceTxHash ?? null,
        updated.stealthAddress ?? null, updated.ephemeralPublicKey ?? null, updated.viewTag ?? null, updated.updatedAt]
    );
    return updated;
  }
}

function rowToJob(row: Record<string, unknown>): PaymentJob {
  return {
    id: String(row.id), idempotencyKey: String(row.idempotency_key), requestHash: String(row.request_hash),
    payer: String(row.payer) as `0x${string}`, recipientMetaAddress: String(row.recipient_meta_address),
    recipientFingerprint: String(row.recipient_fingerprint), chainId: Number(row.chain_id),
    tokenAddress: String(row.token_address) as `0x${string}`, amount: String(row.amount),
    amountBaseUnits: BigInt(String(row.amount_base_units)), stealthAddress: row.stealth_address as `0x${string}` | undefined,
    ephemeralPublicKey: row.ephemeral_public_key as string | undefined, viewTag: row.view_tag as string | undefined,
    helperAddress: row.helper_address as `0x${string}` | undefined, announcerAddress: row.announcer_address as `0x${string}` | undefined,
    expiresAt: new Date(String(row.expires_at)).toISOString(), state: String(row.state) as PaymentJob["state"],
    transferTxHash: row.transfer_tx_hash as `0x${string}` | undefined, announceTxHash: row.announce_tx_hash as `0x${string}` | undefined,
    createdAt: new Date(String(row.created_at)).toISOString(), updatedAt: new Date(String(row.updated_at)).toISOString()
  };
}
