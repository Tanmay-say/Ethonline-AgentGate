import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-rf-dark text-white">
      {/* Background Watermark */}
      <div
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.035]"
        aria-hidden="true"
      >
        <span
          className="font-display font-bold text-white leading-none tracking-tighter"
          style={{ fontSize: 'clamp(180px, 35vw, 320px)' }}
        >
          AgentGate
        </span>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <img src="/images/Agentgate_logo_png.png" alt="AgentGate" className="h-9 w-auto rounded brightness-200" />
              <span className="font-display font-bold text-xl text-white">AgentGate</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Non-custodial ERC-5564 stealth payment gateway for autonomous AI agents on Base Sepolia. Powered by Bazantic Gateway & MCP server with isolated signer execution.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com/Tanmay-say/Ethonline-AgentGate"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://tanmay1say.gitbook.io/agentgate-documentation/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-rf-orange text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rf-orange/90 transition-colors"
              >
                <span>GitBook Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Contracts & Base Sepolia */}
          <div className="md:col-span-3 md:col-start-6">
            <h4 className="font-display font-bold text-white/80 text-xs uppercase tracking-wider mb-4">
              Base Sepolia (84532)
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-white/60 font-mono">
              <a
                href="https://sepolia.basescan.org/address/0x30981Aa26AAF891AefA33a95c989EbC2D2551e0c"
                target="_blank"
                rel="noreferrer"
                className="hover:text-rf-orange transition-colors flex items-center gap-1"
              >
                <span>Helper: 0x30981A...1e0c</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a
                href="https://sepolia.basescan.org/token/0x036CbD53842c5426634e7929541eC2318f3dCF7e"
                target="_blank"
                rel="noreferrer"
                className="hover:text-rf-orange transition-colors flex items-center gap-1"
              >
                <span>USDC: 0x036CbD...dCF7e</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              <a
                href="https://sepolia.basescan.org/tx/0xae260c2db883c51bea772ea2d70ff9becbac98815eb0253ac3c5cbb4cdda8dca"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400"
              >
                <span>Verified Tx: 0xae26...8dca</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <a
                href="https://eips.ethereum.org/EIPS/eip-5564"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                EIP-5564 Specification ↗
              </a>
            </div>
          </div>

          {/* Bazantic & Agent Tools */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white/80 text-xs uppercase tracking-wider mb-4">
              Bazantic Integration
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-white/60">
              <a
                href="https://ecqmdunbxrbfpabjs4ygu5ryg4.bazgateway.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Live Gateway ↗
              </a>
              <a
                href="https://ecqmdunbxrbfpabjs4ygu5ryg4.bazgateway.com/mcp"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                MCP Server (/mcp) ↗
              </a>
              <a
                href="https://bazantic.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Bazantic Platform ↗
              </a>
              <a
                href="#payment-studio"
                className="hover:text-white transition-colors"
              >
                Recipe Definition
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white/80 text-xs uppercase tracking-wider mb-4">
              Project
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-white/60">
              <a href="#payment-studio" className="hover:text-white transition-colors">Payment Studio</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="#comparison" className="hover:text-white transition-colors">Comparison</a>
              <a href="#proof" className="hover:text-white transition-colors">On-Chain Proof</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>ETHOnline 2026 Submission · AgentGate Team</span>
          <span className="font-mono text-white/40">
            Recipient-Address Privacy via ERC-5564 · Zero Keys in Gateway
          </span>
        </div>
      </div>
    </footer>
  );
};
