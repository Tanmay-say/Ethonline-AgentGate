import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

export const VerifiedProof: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const proofData = [
    { label: 'Network', value: 'Base Sepolia Testnet (Chain ID 84532)' },
    { label: 'Amount & Token', value: '1.000000 USDC (6 decimals)' },
    { label: 'Payer (Agent A)', value: '0x286bd33A27079f28a4B4351a85Ad7f23A04BDdfC' },
    { label: 'Intended Recipient (Agent B)', value: '0xA3b44f604589354cB65b6DAd431486aB7383D833' },
    { label: 'Fresh Stealth Destination', value: '0x941D7869fAb7D6e88444dD0Bd62B295BA946f8C1', highlight: true },
    { label: 'Payment Helper Contract', value: '0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c' },
    { label: 'Base Sepolia USDC', value: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' },
    { label: 'Transaction Hash', value: '0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca', tx: true },
  ];

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="proof" className="py-16 md:py-24" style={{ background: '#F5F0EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>On-Chain Evidence</span>
          </div>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight mt-1">
            Verified Blockchain Execution Proof
          </h2>
          <p className="text-rf-dark/70 text-base mt-2">
            Historical on-chain proof executed on Base Sepolia. The USDC transfer settled directly to the fresh stealth address and the ERC-5564 announcement was broadcast.
          </p>
        </div>

        {/* Big Proof Card */}
        <div className="max-w-3xl mx-auto rounded-3xl border-2 border-black/10 bg-white p-6 sm:p-10 shadow-lg">
          
          {/* Card Title & Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-display font-bold text-xl text-rf-dark">
                  On-Chain Settlement Receipt
                </h3>
              </div>
              <p className="text-xs text-rf-dark/60 mt-1">
                Verified on Sourcify & BaseScan testnet explorer
              </p>
            </div>

            <a
              href="https://sepolia.basescan.org/tx/0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca"
              target="_blank"
              rel="noreferrer"
              className="btn-orange text-xs py-2.5 px-4 flex items-center gap-2 whitespace-nowrap"
            >
              <span>Inspect on BaseScan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Proof Table */}
          <div className="divide-y divide-black/5 py-4 font-mono text-xs">
            {proofData.map((item) => (
              <div key={item.label} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span className="text-zinc-500 font-sans text-xs font-semibold shrink-0">
                  {item.label}:
                </span>
                <div className="flex items-center gap-2 justify-end">
                  <span className={`break-all text-right ${
                    item.highlight ? 'text-rf-orange font-bold text-sm' : item.tx ? 'text-[#7C3AED] font-bold' : 'text-rf-dark'
                  }`}>
                    {item.value}
                  </span>
                  <button
                    onClick={() => copyText(item.label, item.value)}
                    className="p-1 rounded hover:bg-black/5 text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedKey === item.label ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Verified Proof Points */}
          <div className="mt-4 pt-5 border-t border-black/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800">USDC Transfer</span>
              <div className="text-[11px] text-emerald-700 mt-0.5">1.00 USDC received by stealth address</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800">ERC-5564 Announce</span>
              <div className="text-[11px] text-emerald-700 mt-0.5">Announcement event emitted for Agent B</div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-800">Corrected Helper</span>
              <div className="text-[11px] text-emerald-700 mt-0.5">Verified helper executed single-tx flow</div>
            </div>
          </div>

          {/* Verification Callout */}
          <div className="mt-5 p-4 rounded-xl bg-[#FAF7F4] border border-black/5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-rf-orange shrink-0 mt-0.5" />
            <p className="text-xs text-rf-dark/75 leading-relaxed">
              <strong>Cryptographic Guarantee:</strong> Observers on BaseScan cannot link the stealth destination address (<code className="font-mono text-[11px] text-rf-dark">0x941D...</code>) to Agent B’s public primary identity (<code className="font-mono text-[11px] text-rf-dark">0xA3b44...</code>) without possessing Agent B's private viewing key.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
