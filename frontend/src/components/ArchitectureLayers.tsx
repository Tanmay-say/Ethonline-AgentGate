import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const layers = [
  {
    cls: 'blue-layer',
    borderCls: 'border-rf-blue',
    title: 'Own the Privacy',
    img: 'https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/69a6adc5477d3b11cf1c53f9_Group%202087331407.svg',
    desc: 'SECP256k1 scheme-1 stealth address derivation for apps where exposed recipient history breaks user trust. Built to generate fresh, unlinkable one-time destinations with each payment.',
    badges: [
      { cls: 'orange', label: 'ERC-5564 Announcement emission' },
      { cls: 'blue', label: 'Fresh ECDH shared secret per payment' },
      { cls: 'blue', label: 'Recipient offline scanning & spending' },
    ],
    badgeBorder: 'border-rf-blue/50',
    reverse: false,
  },
  {
    cls: 'orange-layer',
    borderCls: 'border-rf-peach',
    title: 'Own the Companion',
    img: 'https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/69dfa11dac5b06d54a67fcc6_e5ea8999e441fa27b9a4eee065aa7acb_Group%202087331528.svg',
    desc: 'Hardware-isolated local signing companion engineered to stay responsive through LLM retries and network timeouts. Durable nonce journals prevent duplicated agent-initiated transfers.',
    badges: [
      { cls: 'orange', label: 'OS-isolated from Claude filesystem' },
      { cls: 'blue', label: 'Durable nonce journal per plan' },
      { cls: 'violet', label: 'Human approval fingerprint gate' },
    ],
    badgeBorder: 'border-rf-peach/50',
    reverse: true,
  },
  {
    cls: 'violet-layer',
    borderCls: 'border-rf-violet',
    title: 'Own the Agent',
    img: 'https://cdn.prod.website-files.com/62f387a85a056619ebadb8de/699497d6e1a720adf1b8d9de_d39d5555fa8f600b54b6b9d9e0073f58_Group%20470231.avif',
    desc: 'Production-ready agent tooling built on the official Bazantic MCP adapter for teams that need predictable behavior, cleaner operations, and less infrastructure overhead.',
    badges: [
      { cls: 'orange', label: 'Published Recipe & tools/list support' },
      { cls: 'blue', label: 'x402-aware baz curl execution' },
      { cls: 'violet', label: 'Base Sepolia verified contracts' },
    ],
    badgeBorder: 'border-rf-violet/50',
    reverse: false,
  },
];

const dotColors: Record<string, string> = {
  orange: 'bg-rf-orange',
  blue: 'bg-[#2563EB]',
  violet: 'bg-[#7C3AED]',
};

export const ArchitectureLayers: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="architecture" className="py-14 md:py-20 bg-white">
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-bold text-rf-dark leading-tight">
            Years of stealth payment research,
          </h2>
          <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-bold text-rf-dark leading-tight">
            now available as one agent-ready stack
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.5 }}
              className={`layer-card ${layer.cls}`}
              style={{ padding: '36px' }}
            >
              <div className={`flex flex-col ${layer.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 items-start`}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`w-[180px] h-[140px] rounded-xl bg-white/60 border ${layer.borderCls} flex items-center justify-center shrink-0 overflow-hidden p-3`}
                >
                  <img src={layer.img} alt={layer.title} className="w-full h-full object-contain" />
                </motion.div>
                <div>
                  <h3 className="font-display text-[24px] font-bold text-rf-dark mb-2">{layer.title}</h3>
                  <p className="text-[15px] text-rf-dark/75 leading-relaxed max-w-2xl">{layer.desc}</p>
                </div>
              </div>
              <div className={`flex flex-wrap gap-2.5 mt-6 pt-5 border-t ${layer.badgeBorder}`}>
                {layer.badges.map((b) => (
                  <div key={b.label} className={`feature-badge ${b.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColors[b.cls]}`} />
                    {b.label}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
