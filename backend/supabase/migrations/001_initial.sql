create extension if not exists pgcrypto;

create table if not exists payment_jobs (
  id uuid primary key,
  idempotency_key text not null unique,
  request_hash text not null,
  payer text not null,
  recipient_meta_address text not null,
  recipient_fingerprint text not null,
  chain_id integer not null check (chain_id = 84532),
  token_address text not null,
  amount text not null,
  amount_base_units numeric(78,0) not null check (amount_base_units > 0),
  stealth_address text,
  ephemeral_public_key text,
  view_tag text,
  helper_address text,
  announcer_address text,
  expires_at timestamptz not null,
  state text not null check (state in ('PREPARED','SUBMITTED','CONFIRMING','CONFIRMED','RECONCILING','REVERTED','REJECTED','EXPIRED')),
  transfer_tx_hash text,
  announce_tx_hash text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index if not exists payment_jobs_expires_at_idx on payment_jobs (expires_at);
create index if not exists payment_jobs_state_idx on payment_jobs (state);

revoke all on payment_jobs from public;
