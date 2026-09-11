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

alter table payment_jobs add column if not exists mode text not null default 'STEALTH';
alter table payment_jobs add column if not exists recipient text;
alter table payment_jobs alter column recipient_meta_address drop not null;
alter table payment_jobs alter column recipient_fingerprint drop not null;

create table if not exists recipient_registrations (
  recipient text primary key,
  agent_id text,
  normal_address text,
  stealth_meta_address text not null,
  fingerprint text not null,
  updated_at timestamptz not null
);

alter table recipient_registrations add column if not exists agent_id text;
alter table recipient_registrations add column if not exists normal_address text;
update recipient_registrations set normal_address = recipient where normal_address is null;
update recipient_registrations set agent_id = recipient where agent_id is null;
alter table recipient_registrations alter column normal_address set not null;
alter table recipient_registrations alter column agent_id set not null;

create index if not exists payment_jobs_expires_at_idx on payment_jobs (expires_at);
create index if not exists payment_jobs_state_idx on payment_jobs (state);

revoke all on payment_jobs from public;
revoke all on recipient_registrations from public;
