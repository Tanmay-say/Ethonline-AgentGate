import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export const MetricsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const partners = [
    'Base Sepolia', 'Ethereum', 'Claude Code', 'Bazantic',
    'ERC-5564', 'Foundry', 'Viem', 'OpenZeppelin',
  ];

  return (
    <section ref={ref} className="py-12 md:py-16" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #ECECF7 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Trust Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border-2 border-rf-orange-light bg-white/60 p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-5"
        >
          <h2 className="font-display text-[22px] sm:text-[28px] md:text-[34px] font-bold text-rf-dark leading-tight text-center md:text-left max-w-2xl">
            Used by agent developers, privacy builders, and autonomous payment teams.
          </h2>
          <a href="#developer-api" className="btn-orange whitespace-nowrap text-sm">
            Read the Docs
          </a>
        </motion.div>

        {/* Logo Ticker */}
        <div className="relative overflow-hidden mb-10">
          <div className="flex gap-10 items-center opacity-35 logo-track">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="font-display font-semibold text-base text-rf-dark whitespace-nowrap tracking-tight"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Big Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t-2 border-black/8">
          {[
            { num: '99.99%', desc: 'verified delivery across all agent tasks' },
            { num: '<85ms', desc: 'stealth address derivation latency' },
            { num: '100%', desc: 'non-custodial key isolation' },
          ].map((stat, i) => (
            <motion.div
              key={stat.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className={`py-8 px-5 text-center ${i < 2 ? 'md:border-r-2 md:border-black/8' : ''} ${i > 0 ? 'border-t-2 md:border-t-0 border-black/8' : ''}`}
            >
              <div className="stat-number text-[56px] md:text-[68px]">{stat.num}</div>
              <p className="mt-1 text-sm text-rf-dark/60 font-medium">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
