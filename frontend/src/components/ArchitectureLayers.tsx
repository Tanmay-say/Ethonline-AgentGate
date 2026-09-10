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

          {/* Layer 1: Blue — Own the Privacy */}
          <div className="layer-card blue-layer">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* CDN Image a */}
              <div className="w-[220px] h-[180px] rounded-2xl bg-white/60 border border-rf-blue flex items-center justify-center shrink-0 overflow-hidden p-4">
                <img
                  src="https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/69a6adc5477d3b11cf1c53f9_Group%202087331407.svg"
                  alt="Stealth address routing diagram"
                  className="w-full h-full object-contain"
                />
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

          {/* Layer 2: Orange — Own the Companion */}
          <div className="layer-card orange-layer">
            <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
              {/* CDN Image b */}
              <div className="w-[220px] h-[180px] rounded-2xl bg-white/60 border border-rf-peach flex items-center justify-center shrink-0 overflow-hidden p-4">
                <img
                  src="https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/69dfa11dac5b06d54a67fcc6_e5ea8999e441fa27b9a4eee065aa7acb_Group%202087331528.svg"
                  alt="Companion signing architecture"
                  className="w-full h-full object-contain"
                />
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

          {/* Layer 3: Violet — Own the Agent */}
          <div className="layer-card violet-layer">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* CDN Image c */}
              <div className="w-[220px] h-[180px] rounded-2xl bg-white/60 border border-rf-violet flex items-center justify-center shrink-0 overflow-hidden p-4">
                <img
                  src="https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/699497d6e1a720adf1b8d9de_d39d5555fa8f600b54b6b9d9e0073f58_Group%20470231.avif"
                  alt="Agent stack diagram"
                  className="w-full h-full object-contain"
                />
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
