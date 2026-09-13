import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const cards = [
  {
    variant: 'is-violet',
    pill: 'violet',
    title: 'Fresh\nStealth\nDestinations',
    desc: 'Every payment derives a fresh ERC-5564 stealth address from recipient metadata. On-chain observers cannot map the destination back to the recipient’s normal wallet address.',
  },
  {
    variant: 'is-orange',
    pill: 'orange',
    title: 'Signer\nIsolation\nBoundary',
    desc: 'Zero private keys in the Gateway or API. The agent only creates an idempotent PREPARED plan, requiring separate authorized signer review before broadcasting.',
  },
  {
    variant: 'is-blue',
    pill: 'blue',
    title: 'Native\nBazantic\nMCP Tools',
    desc: '6 live Model Context Protocol tools and published Bazantic recipes let Claude Code and autonomous agents discover and prepare payments automatically.',
  },
  {
    variant: 'is-black',
    pill: 'black',
    title: 'Dual-Mode\nFlexible\nRouting',
    desc: 'Default to ERC-5564 recipient-address privacy, or route standard direct transfers when privacy is unnecessary — without changing wallet infrastructure.',
  },
];

export const ComparisonGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="comparison" className="py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #ECECF7 0%, #EEF3F7 100%)' }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-rf-orange uppercase tracking-wider bg-white/80 px-3.5 py-1.5 rounded-full border border-black/5 shadow-sm">
            Architecture Comparison
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight mt-3"
          >
            AgentGate vs Exposed Agent Wallets
          </motion.h2>
          <p className="text-rf-dark/70 text-base mt-2">
            Why autonomous agent transactions require recipient-address privacy and signer isolation.
          </p>
        </div>

        {/* Original 2x2 Grid with Colorful Pills & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.pill}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
              whileHover={{ y: -3, boxShadow: '0 14px 40px -8px rgba(0,0,0,0.08)' }}
              className={`rf-card ${card.variant}`}
            >
              <div className={`rf-pill ${card.pill}`} style={{ whiteSpace: 'pre-line' }}>
                {card.title}
              </div>
              <p className="text-[15px] leading-relaxed text-rf-dark/85 font-sans">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technical Notice */}
        <div className="mt-8 text-center text-xs text-rf-dark/50">
          * Notice: AgentGate supports recipient-address privacy. The sender’s wallet address and token transfer amount remain publicly visible per standard ERC-5564 behavior.
        </div>

      </div>
    </section>
  );
};
