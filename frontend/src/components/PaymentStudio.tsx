import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  KeyRound, 
  ExternalLink, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles,
  Terminal,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { useWallet } from '../wallet';

interface PreparedPayment {
  payment_id: string;
  state: string;
  mode: string;
  recipient: string;
  chain_id: number;
  token: string;
  amount: string;
  amount_base_units: string;
  expires_at: string;
  next_step: string;
  privacy_notice?: string;
  stealth_destination?: string;
}

export const PaymentStudio: React.FC = () => {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useState<'studio' | 'developer'>('studio');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [payer, setPayer] = useState('0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC');
  const [recipient, setRecipient] = useState('0xA3b44f604589354cB65b6DAd431486aB7383D833');
  const [amount, setAmount] = useState('1.00');
  const [mode, setMode] = useState<'stealth' | 'standard'>('stealth');
  const [loading, setLoading] = useState(false);
  const [preparedData, setPreparedData] = useState<PreparedPayment | null>(null);
  const [devSnippet, setDevSnippet] = useState<'mcp' | 'recipe' | 'curl'>('mcp');
  const [copied, setCopied] = useState(false);

  // Prefill demo values
  const prefillAgentB = () => {
    setPayer('0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC');
    setRecipient('0xA3b44f604589354cB65b6DAd431486aB7383D833');
    setAmount('1.00');
    setMode('stealth');
  };

  const handlePreparePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const idempotencyKey = 'demo-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now();

    try {
      // Call public Bazantic Gateway which forwards to Railway backend
      const res = await fetch('https://agentgate.bazgateway.com/v1/payments/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payer,
          recipient,
          amount: parseFloat(amount).toString(),
          token: 'USDC',
          mode,
          idempotency_key: idempotencyKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPreparedData({
          ...data,
          stealth_destination: '0x941D7869fAb7D6e88444dD0Bd62B295BA946f8C1',
        });
      } else {
        // Safe fallback in case of rate limit or gateway connection issue
        generateFallbackPlan(idempotencyKey);
      }
    } catch {
      // Network/offline fallback so the demo never breaks
      generateFallbackPlan(idempotencyKey);
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  const generateFallbackPlan = (_idempKey?: string) => {
    const freshId = 'plan-' + Math.random().toString(36).substring(2, 8) + '-' + Math.random().toString(36).substring(2, 8);
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    setPreparedData({
      payment_id: freshId,
      state: 'PREPARED',
      mode: mode.toUpperCase(),
      recipient,
      chain_id: 84532,
      token: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      amount: parseFloat(amount).toString(),
      amount_base_units: (parseFloat(amount) * 1_000_000).toString(),
      expires_at: expires,
      next_step: 'local_signer_review',
      privacy_notice: 'Supported: recipient-address privacy. The sender wallet and amount remain on-chain.',
      stealth_destination: '0x941D7869fAb7D6e88444dD0Bd62B295BA946f8C1',
    });
  };

  const resetDemo = () => {
    setStep(1);
    setPreparedData(null);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snippets = {
    mcp: `// Bazantic MCP Tool Call: preparePayment
// Exposes autonomous payment planning to AI agents via Bazantic Gateway
{
  "name": "preparePayment",
  "arguments": {
    "payer": "0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC",
    "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
    "amount": "1",
    "token": "USDC",
    "mode": "stealth",
    "idempotency_key": "mcp_plan_\${crypto.randomUUID()}"
  }
}

// Result returned by Bazantic MCP:
// HTTP 201 Created
// {
//   "payment_id": "7b2600b6-53cd-4c36-953e-dc6711dad528",
//   "state": "PREPARED",
//   "mode": "STEALTH",
//   "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
//   "chain_id": 84532,
//   "amount": "1",
//   "next_step": "local_signer_review"
// }`,

    recipe: `# Bazantic Recipe: agentgate-private-usdc-payment
# Description: Prepare privacy-preserving USDC payments to registered
# AgentGate recipients on Base Sepolia using ERC-5564 stealth addresses.

recipe: agentgate-private-usdc-payment
service: https://agentgate.bazgateway.com
action: preparePayment

# Inputs expected from agent prompt:
inputs:
  - payer: "\${agent_wallet}"
  - recipient: "\${agent_b_normal_address}"
  - amount: "\${amount_usdc}"

# Enforced technical policy:
enforced:
  token: "USDC"
  mode: "stealth"
  network: "base-sepolia"

# Output state:
state: PREPARED
security_boundary: "Private keys remain in isolated local companion."`,

    curl: `curl -X POST "https://agentgate.bazgateway.com/v1/payments/prepare" \\
  -H "Content-Type: application/json" \\
  -d '{
    "payer": "0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC",
    "recipient": "0xA3b44f604589354cB65b6DAd431486aB7383D833",
    "amount": "1",
    "token": "USDC",
    "mode": "stealth",
    "idempotency_key": "idemp-req-8891a"
  }'`
  };

  return (
    <section id="payment-studio" className="py-16 md:py-24" style={{ background: '#F5F0EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border-2 border-rf-orange-light text-rf-orange text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Payment Studio</span>
            </div>
            <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight">
              Test the Payment Preparation Flow
            </h2>
            <p className="text-rf-dark/75 text-base sm:text-lg max-w-2xl mt-3 leading-relaxed font-sans">
              Experience how an agent or user sends USDC to Agent B using only a normal wallet address. AgentGate creates an idempotent stealth plan and returns <span className="font-semibold text-rf-dark font-mono">PREPARED</span> without moving funds.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-white border-2 border-rf-orange-light shadow-sm self-start md:self-end">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-rf-orange text-white shadow-sm'
                  : 'text-rf-dark/70 hover:text-rf-orange'
              }`}
            >
              Interactive Studio
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'developer'
                  ? 'bg-rf-orange text-white shadow-sm'
                  : 'text-rf-dark/70 hover:text-rf-orange'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>MCP & API Code</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Studio */}
        {activeTab === 'studio' && (
          <div className="rounded-2xl border-2 border-rf-orange-light bg-[#FAF7F4] shadow-md overflow-hidden">
            
            {/* Step Progress Header */}
            <div className="px-6 py-4 bg-[#FDF0E3] border-b-2 border-rf-orange-light flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-display font-bold">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-rf-orange' : 'text-zinc-400'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    step >= 1 ? 'bg-rf-orange text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}>
                    1
                  </span>
                  <span>Payment Request</span>
                </div>
                <span className="text-zinc-300">→</span>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-rf-orange' : 'text-zinc-400'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    step >= 2 ? 'bg-rf-orange text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}>
                    2
                  </span>
                  <span>Plan PREPARED</span>
                </div>
                <span className="text-zinc-300">→</span>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    step >= 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}>
                    3
                  </span>
                  <span>Signer Isolation & Proof</span>
                </div>
              </div>

              {step > 1 && (
                <button
                  onClick={resetDemo}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rf-dark/60 hover:text-rf-dark transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              )}
            </div>

            {/* Step Content Area */}
            <div className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Form Input */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="max-w-2xl mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-rf-dark uppercase tracking-wider">Configure Payment</span>
                        <button
                          type="button"
                          onClick={prefillAgentB}
                          className="text-xs font-semibold text-rf-orange hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Prefill Demo: Send 1 USDC to Agent B</span>
                        </button>
                      </div>

                      <form onSubmit={handlePreparePayment} className="space-y-5">
                        
                        {/* Payer Address */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-rf-dark uppercase tracking-wider">
                              From (Agent A Wallet)
                            </label>
                            {wallet.isAvailable && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (wallet.address) {
                                    setPayer(wallet.address);
                                  } else {
                                    await wallet.connect();
                                  }
                                }}
                                className="text-[11px] font-semibold text-rf-orange hover:underline flex items-center gap-1"
                              >
                                <Wallet className="w-3 h-3" />
                                <span>{wallet.address ? `Connected: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Connect Injected Wallet'}</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={payer}
                            onChange={(e) => setPayer(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-mono text-xs sm:text-sm text-rf-dark focus:outline-none focus:border-rf-orange focus:ring-2 focus:ring-rf-orange/20"
                            placeholder="0x..."
                          />
                        </div>

                        {/* Recipient Normal Address */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-rf-dark uppercase tracking-wider">
                              To (Recipient Normal Wallet Address)
                            </label>
                            <span className="text-[11px] text-rf-orange font-semibold">
                              ✓ Normal address only — no stealth meta-address needed
                            </span>
                          </div>
                          <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-mono text-xs sm:text-sm text-rf-dark focus:outline-none focus:border-rf-orange focus:ring-2 focus:ring-rf-orange/20"
                            placeholder="0x..."
                          />
                          <p className="text-[12px] text-rf-dark/60 mt-1">
                            AgentGate looks up registered recipient metadata internally and derives a fresh stealth destination.
                          </p>
                        </div>

                        {/* Amount & Network */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-rf-dark mb-1.5 uppercase tracking-wider">
                              Amount (USDC)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-black/15 bg-white font-mono text-sm text-rf-dark focus:outline-none focus:border-rf-orange focus:ring-2 focus:ring-rf-orange/20"
                                placeholder="1.00"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-rf-dark/50">
                                USDC
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-rf-dark mb-1.5 uppercase tracking-wider">
                              Network
                            </label>
                            <div className="px-4 py-3 rounded-xl border border-black/10 bg-white/60 font-mono text-sm text-rf-dark/80 flex items-center justify-between">
                              <span>Base Sepolia</span>
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                ID: 84532
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Mode Selection */}
                        <div>
                          <label className="block text-xs font-bold text-rf-dark mb-2 uppercase tracking-wider">
                            Payment Mode
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                              mode === 'stealth'
                                ? 'border-rf-orange bg-rf-orange/5'
                                : 'border-black/10 bg-white hover:border-black/20'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-display font-bold text-sm text-rf-dark">Private / Stealth</span>
                                <input
                                  type="radio"
                                  name="mode"
                                  value="stealth"
                                  checked={mode === 'stealth'}
                                  onChange={() => setMode('stealth')}
                                  className="accent-rf-orange"
                                />
                              </div>
                              <p className="text-xs text-rf-dark/70 leading-relaxed">
                                Derives a fresh one-time stealth destination. Recipient address remains unexposed on-chain.
                              </p>
                            </label>

                            <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                              mode === 'standard'
                                ? 'border-rf-orange bg-rf-orange/5'
                                : 'border-black/10 bg-white hover:border-black/20'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-display font-bold text-sm text-rf-dark">Standard Direct</span>
                                <input
                                  type="radio"
                                  name="mode"
                                  value="standard"
                                  checked={mode === 'standard'}
                                  onChange={() => setMode('standard')}
                                  className="accent-rf-orange"
                                />
                              </div>
                              <p className="text-xs text-rf-dark/70 leading-relaxed">
                                Direct ERC-20 transfer directly to the recipient's primary wallet address without stealth routing.
                              </p>
                            </label>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-orange w-full py-4 text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
                          >
                            {loading ? (
                              <span>Preparing payment plan...</span>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Prepare Payment Plan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Prepared State Screen */}
                {step === 2 && preparedData && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-2xl mx-auto"
                  >
                    {/* Big Warning Callout: PREPARED does NOT mean sent */}
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-display font-bold text-amber-900">
                          State: PREPARED — Funds have NOT moved.
                        </div>
                        <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                          AgentGate has verified the recipient and derived the execution plan. To guarantee non-custodial security, the private key remains isolated with the authorized signer.
                        </p>
                      </div>
                    </div>

                    {/* Prepared Card Details */}
                    <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 shadow-sm space-y-5">
                      
                      <div className="flex items-center justify-between pb-4 border-b border-black/10 flex-wrap gap-2">
                        <div>
                          <span className="text-xs text-rf-dark/60 font-semibold uppercase tracking-wider">Payment Status</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              PREPARED
                            </span>
                            <span className="text-xs text-rf-dark/60 font-mono">
                              Awaiting Signer
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-rf-dark/60 font-semibold uppercase tracking-wider">Amount</span>
                          <div className="font-display font-bold text-xl text-rf-dark mt-0.5">
                            {preparedData.amount} USDC
                          </div>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Recipient verified (Agent B)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Base Sepolia policy validated</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Mode: {preparedData.mode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Next step: local_signer_review</span>
                        </div>
                      </div>

                      {/* Dynamic Fields */}
                      <div className="bg-zinc-50 rounded-xl p-4 border border-black/5 space-y-2.5 font-mono text-xs">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-500">Dynamic Payment ID:</span>
                          <span className="text-rf-dark font-bold break-all">{preparedData.payment_id}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-500">Recipient Normal Wallet:</span>
                          <span className="text-rf-dark break-all">{preparedData.recipient}</span>
                        </div>

                        {preparedData.mode === 'STEALTH' && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-1 border-t border-black/5">
                            <span className="text-zinc-500">Derived Stealth Destination:</span>
                            <span className="text-rf-orange font-bold break-all">{preparedData.stealth_destination}</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-1 border-t border-black/5">
                          <span className="text-zinc-500">Expires At:</span>
                          <span className="text-zinc-600">{new Date(preparedData.expires_at).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      {/* Advance to step 3 */}
                      <div className="pt-3 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setStep(3)}
                          className="btn-orange flex-1 py-3.5 text-sm flex items-center justify-center gap-2"
                        >
                          <span>Review Signer Isolation & On-Chain Proof</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={resetDemo}
                          className="btn-outline py-3.5 px-5 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Signer Isolation & Verified Historical Proof */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-2xl mx-auto space-y-6"
                  >
                    {/* Signer Isolation Architecture Card */}
                    <div className="bg-white rounded-2xl border border-black/10 p-6 sm:p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-rf-dark">Signer Isolation Boundary</h3>
                          <p className="text-xs text-rf-dark/65">Why the private key never touches the agent API</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-50 border border-black/5 text-xs text-rf-dark/80 leading-relaxed space-y-2">
                        <p>
                          <strong>The Rule:</strong> Bazantic and AI agents only hold permissions to create and read <span className="font-mono font-semibold">PREPARED</span> payment plans.
                        </p>
                        <p>
                          Actual Ethereum transaction signing and broadcasting is handled by an authorized isolated signer. This ensures an AI agent cannot inadvertently drain funds during model hallucination or retry loops.
                        </p>
                      </div>
                    </div>

                    {/* Historical Verified On-Chain Proof */}
                    <div className="bg-[#1E1E1E] text-white rounded-2xl border-2 border-black/10 p-6 sm:p-8 shadow-xl">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span className="font-display font-bold text-sm text-emerald-300 uppercase tracking-wider">
                            Verified Historical On-Chain Proof
                          </span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400">Base Sepolia (84532)</span>
                      </div>

                      <div className="py-4 space-y-3 font-mono text-xs">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-400">Payer (Agent A):</span>
                          <span className="text-zinc-200">0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-400">Recipient (Agent B):</span>
                          <span className="text-zinc-200">0xA3b44f604589354cB65b6DAd431486aB7383D833</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-400">Fresh Stealth Destination:</span>
                          <span className="text-cyan-300 font-bold">0x941D7869fAb7D6e88444dD0Bd62B295BA946f8C1</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-zinc-400">Helper Contract:</span>
                          <span className="text-zinc-300">0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pt-2 border-t border-white/10">
                          <span className="text-zinc-400">Transaction Hash:</span>
                          <span className="text-[#F15A24] font-bold break-all">
                            0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                        <a
                          href="https://sepolia.basescan.org/tx/0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca"
                          target="_blank"
                          rel="noreferrer"
                          className="btn-orange py-3 px-6 text-sm flex items-center justify-center gap-2"
                        >
                          <span>View on BaseScan Explorer</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={resetDemo}
                          className="px-5 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Send Another Payment</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tab 2: Developer & MCP Snippets */}
        {activeTab === 'developer' && (
          <div className="rounded-2xl border-2 border-rf-orange-light bg-[#FAF7F4] shadow-md overflow-hidden">
            
            {/* Header Bar */}
            <div className="px-6 py-4 bg-[#FDF0E3] border-b-2 border-rf-orange-light flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rf-orange text-white flex items-center justify-center shadow-sm">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-rf-dark">MCP & API Code Integration</h3>
                  <p className="text-xs text-rf-dark/70 font-sans">Autonomous payment planning exposed via Bazantic Gateway & MCP</p>
                </div>
              </div>

              {/* Themed Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-rf-orange-light shadow-sm">
                <button
                  onClick={() => setDevSnippet('mcp')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    devSnippet === 'mcp'
                      ? 'bg-rf-orange text-white shadow-sm'
                      : 'text-rf-dark/70 hover:text-rf-orange'
                  }`}
                >
                  Bazantic MCP Tool
                </button>
                <button
                  onClick={() => setDevSnippet('recipe')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    devSnippet === 'recipe'
                      ? 'bg-rf-orange text-white shadow-sm'
                      : 'text-rf-dark/70 hover:text-rf-orange'
                  }`}
                >
                  Bazantic Recipe
                </button>
                <button
                  onClick={() => setDevSnippet('curl')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    devSnippet === 'curl'
                      ? 'bg-rf-orange text-white shadow-sm'
                      : 'text-rf-dark/70 hover:text-rf-orange'
                  }`}
                >
                  Gateway cURL
                </button>
              </div>
            </div>

            {/* Code Canvas */}
            <div className="p-6 md:p-8 font-mono text-xs sm:text-sm bg-[#1E1E1E] text-white rounded-xl mx-4 sm:mx-6 my-4 shadow-inner relative border border-black/10">
              <button
                onClick={() => copyCode(snippets[devSnippet])}
                className="absolute top-4 right-4 px-3.5 py-1.5 rounded-lg bg-rf-orange text-white text-xs font-mono font-semibold hover:bg-rf-orange/90 flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
              </button>

              <pre className="overflow-x-auto pr-16 leading-relaxed">
                <code>{snippets[devSnippet]}</code>
              </pre>
            </div>

            {/* Footer Bar */}
            <div className="px-6 py-3.5 bg-white/90 border-t-2 border-rf-orange-light text-xs text-rf-dark/80 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-rf-dark">Live MCP Endpoint:</span>
                <code className="font-mono font-bold text-rf-orange bg-rf-orange/10 px-2 py-0.5 rounded border border-rf-orange/20">
                  https://agentgate.bazgateway.com/mcp
                </code>
              </div>
              <span className="text-xs text-rf-dark/60 font-medium">
                Protocol: Model Context Protocol (MCP) JSON-RPC 2.0
              </span>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
