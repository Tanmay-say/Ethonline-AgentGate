import React from 'react';

export const ArchitectureLayers: React.FC = () => {
  return (
    <section id="architecture" className="py-20 md:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-[30px] sm:text-[38px] md:text-[46px] font-bold text-rf-dark text-center leading-tight mb-4 max-w-4xl mx-auto">
          Years of stealth payment research,
        </h2>
        <h2 className="font-display text-[30px] sm:text-[38px] md:text-[46px] font-bold text-rf-dark text-center leading-tight mb-16 max-w-4xl mx-auto">
          now available as one agent-ready stack
        </h2>

        <div className="flex flex-col gap-8">

          {/* Layer 1: Blue */}
          <div className="layer-card blue-layer">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Icon Placeholder */}
              <div className="w-[200px] h-[160px] rounded-2xl bg-white/60 border border-rf-blue flex items-center justify-center shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-rf-dark opacity-60">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="4" y1="40" x2="76" y2="40" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="40" y1="4" x2="40" y2="76" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="22" cy="24" r="4" fill="#F15A24" opacity="0.7" />
                  <circle cx="58" cy="56" r="4" fill="#DEC8F8" opacity="0.7" />
                  <circle cx="56" cy="28" r="3" fill="#BCE3FB" opacity="0.7" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-[28px] font-bold text-rf-dark mb-3">
                  Own the Privacy
                </h3>
                <p className="text-[17px] text-rf-dark/80 leading-relaxed max-w-2xl">
                  SECP256k1 scheme-1 stealth address derivation for apps where exposed recipient history breaks user trust. Built to generate fresh, unlinkable one-time destinations with each payment.
                </p>
              </div>
            </div>
            {/* Feature badges */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-rf-blue/50">
              <div className="feature-badge orange">
                <span className="w-2 h-2 rounded-full bg-rf-orange" />
                ERC-5564 Announcement emission
              </div>
              <div className="feature-badge blue">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                Fresh ECDH shared secret per payment
              </div>
              <div className="feature-badge blue">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                Recipient offline scanning & spending
              </div>
            </div>
          </div>

          {/* Layer 2: Orange */}
          <div className="layer-card orange-layer">
            <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
              <div className="w-[200px] h-[160px] rounded-2xl bg-white/60 border border-rf-peach flex items-center justify-center shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-rf-dark opacity-60">
                  <rect x="10" y="20" width="60" height="40" rx="8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="22" y="30" width="36" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <line x1="22" y1="40" x2="58" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="40" cy="12" r="6" fill="#FBD7B6" />
                  <circle cx="40" cy="68" r="6" fill="#DEC8F8" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-[28px] font-bold text-rf-dark mb-3">
                  Own the Companion
                </h3>
                <p className="text-[17px] text-rf-dark/80 leading-relaxed max-w-2xl">
                  Hardware-isolated local signing companion engineered to stay responsive through LLM retries and network timeouts. Durable nonce journals prevent duplicated agent-initiated transfers.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-rf-peach/50">
              <div className="feature-badge orange">
                <span className="w-2 h-2 rounded-full bg-rf-orange" />
                OS-isolated from Claude filesystem
              </div>
              <div className="feature-badge blue">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                Durable nonce journal per plan
              </div>
              <div className="feature-badge violet">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                Human approval fingerprint gate
              </div>
            </div>
          </div>

          {/* Layer 3: Violet */}
          <div className="layer-card violet-layer">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-[200px] h-[160px] rounded-2xl bg-white/60 border border-rf-violet flex items-center justify-center shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-rf-dark opacity-60">
                  <path d="M20 60 L40 20 L60 60 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="40" cy="20" r="5" fill="#DEC8F8" />
                  <circle cx="20" cy="60" r="5" fill="#BCE3FB" />
                  <circle cx="60" cy="60" r="5" fill="#FBD7B6" />
                  <circle cx="40" cy="46" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="40" cy="46" r="3" fill="#F15A24" opacity="0.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-[28px] font-bold text-rf-dark mb-3">
                  Own the Agent
                </h3>
                <p className="text-[17px] text-rf-dark/80 leading-relaxed max-w-2xl">
                  Production-ready agent tooling built on the official Bazantic MCP adapter for teams that need predictable behavior, cleaner operations, and less infrastructure overhead.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-rf-violet/50">
              <div className="feature-badge orange">
                <span className="w-2 h-2 rounded-full bg-rf-orange" />
                Published Recipe & tools/list support
              </div>
              <div className="feature-badge blue">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                x402-aware baz curl execution
              </div>
              <div className="feature-badge violet">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                Base Sepolia verified contracts
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
