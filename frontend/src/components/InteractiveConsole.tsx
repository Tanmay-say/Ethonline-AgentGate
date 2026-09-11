import React, { useState } from 'react';
import { Copy, Check, Play, ShieldAlert } from 'lucide-react';

export const InteractiveConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bazantic' | 'curl' | 'typescript' | 'recipient'>('bazantic');
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const snippets: Record<string, string> = {
    bazantic: `# Bazantic Recipe — Claude Code (AgentGate v1)

# 1. Discover capabilities
baz curl -X GET "https://api.agentgate.network/capabilities"

# 2. Create idempotent payment plan (does NOT move funds)
baz curl -X POST "https://api.agentgate.network/payment-plans" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: plan_demo_8f93a" \\
  -d '{
    "chainId": 84532,
    "tokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "amount": "25.000000",
    "recipientMetaAddress": "st:eth:0x02a1b2c3d4...0x03e5f6a7b8"
  }'

# 3. Local companion validates, derives stealth address & broadcasts
agentgate-companion approve --plan-id "plan_demo_8f93a"`,

    curl: `curl -X POST "https://api.agentgate.network/payment-plans" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ag_live_testnet_token" \\
  -H "Idempotency-Key: plan_req_9921b" \\
  -d '{
    "chainId": 84532,
    "tokenAddress": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "amount": "100.000000",
    "recipientMetaAddress": "st:eth:0x025e1...039a"
  }'`,

    typescript: `import { createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { deriveStealthDestination } from '@agentgate/erc5564-sdk';

const stealthResult = deriveStealthDestination({
  recipientMetaAddress: 'st:eth:0x02a1...0x03b4',
  schemeId: 1,
});

console.log('Destination:', stealthResult.stealthAddress);
console.log('Ephemeral:', stealthResult.ephemeralPublicKey);
console.log('View Tag:', stealthResult.viewTag);`,

    recipient: `# Recipient Recovery CLI (Offline-compatible)
agentgate-cli scan \\
  --rpc-url "https://sepolia.base.org" \\
  --announcer "0x55649E01B5...Announcer" \\
  --viewing-key "0x..."

# Output: Found 1 stealth announcement!
# Stealth Address: 0x93FA...192b (25.00 USDC)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulate = () => {
    setSimulating(true);
    setResult(null);
    setTimeout(() => {
      setResult({
        planId: 'plan_base_sepolia_7719a',
        chain: 'Base Sepolia (84532)',
        amount: '25.000000 USDC',
        stealth: '0x3D72f2E2f1265B59eEc49c5E80B4c20C7741d489',
        ephemeral: '0x02b7405e493e5069f21f0ce0891d4e0e5a60e872d8e3eb99a4c8c0f5f9227c2b64',
        viewTag: '0xa4',
        privacy: '100% Recipient Unlinkable',
      });
      setSimulating(false);
    }, 800);
  };

  const tabs = [
    { key: 'bazantic', label: 'Bazantic Recipe' },
    { key: 'curl', label: 'cURL API' },
    { key: 'typescript', label: 'TypeScript' },
    { key: 'recipient', label: 'Recipient CLI' },
  ] as const;

  return (
    <section id="developer-api" className="py-14 md:py-20" style={{ background: '#F5F0EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-5">
          <div>
            <h2 className="font-display text-[28px] sm:text-[34px] md:text-[42px] font-bold text-rf-dark leading-tight max-w-2xl">
              Test the Stealth Payment Flow
            </h2>
            <p className="mt-2 text-[15px] text-rf-dark/65 max-w-xl">
              Inspect the Bazantic recipe, FastAPI endpoints, and scheme-1 stealth derivation used by Claude Code.
            </p>
          </div>
          <button
            onClick={simulate}
            disabled={simulating}
            className="btn-orange flex items-center gap-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-white" />
            {simulating ? 'Deriving...' : 'Simulate Payment Plan'}
          </button>
        </div>

        {/* Dark Code Box */}
        <div className="rounded-2xl border-2 border-black/10 bg-[#1E1E1E] text-white shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="px-5 py-3 bg-black/30 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeTab === t.key
                      ? 'bg-white/15 text-[#F15A24] font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Code */}
          <div className="p-6 md:p-8 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto">
            <pre><code>{snippets[activeTab]}</code></pre>
          </div>

          {/* Simulation Result */}
          {result && (
            <div className="p-6 md:p-8 bg-black/40 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F15A24]" />
                <span className="text-zinc-200 font-bold uppercase tracking-wider">Simulated Response</span>
                <span className="ml-auto px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700 text-[10px]">200 OK</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300">
                {Object.entries(result).map(([k, v]) => (
                  <div key={k} className={k === 'stealth' || k === 'ephemeral' ? 'md:col-span-2' : ''}>
                    <span className="text-zinc-500">{k}:</span>{' '}
                    <span className={k === 'amount' ? 'text-[#F15A24] font-bold' : k === 'stealth' ? 'text-cyan-300 font-bold' : 'text-white'}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Privacy warning */}
        <div className="mt-5 p-4 rounded-xl bg-amber-100/50 border border-amber-300/50 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900 leading-relaxed">
            <strong>Privacy Boundary:</strong> AgentGate guarantees ERC-5564 <em>recipient-address privacy</em>. Sender anonymity and hidden amounts are not provided. The sender's wallet address remains publicly visible.
          </p>
        </div>
      </div>
    </section>
  );
};
