import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ExternalLink, Loader2, LogOut, ShieldAlert, WalletCards } from 'lucide-react';
import { BASE_SEPOLIA_CHAIN_ID, useWallet } from '../wallet';

const API_URL = import.meta.env.VITE_AGENTGATE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://backend-production-1ce76.up.railway.app');
const PREPARE_PATH = import.meta.env.DEV ? '/v1/human/payments/prepare' : '/v1/payments/prepare';

type PaymentMode = 'stealth' | 'standard';
type ConsoleStatus = 'IDLE' | 'PREPARING' | 'PREPARED' | 'EXECUTED' | 'FAILED';

interface PaymentResponse {
  payment_id: string;
  state: string;
  mode: string;
  recipient: string;
  chain_id: number;
  token: string;
  amount: string;
  amount_base_units: string;
  expires_at: string;
  transfer_tx_hash?: string | null;
  announce_tx_hash?: string | null;
  next_step?: string;
  privacy_notice?: string;
}

interface CapabilitiesResponse {
  max_payment_base_units?: string;
  token_decimals?: number;
}

function shortenAddress(value: string | null): string {
  return value ? `${value.slice(0, 6)}...${value.slice(-4)}` : 'Not connected';
}

function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

function parseAmount(value: string): number | null {
  if (!/^\d+(\.\d{1,6})?$/.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function explorerUrl(hash: string): string {
  return `https://sepolia.basescan.org/tx/${hash}`;
}

export const AgentGateConsole: React.FC = () => {
  const { address, chainId, connect, disconnect, isAvailable, isConnecting, switchToBaseSepolia } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('1');
  const [mode, setMode] = useState<PaymentMode>('stealth');
  const [status, setStatus] = useState<ConsoleStatus>('IDLE');
  const [result, setResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [maxPaymentBaseUnits, setMaxPaymentBaseUnits] = useState(25_000_000n);
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<PaymentResponse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/v1/capabilities`)
      .then(async response => response.ok ? await response.json() as CapabilitiesResponse : null)
      .then(capabilities => {
        if (capabilities?.max_payment_base_units) setMaxPaymentBaseUnits(BigInt(capabilities.max_payment_base_units));
      })
      .catch(() => undefined);
  }, []);

  const amountBaseUnits = useMemo(() => {
    const parsed = parseAmount(amount);
    if (parsed === null) return null;
    const [whole, fraction = ''] = amount.trim().split('.');
    return BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0') || '0');
  }, [amount]);

  const preparePayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!address) {
      setError('Connect a wallet before preparing a payment.');
      return;
    }
    if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
      setError('Switch your wallet to Base Sepolia before preparing a payment.');
      return;
    }
    if (!isAddress(recipient)) {
      setError('Enter a valid recipient EVM address.');
      return;
    }
    if (amountBaseUnits === null || amountBaseUnits <= 0n) {
      setError('Enter a positive USDC amount with up to 6 decimal places.');
      return;
    }
    if (amountBaseUnits > maxPaymentBaseUnits) {
      setError(`Amount exceeds the backend limit of ${Number(maxPaymentBaseUnits) / 1_000_000} USDC.`);
      return;
    }

    setStatus('PREPARING');
    try {
      const response = await fetch(`${API_URL}${PREPARE_PATH}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer: address,
          recipient: recipient.trim(),
          amount: amount.trim(),
          token: 'USDC',
          mode,
          idempotency_key: `console-${crypto.randomUUID()}`,
        }),
      });
      const data = await response.json() as PaymentResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || `Preparation failed (${response.status}).`);
      setResult(data);
      setStatus(data.state === 'EXECUTED' ? 'EXECUTED' : 'PREPARED');
    } catch (prepareError) {
      setStatus('FAILED');
      setError(prepareError instanceof Error ? prepareError.message : 'Unable to prepare payment.');
    }
  };

  const lookupPayment = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!lookupId.trim()) return;
    setLookupLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/v1/payments/${encodeURIComponent(lookupId.trim())}`);
      const data = await response.json() as PaymentResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || `Lookup failed (${response.status}).`);
      setLookupResult(data);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'Unable to look up payment.');
    } finally {
      setLookupLoading(false);
    }
  }, [lookupId]);

  return (
    <main className="min-h-screen bg-rf-base py-14 md:py-20">
      <div className="max-w-[1080px] mx-auto px-6 lg:px-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rf-orange/10 text-rf-orange text-xs font-semibold uppercase tracking-wider mb-3">
            <WalletCards className="w-3.5 h-3.5" /> Human testing interface
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-rf-dark tracking-tight">AgentGate Test Console</h1>
          <p className="mt-3 max-w-2xl text-rf-dark/70">Prepare privacy-preserving USDC payment plans using the same AgentGate API used by agents. This console never signs or broadcasts transactions.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="bg-white rounded-3xl border-2 border-black/10 p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-rf-dark/55">Connected wallet</p>
                <p className="mt-1 font-mono text-sm break-all">{shortenAddress(address)}</p>
              </div>
              {address && <button type="button" onClick={disconnect} className="text-xs font-semibold text-rf-dark/60 hover:text-rf-dark flex items-center gap-1"><LogOut className="w-3.5 h-3.5" /> Disconnect</button>}
            </div>
            {!address ? (
              <button type="button" onClick={() => void connect().catch(walletError => setError(walletError instanceof Error && walletError.message === 'NO_WALLET' ? 'No compatible EVM wallet was detected.' : 'Wallet connection was rejected.'))} disabled={isConnecting || !isAvailable} className="btn-orange w-full text-sm disabled:opacity-50">
                {isConnecting ? 'Connecting...' : isAvailable ? 'Connect Wallet' : 'Wallet Unavailable'}
              </button>
            ) : (
              <div className={`rounded-xl p-3 text-sm border ${chainId === BASE_SEPOLIA_CHAIN_ID ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                <div className="font-semibold">Network: {chainId === BASE_SEPOLIA_CHAIN_ID ? 'Base Sepolia' : `Chain ${chainId ?? 'unknown'}`}</div>
                {chainId !== BASE_SEPOLIA_CHAIN_ID && <button type="button" onClick={() => void switchToBaseSepolia().catch(() => setError('Your wallet could not switch to Base Sepolia.'))} className="mt-2 underline font-semibold">Switch to Base Sepolia</button>}
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl border-2 border-black/10 p-6 md:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div><p className="text-xs uppercase tracking-wider font-bold text-rf-orange">Payment console</p><h2 className="font-display text-2xl font-bold mt-1">Prepare a payment</h2></div>
              <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-mono">{status}</span>
            </div>
            <form onSubmit={preparePayment} className="space-y-5">
              <label className="block"><span className="field-label">Recipient normal wallet</span><input value={recipient} onChange={event => setRecipient(event.target.value)} placeholder="0x..." className="field-input font-mono" /></label>
              <label className="block"><span className="field-label">Amount (USDC)</span><input value={amount} onChange={event => setAmount(event.target.value)} inputMode="decimal" placeholder="1" className="field-input" /></label>
              <fieldset><legend className="field-label">Payment mode</legend><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setMode('stealth')} className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${mode === 'stealth' ? 'border-rf-orange bg-rf-orange/10 text-rf-dark' : 'border-black/10 text-rf-dark/60'}`}>Stealth</button><button type="button" onClick={() => setMode('standard')} className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${mode === 'standard' ? 'border-rf-orange bg-rf-orange/10 text-rf-dark' : 'border-black/10 text-rf-dark/60'}`}>Standard</button></div></fieldset>
              <button type="submit" disabled={status === 'PREPARING' || !address || chainId !== BASE_SEPOLIA_CHAIN_ID} className="btn-orange w-full text-sm disabled:opacity-50">{status === 'PREPARING' ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing...</> : 'Prepare Payment'}</button>
            </form>
            <p className="mt-4 text-xs text-rf-dark/60">The connected wallet is used only as the payer identity. No browser transaction is requested.</p>
          </section>
        </div>

        {error && <div role="alert" className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-800 flex gap-2"><AlertCircle className="w-5 h-5 shrink-0" /> <span>{error}</span></div>}

        {result && <section className="mt-6 rounded-3xl border-2 border-amber-300/80 bg-amber-50 p-6 md:p-8">
          <div className="flex items-start gap-3"><ShieldAlert className="w-6 h-6 text-amber-700 shrink-0" /><div><p className="text-xs uppercase tracking-wider font-bold text-amber-700">Payment prepared</p><h2 className="font-display text-2xl font-bold text-amber-950 mt-1">Payment plan created — no funds moved.</h2><p className="mt-2 text-sm text-amber-900">AgentGate has only prepared the payment plan. An authorized isolated signer must review and execute the transaction.</p></div></div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm"><div className="result-cell"><span>Payment ID</span><strong>{result.payment_id}</strong></div><div className="result-cell"><span>Status</span><strong>{result.state}</strong></div><div className="result-cell"><span>Amount</span><strong>{result.amount} USDC</strong></div><div className="result-cell"><span>Network</span><strong>Base Sepolia</strong></div><div className="result-cell"><span>Mode</span><strong>{result.mode}</strong></div><div className="result-cell"><span>Transaction</span><strong>{result.transfer_tx_hash || 'Not broadcast'}</strong></div></div>
          <details open={detailsOpen} onToggle={event => setDetailsOpen((event.currentTarget as HTMLDetailsElement).open)} className="mt-5 rounded-2xl bg-white/70 border border-amber-200 p-4"><summary className="cursor-pointer flex items-center justify-between font-semibold text-sm">Technical Details <ChevronDown className="w-4 h-4" /></summary><dl className="mt-4 grid gap-2 text-xs font-mono">{[['Payment ID', result.payment_id], ['State', result.state], ['Mode', result.mode], ['Chain ID', result.chain_id], ['Token', result.token], ['Amount base units', result.amount_base_units], ['Recipient', result.recipient], ['Expiration', result.expires_at], ['Next step', result.next_step || '—'], ['Transfer transaction', result.transfer_tx_hash || 'Not broadcast'], ['Announcement transaction', result.announce_tx_hash || 'Not broadcast']].map(([label, value]) => <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-black/5 pb-2"><dt className="text-rf-dark/55">{label}</dt><dd className="break-all text-right">{value}</dd></div>)}</dl></details>
          {(result.transfer_tx_hash || result.announce_tx_hash) && <div className="mt-5 flex flex-wrap gap-3">{result.transfer_tx_hash && <a href={explorerUrl(result.transfer_tx_hash)} target="_blank" rel="noreferrer" className="btn-orange text-sm">View transfer on BaseScan <ExternalLink className="w-4 h-4" /></a>}{result.announce_tx_hash && <a href={explorerUrl(result.announce_tx_hash)} target="_blank" rel="noreferrer" className="btn-outline text-sm">View announcement on BaseScan <ExternalLink className="w-4 h-4" /></a>}</div>}
        </section>}

        <section className="mt-6 bg-white rounded-3xl border-2 border-black/10 p-6 md:p-8 shadow-sm"><div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-rf-orange" /><h2 className="font-display text-xl font-bold">Check Payment</h2></div><form onSubmit={lookupPayment} className="flex flex-col sm:flex-row gap-3"><input value={lookupId} onChange={event => setLookupId(event.target.value)} placeholder="Payment ID" className="field-input flex-1 font-mono" /><button type="submit" disabled={lookupLoading || !lookupId.trim()} className="btn-outline text-sm disabled:opacity-50">{lookupLoading ? 'Checking...' : 'Check Payment'}</button></form>{lookupResult && <div className="mt-4 rounded-xl bg-zinc-50 border border-black/5 p-4 text-sm"><div className="flex justify-between gap-3"><span>State</span><strong>{lookupResult.state}</strong></div><div className="flex justify-between gap-3 mt-2"><span>Payment ID</span><span className="font-mono break-all text-right">{lookupResult.payment_id}</span></div></div>}</section>

        <p className="mt-8 text-xs text-rf-dark/55 flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0" />AgentGate supports recipient-address privacy. Sender identity, amount, timing, and eventual on-chain activity are not hidden.</p>
      </div>
    </main>
  );
};
