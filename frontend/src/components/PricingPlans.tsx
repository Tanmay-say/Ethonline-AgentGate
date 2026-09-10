import React from 'react';

export const PricingPlans: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'No credit card needed',
      isPopular: false,
      bg: 'bg-[#FDF0E3]',
      btnClass: 'btn-outline',
      btnText: 'Try it for free',
      rows: [
        ['Available apps', '5'],
        ['Payment Plans / Mo', '10,000'],
        ['Https & Websockets', '✓'],
        ['Console & Statistics', '✓'],
        ['Stealth Derivation', '—'],
        ['Support', '—'],
        ['Network', 'Base Sepolia'],
      ],
    },
    {
      name: 'Growth',
      price: '$39',
      period: '/mo',
      description: 'Over-usage price: $0.8 per million CU',
      isPopular: true,
      bg: 'bg-[#F0E8FA]',
      btnClass: 'btn-orange',
      btnText: 'Get started',
      rows: [
        ['Available apps', '15'],
        ['Payment Plans / Mo', '500,000'],
        ['Https & Websockets', '✓'],
        ['Console & Statistics', '✓'],
        ['Stealth Derivation', '✓'],
        ['Support', 'Priority SLA'],
        ['Network', 'Multi-Chain'],
      ],
    },
    {
      name: 'Enterprise',
      price: "Let's discuss",
      period: '',
      description: '',
      isPopular: false,
      bg: 'bg-rf-base',
      btnClass: 'btn-outline',
      btnText: 'Contact us',
      rows: [
        ['Available apps', 'Unlimited'],
        ['Payment Plans / Mo', 'Unlimited'],
        ['Https & Websockets', '✓'],
        ['Console & Statistics', '✓'],
        ['Hardware Enclave', '✓'],
        ['Support', 'Custom SLA'],
        ['Network', 'Any EVM / L2'],
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #EEF3F7 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-[30px] sm:text-[38px] md:text-[46px] font-bold text-rf-dark text-center leading-tight mb-2">
          AgentGate Pricing
        </h2>
        <h3 className="font-display text-[26px] sm:text-[32px] md:text-[38px] font-bold text-rf-dark text-center leading-tight mb-14">
          Start now — Pay as you like it
        </h3>

        {/* 3-Column Pricing Grid — exact RPC Fast look */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.bg} relative`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-rf-violet text-rf-dark text-sm font-display font-semibold">
                  The most popular
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="font-display text-xl font-bold text-rf-dark">{plan.name}</h4>
                <div className="mt-3">
                  <span className="font-display text-[48px] font-bold text-rf-dark tracking-tight leading-none">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg text-rf-dark/60 font-medium">{plan.period}</span>
                  )}
                </div>
                {plan.description && (
                  <p className="mt-2 text-sm text-rf-dark/60">{plan.description}</p>
                )}
              </div>

              {/* Pricing Rows with dotted lines */}
              <div className="flex-1">
                {plan.rows.map(([label, value]) => (
                  <div key={label} className="pricing-row">
                    <span className="text-rf-dark/80 font-medium">{label}:</span>
                    {value === '✓' ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                    ) : value === '—' ? (
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-400 flex items-center justify-center text-xs font-bold">✕</span>
                    ) : (
                      <span className="font-bold text-rf-dark text-right">{value}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href="#developer-api"
                  className={`${plan.btnClass} w-full text-center`}
                >
                  {plan.btnText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
