import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #FDF0E3 40%, #F5F0EB 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-[40px] sm:text-[48px] md:text-[56px] lg:text-[60px] font-bold text-rf-dark leading-[1.1] tracking-tight">
              The fastest stealth payment API for agents that can't tolerate exposure
            </h1>

            <p className="mt-7 text-[22px] sm:text-[26px] font-display text-rf-dark leading-snug">
              <span className="span-pill orange">Non-custodial</span> ,{' '}
              <span className="span-pill violet">ERC-5564 stealth</span>{' '}
              agent payments with{' '}
              <span className="span-pill blue">99.99% delivery</span> .
            </p>

            {/* CTA Row */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl border-2 border-rf-orange-light bg-white/40">
              <a href="#developer-api" className="btn-orange whitespace-nowrap">
                Start for Free
              </a>
              <p className="text-[15px] text-rf-dark/80 leading-relaxed">
                Built by infrastructure engineers running nodes for leading ERC-5564 stealth protocols, AI agent frameworks, and DeFi privacy tools.
              </p>
            </div>
          </div>

          {/* Right: Video — bigger circle, no logo overlay */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px]">
              {/* Outer ring — exact RPC Fast style with the circle illustration */}
              <div className="absolute inset-0 rounded-full border-[6px] border-white shadow-lg">
                <div className="absolute inset-[12px] rounded-full overflow-hidden bg-rf-dark">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4"
                  />
                </div>
              </div>

              {/* Decorative dots/lines orbiting — styled like RPC Fast Ethereum illustration */}
              <div className="absolute -top-2 left-1/3 w-3 h-3 rounded-full bg-rf-violet" />
              <div className="absolute top-1/4 -right-3 w-3 h-3 rounded-full bg-rf-orange" />
              <div className="absolute bottom-1/4 -left-3 w-2.5 h-2.5 rounded-full bg-rf-blue" />
              <div className="absolute -bottom-2 right-1/3 w-3 h-3 rounded-full bg-rf-peach" />
              <div className="absolute top-1/2 -right-6 w-[60px] h-[2px] bg-rf-orange-light" />
              <div className="absolute bottom-8 -left-8 w-[50px] h-[2px] bg-rf-violet" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
