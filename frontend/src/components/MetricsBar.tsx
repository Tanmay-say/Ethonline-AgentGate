import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export const MetricsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const partners = [
    'Base Sepolia', 'USDC', 'Claude Code', 'Bazantic',
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
          <a
            href="https://tanmay1say.gitbook.io/agentgate-documentation/"
            target="_blank"
            rel="noreferrer"
            className="btn-orange whitespace-nowrap text-sm"
          >
            Read the Docs ↗
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

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t-2 border-black/8 divide-y-2 sm:divide-y-0 divide-black/8">
          {[
            { metric: 'Base Sepolia', desc: 'Live USDC payment infrastructure' },
            { metric: 'ERC-5564', desc: 'Fresh stealth destination per payment' },
            { metric: 'Bazantic MCP', desc: 'Agent-native payment interface' },
            { metric: '0 private keys', desc: 'Signer isolated from agents & gateway' },
          ].map((stat, i) => (
            <motion.div
              key={stat.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className={`py-8 px-4 text-center flex flex-col justify-center items-center ${
                i % 2 === 0 ? 'sm:border-r-2 sm:border-black/8' : ''
              } ${
                i >= 2 ? 'sm:border-t-2 sm:border-black/8 lg:border-t-0' : ''
              } ${
                i < 3 ? 'lg:border-r-2 lg:border-black/8' : 'lg:border-r-0'
              }`}
            >
              <div className="stat-number text-[26px] sm:text-[28px] lg:text-[30px] xl:text-[34px] leading-tight">
                {stat.metric}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-rf-dark/70 font-medium max-w-[220px] leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
