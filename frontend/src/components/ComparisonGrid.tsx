import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const cards = [
  {
    variant: 'is-violet',
    pill: 'violet',
    title: 'One-Time\nStealth\nDestinations',
    desc: 'Every payment generates a fresh, unlinkable stealth address from the recipient\u2019s meta-address. Observers cannot connect the transfer to the recipient\u2019s primary wallet.',
  },
  {
    variant: 'is-orange',
    pill: 'orange',
    title: 'Stable\nUnder\nRetries',
    desc: 'AI-based idempotent replay protection prevents duplicate agent spending during LLM hallucination, timeouts, or RPC network errors.',
  },
  {
    variant: 'is-blue',
    pill: 'blue',
    title: 'Zero Key\nInfiltration',
    desc: '99.99% delivery with hardware-isolated local companion. Keys never enter the API, database, Recipe text, telemetry, or model responses.',
  },
  {
    variant: 'is-black',
    pill: 'black',
    title: 'Native\nBazantic\nRecipes',
    desc: 'Clear MCP tool discovery, Bazantic Recipe publishing, and baz curl execution \u2014 no custom infrastructure overhead.',
  },
];

export const ComparisonGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="how-it-works" className="py-14 md:py-20" style={{ background: 'linear-gradient(180deg, #ECECF7 0%, #EEF3F7 100%)' }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="font-display text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold text-rf-dark text-center leading-tight mb-10"
        >
          AgentGate vs Exposed Agent Wallets
        </motion.h2>

        {/* 2x2 Grid */}
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
              <p className="text-[15px] leading-relaxed text-rf-dark/85">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
