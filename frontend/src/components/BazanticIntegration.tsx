import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  Bot, 
  ExternalLink, 
  Server, 
  ScrollText, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

export const BazanticIntegration: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeMcpTab, setActiveMcpTab] = useState<'codex' | 'config' | 'baz'>('codex');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const mcpSnippets = {
    codex: 'codex mcp add backend-production --url https://agentgate.bazgateway.com/mcp',
    config: `{
  "mcpServers": {
    "backend-production": {
      "url": "https://agentgate.bazgateway.com/mcp"
    }
  }
}`,
    baz: 'baz curl https://agentgate.bazgateway.com --account wallet --json',
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpTools = [
    { name: 'preparePayment', desc: 'Creates idempotent stealth payment plan', highlighted: true },
    { name: 'getPayment', desc: 'Inspects payment state by payment_id', highlighted: false },
    { name: 'getCapabilities', desc: 'Returns Base Sepolia chain & token parameters', highlighted: false },
    { name: 'health', desc: 'Checks database & endpoint readiness', highlighted: false },
    { name: 'healthStatus', desc: 'High-level operational health probe', highlighted: false },
    { name: 'info', desc: 'AgentGate service metadata and versioning', highlighted: false },
  ];

  return (
    <section id="bazantic" className="py-16 md:py-24" style={{ background: '#F5F0EB' }}>
      <div ref={ref} className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border-2 border-rf-orange-light text-rf-orange text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-sm">
            <Bot className="w-3.5 h-3.5" />
            <span>Agent-Native Discovery</span>
          </div>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[44px] font-bold text-rf-dark leading-tight">
            AgentGate is Available to AI Agents Through Bazantic
          </h2>
          <p className="text-rf-dark/75 text-base sm:text-lg mt-3 leading-relaxed font-sans">
            Bazantic turns AgentGate into a discoverable tool for AI agents via a live Gateway and Model Context Protocol (MCP) server. Agents can discover and execute privacy-preserving payments without custom API integration code.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Card 1: Gateway */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="p-6 rounded-2xl bg-[#FDF0E3] border-2 border-rf-peach flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rf-orange/15 text-rf-orange flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-rf-dark">Bazantic Gateway</h3>
              <p className="text-xs text-rf-dark/70 mt-2 leading-relaxed font-sans">
                Secure reverse proxy providing unified routing and endpoint telemetry for autonomous agent requests.
              </p>
              <div className="mt-3 font-mono text-[11px] text-rf-dark/80 break-all bg-white/80 p-2 rounded-lg border border-rf-orange-light">
                https://agentgate.bazgateway.com
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rf-peach">
              <a
                href="https://agentgate.bazgateway.com"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-xs py-2.5 flex items-center justify-center gap-1.5 bg-white hover:bg-rf-orange hover:text-white hover:border-rf-orange transition-all"
              >
                <span>View Gateway</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: MCP Server */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="p-6 rounded-2xl bg-[#F0E8FA] border-2 border-rf-violet flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 text-rf-violet flex items-center justify-center mb-4">
                <Server className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-rf-dark">Bazantic MCP</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">LIVE</span>
              </div>
              <p className="text-xs text-rf-dark/70 mt-2 leading-relaxed font-sans">
                Exposes 6 structured Model Context Protocol tools directly to Claude Code and AI agent runtimes.
              </p>
              <div className="mt-3 font-mono text-[11px] text-rf-dark/80 break-all bg-white/80 p-2 rounded-lg border border-rf-violet/60">
                https://agentgate.bazgateway.com/mcp
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rf-violet/60">
              <a
                href="https://agentgate.bazgateway.com/mcp"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-xs py-2.5 flex items-center justify-center gap-1.5 bg-white hover:bg-rf-orange hover:text-white hover:border-rf-orange transition-all"
              >
                <span>Connect MCP</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.div>

          {/* Card 3: Recipe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="p-6 rounded-2xl bg-[#E8F2FA] border-2 border-rf-blue flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 text-rf-blue flex items-center justify-center mb-4">
                <ScrollText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-rf-dark">AgentGate Recipe</h3>
              <p className="text-xs text-rf-dark/70 mt-2 leading-relaxed font-sans">
                Published Bazantic recipe enforcing strict token (USDC), chain (Base Sepolia), and privacy parameters.
              </p>
              <div className="mt-3 font-mono text-[11px] text-rf-orange font-semibold break-all bg-white/80 p-2 rounded-lg border border-rf-blue/60">
                agentgate-private-usdc-payment
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rf-blue/60">
              <a
                href="https://bazantic.com"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full text-xs py-2.5 flex items-center justify-center gap-1.5 bg-white hover:bg-rf-orange hover:text-white hover:border-rf-orange transition-all"
              >
                <span>Bazantic Platform</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </motion.div>

          {/* Card 4: Signer Boundary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-amber-950">Security Boundary</h3>
              <p className="text-xs text-amber-900/80 mt-2 leading-relaxed font-sans">
                Bazantic and MCP never touch private keys. They prepare the plan, while the authorized signer controls execution.
              </p>
              <div className="mt-3 font-mono text-[11px] text-amber-800 font-semibold bg-white/90 p-2 rounded-lg border border-amber-300">
                next_step: local_signer_review
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-300">
              <a
                href="#architecture"
                className="btn-outline w-full text-xs py-2.5 flex items-center justify-center gap-1.5 bg-white text-amber-950 border-amber-400 hover:bg-amber-100 transition-all"
              >
                <span>Inspect Architecture</span>
              </a>
            </div>
          </motion.div>

        </div>

        {/* Dedicated Direct MCP Connect Terminal Block — Styled to match the theme */}
        <div id="mcp-connect" className="mb-12 rounded-2xl border-2 border-rf-orange-light bg-[#FAF7F4] shadow-md overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#FDF0E3] border-b-2 border-rf-orange-light flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rf-orange text-white flex items-center justify-center shadow-sm">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-rf-dark">Direct MCP Server Connection</h3>
                <p className="text-xs text-rf-dark/70 font-sans">Connect Claude Code, Codex CLI, or Cursor directly to AgentGate</p>
              </div>
            </div>

            {/* Themed Tab Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-rf-orange-light shadow-sm">
              <button
                onClick={() => setActiveMcpTab('codex')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeMcpTab === 'codex'
                    ? 'bg-rf-orange text-white shadow-sm'
                    : 'text-rf-dark/70 hover:text-rf-orange'
                }`}
              >
                Codex CLI
              </button>
              <button
                onClick={() => setActiveMcpTab('config')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeMcpTab === 'config'
                    ? 'bg-rf-orange text-white shadow-sm'
                    : 'text-rf-dark/70 hover:text-rf-orange'
                }`}
              >
                mcp_config.json
              </button>
              <button
                onClick={() => setActiveMcpTab('baz')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeMcpTab === 'baz'
                    ? 'bg-rf-orange text-white shadow-sm'
                    : 'text-rf-dark/70 hover:text-rf-orange'
                }`}
              >
                baz curl
              </button>
            </div>
          </div>

          {/* Code Area */}
          <div className="p-6 md:p-8 font-mono text-xs sm:text-sm bg-[#1E1E1E] text-white rounded-xl mx-4 sm:mx-6 my-4 shadow-inner relative border border-black/10">
            <button
              onClick={() => handleCopy(activeMcpTab, mcpSnippets[activeMcpTab])}
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-lg bg-rf-orange text-white text-xs font-mono font-semibold hover:bg-rf-orange/90 flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copiedKey === activeMcpTab ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === activeMcpTab ? 'Copied!' : 'Copy'}</span>
            </button>

            <pre className="overflow-x-auto pr-16 leading-relaxed whitespace-pre-wrap break-all sm:break-normal font-mono">
              <code>{mcpSnippets[activeMcpTab]}</code>
            </pre>
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3.5 bg-white/90 border-t-2 border-rf-orange-light text-xs text-rf-dark/80 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-rf-dark">Live Endpoint:</span>
              <code className="font-mono font-bold text-rf-orange bg-rf-orange/10 px-2 py-0.5 rounded border border-rf-orange/20">
                https://agentgate.bazgateway.com/mcp
              </code>
            </div>
            <span className="text-xs text-rf-dark/60 font-medium">
              Protocol: Model Context Protocol (MCP) JSON-RPC 2.0
            </span>
          </div>

        </div>

        {/* The 6 MCP Tools Showcase Box — Themed */}
        <div className="rounded-2xl border-2 border-rf-orange-light bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-black/10 gap-3">
            <div>
              <span className="text-xs font-bold text-rf-orange uppercase tracking-wider">Live Capabilities</span>
              <h3 className="font-display font-bold text-xl text-rf-dark mt-0.5">
                6 Model Context Protocol (MCP) Tools Implemented
              </h3>
            </div>
            <span className="text-xs font-mono text-rf-dark/60 bg-[#FAF7F4] px-2.5 py-1 rounded border border-black/5">
              Endpoint: /mcp (JSON-RPC 2.0)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {mcpTools.map((tool) => (
              <div
                key={tool.name}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tool.highlighted
                    ? 'border-rf-orange bg-[#FDF0E3] shadow-sm'
                    : 'border-black/10 bg-[#FAF7F4] hover:border-rf-orange-light'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-sm font-bold ${
                    tool.highlighted ? 'text-rf-orange' : 'text-rf-dark'
                  }`}>
                    {tool.name}
                  </span>
                  {tool.highlighted && (
                    <span className="px-2 py-0.5 rounded-full bg-rf-orange text-white text-[10px] font-bold">
                      CORE
                    </span>
                  )}
                </div>
                <p className="text-xs text-rf-dark/70 leading-relaxed font-sans">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-black/5 flex items-center gap-2 text-xs text-rf-dark/70 font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Autonomous payment preparation is exposed through <code className="font-mono font-bold text-rf-dark">preparePayment</code>, returning state <code className="font-mono font-bold text-rf-dark">PREPARED</code> without moving funds.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
