import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  UserCheck, 
  EyeOff, 
  Database, 
  Shuffle, 
  FileCheck2, 
  KeyRound, 
  CheckCircle2 
} from 'lucide-react';

const steps = [
  {
    num: '01',
    title: "Enter Agent B's Normal Wallet",
    desc: 'The sender only needs Agent B’s regular public address. No stealth keys, meta-addresses, or ephemeral keys required from the user.',
    icon: UserCheck,
    color: 'border-rf-orange bg-rf-orange/10 text-rf-orange',
  },
  {
    num: '02',
    title: 'Choose Private / Stealth',
    desc: 'Select privacy routing. AgentGate enables stealth destinations by default while supporting direct standard transfers when preferred.',
    icon: EyeOff,
    color: 'border-[#7C3AED] bg-[#7C3AED]/10 text-rf-violet',
  },
  {
    num: '03',
    title: 'Resolve Recipient Metadata',
    desc: 'AgentGate retrieves Agent B’s registered ERC-5564 stealth parameters (spending key and viewing key) internally.',
    icon: Database,
    color: 'border-[#2563EB] bg-[#2563EB]/10 text-rf-blue',
  },
  {
    num: '04',
    title: 'Fresh Stealth Destination Derived',
    desc: 'A fresh, one-time destination address is generated using SECP256k1 ECDH shared secrets so the recipient address stays private on-chain.',
    icon: Shuffle,
    color: 'border-rf-orange bg-rf-orange/10 text-rf-orange',
  },
  {
    num: '05',
    title: 'Payment Plan PREPARED',
    desc: 'AgentGate creates an idempotent payment plan with state PREPARED. Zero funds move at this stage.',
    icon: FileCheck2,
    color: 'border-amber-500 bg-amber-500/10 text-amber-700',
  },
  {
    num: '06',
    title: 'Authorized Signer Review',
    desc: 'The isolated local companion validates the plan, signs the transaction, and broadcasts to the Base Sepolia RPC.',
    icon: KeyRound,
    color: 'border-indigo-600 bg-indigo-600/10 text-indigo-700',
  },
  {
    num: '07',
    title: 'USDC Settles on Base Sepolia',
    desc: 'The helper contract transfers USDC to the stealth address and emits an ERC-5564 Announcement for recipient discovery.',
    icon: CheckCircle2,
    color: 'border-emerald-600 bg-emerald-600/10 text-emerald-700',
  },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="how-it-works" className="py-16 md:py-24" style={{ background: '#F5F0EB' }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-rf-orange uppercase tracking-wider bg-rf-orange/10 px-3 py-1 rounded-full">
            Under 15-Second Overview
          </span>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight mt-3">
            How AgentGate Works
          </h2>
          <p className="text-rf-dark/70 text-base mt-2">
            From natural agent request to on-chain settlement: privacy-preserving stealth payments with zero private keys in the gateway.
          </p>
        </div>

        {/* 7-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className={`p-6 rounded-2xl bg-white/90 border border-black/8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${
                  i === 6 ? 'md:col-span-2 lg:col-span-3 xl:col-span-1 border-emerald-300 bg-emerald-50/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-bold text-xl text-rf-dark/30">
                      {s.num}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-rf-dark leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-rf-dark/70 leading-relaxed mt-2 font-sans">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-mono text-rf-dark/40 font-semibold">
                  <span>Step {i + 1} of 7</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Privacy Note Box */}
        <div className="mt-10 p-5 rounded-2xl bg-white/80 border border-black/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rf-orange shrink-0" />
            <span className="text-xs text-rf-dark/80 leading-relaxed">
              <strong>ERC-5564 Privacy Scope:</strong> Provides recipient-address privacy. The sender’s wallet address and token transfer amount remain publicly visible on Base Sepolia.
            </span>
          </div>

          <a
            href="https://tanmay1say.gitbook.io/agentgate-documentation/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-rf-orange hover:underline whitespace-nowrap"
          >
            Learn about ERC-5564 ↗
          </a>
        </div>

      </div>
    </section>
  );
};
