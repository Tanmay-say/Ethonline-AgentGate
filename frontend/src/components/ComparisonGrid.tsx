import React from 'react';

export const ComparisonGrid: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #ECECF7 0%, #EEF3F7 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-[30px] sm:text-[38px] md:text-[46px] lg:text-[52px] font-bold text-rf-dark text-center leading-tight mb-14 whitespace-nowrap">
          AgentGate vs Exposed Agent Wallets
        </h2>

        {/* 2x2 Grid — exact RPC Fast comparison card look with colored border + pill + description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          
          {/* Card 1: Violet */}
          <div className="rf-card is-violet">
            <div className="rf-pill violet">
              One-Time<br />Stealth<br />Destinations
            </div>
            <p className="text-[16px] leading-relaxed text-rf-dark/90">
              Every payment generates a fresh, unlinkable stealth address from the recipient's meta-address. Observers cannot connect the transfer to the recipient's primary wallet.
            </p>
          </div>

          {/* Card 2: Orange */}
          <div className="rf-card is-orange">
            <div className="rf-pill orange">
              Stable<br />Under<br />Retries
            </div>
            <p className="text-[16px] leading-relaxed text-rf-dark/90">
              AI-based idempotent replay protection prevents duplicate agent spending during LLM hallucination, timeouts, or RPC network errors.
            </p>
          </div>

          {/* Card 3: Blue */}
          <div className="rf-card is-blue">
            <div className="rf-pill blue">
              Zero Key<br />Infiltration
            </div>
            <p className="text-[16px] leading-relaxed text-rf-dark/90">
              99.99% delivery with hardware-isolated local companion. Keys never enter the API, database, Recipe text, telemetry, or model responses.
            </p>
          </div>

          {/* Card 4: Black */}
          <div className="rf-card is-black">
            <div className="rf-pill black">
              Native<br />Bazantic<br />Recipes
            </div>
            <p className="text-[16px] leading-relaxed text-rf-dark/90">
              Clear MCP tool discovery, Bazantic Recipe publishing, and <code className="bg-black/5 px-1 rounded">baz curl</code> execution — no custom infrastructure overhead.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
