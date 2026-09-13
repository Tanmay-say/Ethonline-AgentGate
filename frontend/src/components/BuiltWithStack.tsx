import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Code2, ExternalLink } from 'lucide-react';

const technologies = [
  {
    name: 'Base Sepolia',
    role: 'Settlement Layer',
    desc: 'Ethereum Layer 2 testnet hosting the ERC-5564 announcer and helper contracts.',
    tag: 'Chain 84532',
    link: 'https://sepolia.basescan.org',
  },
  {
    name: 'ERC-5564',
    role: 'Privacy Standard',
    desc: 'Stealth address standard enabling non-interactive one-time address derivation via SECP256k1 ECDH.',
    tag: 'EIP-5564',
    link: 'https://eips.ethereum.org/EIPS/eip-5564',
  },
  {
    name: 'Bazantic',
    role: 'Gateway & Recipes',
    desc: 'Reverse proxy gateway and structured recipes allowing AI agents to discover payment endpoints.',
    tag: 'Agent-Native',
    link: 'https://bazantic.com',
  },
  {
    name: 'Model Context Protocol (MCP)',
    role: 'Agent Standard',
    desc: 'JSON-RPC 2.0 tool specification exposing preparePayment directly to Claude Code and AI runtimes.',
    tag: '6 Tools Live',
    link: 'https://modelcontextprotocol.io',
  },
  {
    name: 'USDC (Base Sepolia)',
    role: 'Payment Asset',
    desc: 'Official Circle testnet USDC contract (0x036CbD...dCF7e) with 6-decimal standard base units.',
    tag: 'ERC-20 Token',
    link: 'https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
  {
    name: 'Viem & Foundry',
    role: 'EVM Tooling',
    desc: 'Solidity contracts compiled and tested with Foundry; cryptographic address derivation powered by Viem.',
    tag: 'Contracts & SDK',
    link: 'https://getfoundry.sh',
  },
  {
    name: 'Railway',
    role: 'Backend Infrastructure',
    desc: 'High-availability Node.js/Express API service handling recipient lookups and policy validation.',
    tag: 'Production API',
    link: 'https://backend-production-1ce76.up.railway.app/health',
  },
  {
    name: 'Supabase Postgres',
    role: 'State Persistence',
    desc: 'Managed PostgreSQL database storing idempotent payment jobs, recipient metadata, and audit records.',
    tag: 'Database',
    link: 'https://supabase.com',
  },
];

export const BuiltWithStack: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="built-with" className="py-16 md:py-24 bg-white">
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rf-orange/10 text-rf-orange text-xs font-bold uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>Open Architecture</span>
          </div>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight mt-1">
            Built With & Powered By
          </h2>
          <p className="text-rf-dark/70 text-base mt-2">
            Production-grade open-source protocols, developer tooling, and cloud infrastructure.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {technologies.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              className="p-5 rounded-2xl bg-[#FAF7F4] border border-black/8 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-rf-dark border border-black/5">
                    {t.tag}
                  </span>
                  <span className="text-xs text-rf-dark/50 font-medium">
                    {t.role}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-rf-dark mt-2">
                  {t.name}
                </h3>
                <p className="text-xs text-rf-dark/70 mt-1.5 leading-relaxed font-sans">
                  {t.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/5">
                <a
                  href={t.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-rf-orange hover:underline flex items-center gap-1"
                >
                  <span>Learn more</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
