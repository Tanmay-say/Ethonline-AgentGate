import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Bot, Server, KeyRound, CheckCircle2 } from 'lucide-react';

const layers = [
  {
    num: '01',
    cls: 'blue-layer',
    borderCls: 'border-rf-blue',
    icon: Bot,
    title: 'Agent & User Intent Layer',
    desc: 'The agent or user requests a payment simply using the recipient’s regular wallet address. Bazantic Gateway and MCP translate natural language prompts and recipes into structured prepare requests.',
    badges: [
      { cls: 'orange', label: 'Normal wallet address input' },
      { cls: 'blue', label: 'Bazantic MCP & Gateway interface' },
      { cls: 'blue', label: 'Zero stealth complexity exposed' },
    ],
    badgeBorder: 'border-rf-blue/50',
    reverse: false,
  },
  {
    num: '02',
    cls: 'orange-layer',
    borderCls: 'border-rf-peach',
    icon: Server,
    title: 'AgentGate Backend & Policy Engine',
    desc: 'The live Railway backend resolves registered recipient metadata, enforces daily spending caps and token whitelist policies, and derives a fresh SECP256k1 ERC-5564 stealth destination.',
    badges: [
      { cls: 'orange', label: 'Registered metadata resolution' },
      { cls: 'blue', label: 'Fresh stealth destination derived' },
      { cls: 'violet', label: 'State: PREPARED (Idempotent)' },
    ],
    badgeBorder: 'border-rf-peach/50',
    reverse: true,
  },
  {
    num: '03',
    cls: 'violet-layer',
    borderCls: 'border-rf-violet',
    icon: KeyRound,
    title: 'Signer Isolation Security Boundary',
    desc: 'The most critical boundary: private keys stay completely outside the Gateway and agent API. The agent can only create a PREPARED plan; an authorized isolated signer must review and broadcast.',
    badges: [
      { cls: 'orange', label: 'Private key isolated from API' },
      { cls: 'blue', label: 'Protected against LLM retry loops' },
      { cls: 'violet', label: 'next_step: local_signer_review' },
    ],
    badgeBorder: 'border-rf-violet/50',
    reverse: false,
  },
  {
    num: '04',
    cls: 'blue-layer',
    borderCls: 'border-rf-blue',
    icon: CheckCircle2,
    title: 'Base Sepolia On-Chain Settlement',
    desc: 'The verified helper contract executes the 1 USDC transfer to the fresh stealth address and emits an ERC-5564 Announcement with the ephemeral public key and view tag for offline recipient discovery.',
    badges: [
      { cls: 'orange', label: 'Base Sepolia Chain ID 84532' },
      { cls: 'blue', label: 'Corrected Helper: 0x30981A...1e0c' },
      { cls: 'violet', label: 'ERC-5564 Announcement emitted' },
    ],
    badgeBorder: 'border-rf-blue/50',
    reverse: true,
  },
];

const dotColors: Record<string, string> = {
  orange: 'bg-rf-orange',
  blue: 'bg-[#2563EB]',
  violet: 'bg-[#7C3AED]',
};

export const ArchitectureLayers: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="architecture" className="py-16 md:py-24 bg-[#F5F0EB]">
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="text-xs font-bold text-rf-orange uppercase tracking-wider bg-rf-orange/10 px-3 py-1 rounded-full">
            Full System Architecture
          </span>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight mt-3">
            Designed for Autonomous Agents, Isolated for Real Security
          </h2>
          <p className="text-rf-dark/70 text-base mt-2">
            The agent never holds or sees the private signing key. AgentGate separates payment preparation from payment execution.
          </p>
        </motion.div>

        {/* 4 Architecture Cards */}
        <div className="flex flex-col gap-6">
          {layers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.45 }}
                className={`layer-card ${layer.cls} bg-white shadow-sm border`}
                style={{ padding: '32px' }}
              >
                <div className={`flex flex-col ${layer.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 items-start justify-between`}>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-7 h-7 text-rf-dark" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-rf-orange uppercase tracking-wider">
                        Layer {layer.num}
                      </div>
                      <h3 className="font-display text-[22px] sm:text-[26px] font-bold text-rf-dark mt-0.5">
                        {layer.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-[15px] text-rf-dark/75 leading-relaxed max-w-xl">
                    {layer.desc}
                  </p>
                </div>

                <div className={`flex flex-wrap gap-2.5 mt-6 pt-5 border-t ${layer.badgeBorder}`}>
                  {layer.badges.map((b) => (
                    <div key={b.label} className={`feature-badge ${b.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[b.cls]}`} />
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
