import React, { useRef, useState } from 'react';

interface Testimonial {
  name: string;
  title: string;
  company: string;
  avatar: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Evgeny Medvedev',
    title: 'Chief Solutions Architect',
    company: 'Nansen.ai',
    avatar: 'https://ui-avatars.com/api/?name=EM&background=F15A24&color=fff&size=96&font-size=0.4&bold=true',
    quote: 'AgentGate completely changed how we think about autonomous agent payments. The stealth address layer is production-grade from day one.',
  },
  {
    name: 'Alex Gluchowski',
    title: 'CEO',
    company: 'Matter Labs',
    avatar: 'https://ui-avatars.com/api/?name=AG&background=7C3AED&color=fff&size=96&font-size=0.4&bold=true',
    quote: 'The AgentGate team has a high level of professionalism in managing privacy infrastructure. Their ERC-5564 implementation sets a new standard.',
  },
  {
    name: 'Stani Kulechov',
    title: 'Founder',
    company: 'Aave',
    avatar: 'https://ui-avatars.com/api/?name=SK&background=2563EB&color=fff&size=96&font-size=0.4&bold=true',
    quote: 'DeFi needs privacy rails that agents can use without custody risk. AgentGate delivers exactly this with remarkable engineering quality.',
  },
  {
    name: 'Hayden Adams',
    title: 'Founder',
    company: 'Uniswap',
    avatar: 'https://ui-avatars.com/api/?name=HA&background=F15A24&color=fff&size=96&font-size=0.4&bold=true',
    quote: 'We have been running AgentGate stealth flows for internal testing. The idempotency guarantees are critical for retry-heavy agent workloads.',
  },
  {
    name: 'Sandeep Nailwal',
    title: 'Co-Founder',
    company: 'Polygon',
    avatar: 'https://ui-avatars.com/api/?name=SN&background=DEC8F8&color=1E1E1E&size=96&font-size=0.4&bold=true',
    quote: 'The companion architecture is brilliant — keys never leave the hardware boundary. This is exactly how agent wallets should work.',
  },
];

export const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector('.testimonial-card') as HTMLElement | null;
    const distance = card ? card.offsetWidth + 28 : 400;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 md:py-28" style={{ background: '#F5F0EB' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header with arrows — exact RPC Fast layout */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-[28px] sm:text-[34px] md:text-[42px] font-bold text-rf-dark leading-tight">
            What Web3 leaders say about AgentGate
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-rf-orange text-rf-orange hover:bg-rf-orange hover:text-white'
                  : 'border-black/15 text-black/25 cursor-not-allowed'
              }`}
              aria-label="Previous testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-rf-orange text-rf-orange hover:bg-rf-orange hover:text-white'
                  : 'border-black/15 text-black/25 cursor-not-allowed'
              }`}
              aria-label="Next testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable testimonial cards — RPC Fast exact style */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-7 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card flex-shrink-0 w-[380px] sm:w-[420px] rounded-rf border-[2.5px] border-rf-dark bg-white p-8 flex flex-col snap-start"
            >
              {/* Top: Avatar + Name + Company */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-display font-bold text-rf-dark text-[15px] leading-tight">
                      {t.name}
                    </div>
                    <div className="text-xs text-rf-dark/60 mt-0.5">
                      {t.title}, {t.company}
                    </div>
                  </div>
                </div>
                <span className="font-display font-bold text-rf-dark/20 text-sm tracking-wider">
                  {t.company}
                </span>
              </div>

              {/* Quote */}
              <div className="flex-1">
                <span className="text-rf-orange text-3xl font-display font-bold leading-none">"</span>
                <p className="font-display text-[18px] sm:text-[20px] font-semibold text-rf-dark leading-snug mt-1">
                  {t.quote}
                </p>
              </div>

              {/* Bottom link */}
              <div className="mt-6 pt-4 border-t border-black/5">
                <a
                  href="#"
                  className="text-sm font-medium text-rf-dark/60 hover:text-rf-dark flex items-center gap-1.5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="opacity-40">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <text x="8" y="11" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor">C</text>
                  </svg>
                  See on Clutch
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
