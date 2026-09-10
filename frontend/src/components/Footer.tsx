import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-black/10 py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/images/Agentgate_logo_png.png" alt="AgentGate" className="h-8 w-auto rounded" />
              <span className="font-display font-bold text-xl text-rf-dark">AgentGate</span>
            </div>
            <p className="text-sm text-rf-dark/60 leading-relaxed max-w-sm">
              Non-custodial ERC-5564 stealth destinations for autonomous AI agents. Powered by Bazantic Recipes and isolated local companions on Base Sepolia.
            </p>
          </div>

          {/* Protocol */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-rf-dark text-sm uppercase tracking-wider mb-3">Protocol</h4>
            <div className="flex flex-col gap-2 text-sm text-rf-dark/70">
              <a href="#how-it-works" className="hover:text-rf-dark transition-colors">ERC-5564 Scheme 1</a>
              <a href="#architecture" className="hover:text-rf-dark transition-colors">Isolated Companion</a>
              <a href="https://eips.ethereum.org/EIPS/eip-5564" target="_blank" rel="noreferrer" className="hover:text-rf-dark transition-colors">EIP-5564 Standard ↗</a>
            </div>
          </div>

          {/* Developers */}
          <div className="md:col-span-3">
            <h4 className="font-display font-bold text-rf-dark text-sm uppercase tracking-wider mb-3">Developers</h4>
            <div className="flex flex-col gap-2 text-sm text-rf-dark/70">
              <a href="#developer-api" className="hover:text-rf-dark transition-colors">Bazantic Recipe</a>
              <a href="#developer-api" className="hover:text-rf-dark transition-colors">OpenAPI /payment-plans</a>
              <a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer" className="hover:text-rf-dark transition-colors">BaseScan Explorer ↗</a>
            </div>
          </div>

          {/* Community */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-rf-dark text-sm uppercase tracking-wider mb-3">Community</h4>
            <div className="flex flex-col gap-2 text-sm text-rf-dark/70">
              <a href="https://github.com/Tanmay-say/Ethonline-AgentGate" target="_blank" rel="noreferrer" className="hover:text-rf-dark transition-colors">GitHub ↗</a>
              <a href="#pricing" className="hover:text-rf-dark transition-colors">ETHOnline 2026</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rf-dark/50">
          <span>© {new Date().getFullYear()} AgentGate Network. All rights reserved.</span>
          <span className="font-display font-semibold">Recipient Privacy by Default</span>
        </div>
      </div>
    </footer>
  );
};
