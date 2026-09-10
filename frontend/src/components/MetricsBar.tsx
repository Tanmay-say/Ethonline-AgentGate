import React from 'react';

export const MetricsBar: React.FC = () => {
  const partners = [
    'Base Sepolia', 'Ethereum', 'Claude Code', 'Bazantic',
    'ERC-5564', 'Foundry', 'Viem', 'OpenZeppelin',
  ];

  return (
    <section className="py-16 md:py-20" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #ECECF7 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Trust Box — exact RPC Fast look with orange border, rounded corners */}
        <div className="rounded-rf border-2 border-rf-orange-light bg-white/60 p-8 md:p-10 mb-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="font-display text-[26px] sm:text-[32px] md:text-[38px] font-bold text-rf-dark leading-tight text-center md:text-left max-w-2xl">
            Used by agent developers, privacy builders, and autonomous payment teams.
          </h2>
          <a href="#developer-api" className="btn-orange whitespace-nowrap">
            Read the Docs
          </a>
        </div>

        {/* Logo Ticker — gray logos scrolling */}
        <div className="relative overflow-hidden mb-16">
          <div className="flex gap-12 items-center opacity-40 logo-track">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={`${p}-${i}`}
                className="font-display font-semibold text-lg text-rf-dark whitespace-nowrap tracking-tight"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Big Stats — exact RPC Fast style with large orange numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t-2 border-black/10">
          <div className="py-10 px-6 md:border-r-2 md:border-black/10 text-center">
            <div className="stat-number text-[64px] md:text-[80px]">99.99%</div>
            <p className="mt-2 text-base text-rf-dark/70 font-medium">
              verified delivery across all agent tasks
            </p>
          </div>
          <div className="py-10 px-6 md:border-r-2 md:border-black/10 text-center border-t-2 md:border-t-0 border-black/10">
            <div className="stat-number text-[64px] md:text-[80px]">&lt;85ms</div>
            <p className="mt-2 text-base text-rf-dark/70 font-medium">
              stealth address derivation latency
            </p>
          </div>
          <div className="py-10 px-6 text-center border-t-2 md:border-t-0 border-black/10">
            <div className="stat-number text-[64px] md:text-[80px]">100%</div>
            <p className="mt-2 text-base text-rf-dark/70 font-medium">
              non-custodial key isolation
            </p>
          </div>
        </div>

        {/* Lead Callout */}
        <div className="max-w-4xl mx-auto text-center mt-16">
          <h2 className="font-display text-[24px] sm:text-[30px] md:text-[38px] font-bold text-rf-dark leading-tight">
            <span className="span-pill blue">AgentGate Stealth Engine</span> built for autonomous agent workflows where exposed recipient addresses cost trust, engineered for{' '}
            <span className="span-pill violet">unlinkable privacy</span>,{' '}
            <span className="span-pill orange">resilient payments</span>, and{' '}
            <span className="span-pill blue">reproducible recipes</span>.
          </h2>
        </div>
      </div>
    </section>
  );
};
