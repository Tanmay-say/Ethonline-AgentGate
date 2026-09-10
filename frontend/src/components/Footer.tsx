import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-rf-dark text-white">
      {/* Superfluid-style giant letter background */}
      <div
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.035]"
        aria-hidden="true"
      >
        <span
          className="font-display font-bold text-white leading-none tracking-tighter"
          style={{ fontSize: 'clamp(300px, 40vw, 700px)' }}
        >
          AG
        </span>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <img src="/images/Agentgate_logo_png.png" alt="AgentGate" className="h-8 w-auto rounded brightness-200" />
              <span className="font-display font-bold text-xl text-white">AgentGate</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Non-custodial ERC-5564 stealth destinations for autonomous AI agents. Powered by Bazantic Recipes and isolated local companions on Base Sepolia.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://github.com/Tanmay-say/Ethonline-AgentGate" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
              </a>
            </div>
          </div>

          {/* Protocol */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-display font-bold text-white/80 text-sm uppercase tracking-wider mb-4">Protocol</h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <a href="#how-it-works" className="hover:text-white transition-colors">ERC-5564 Scheme 1</a>
              <a href="#architecture" className="hover:text-white transition-colors">Isolated Companion</a>
              <a href="https://eips.ethereum.org/EIPS/eip-5564" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">EIP-5564 Standard ↗</a>
              <a href="#" className="hover:text-white transition-colors">Stealth Meta-Address</a>
            </div>
          </div>

          {/* Developers */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white/80 text-sm uppercase tracking-wider mb-4">Developers</h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <a href="#developer-api" className="hover:text-white transition-colors">Bazantic Recipe</a>
              <a href="#developer-api" className="hover:text-white transition-colors">OpenAPI /payment-plans</a>
              <a href="https://sepolia.basescan.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">BaseScan Explorer ↗</a>
              <a href="#developer-api" className="hover:text-white transition-colors">TypeScript SDK</a>
            </div>
          </div>

          {/* Community */}
          <div className="md:col-span-2">
            <h4 className="font-display font-bold text-white/80 text-sm uppercase tracking-wider mb-4">Community</h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <a href="https://github.com/Tanmay-say/Ethonline-AgentGate" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub ↗</a>
              <a href="#" className="hover:text-white transition-colors">ETHOnline 2026</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} AgentGate Network. All rights reserved.</span>
          <span className="font-display font-semibold text-white/30">Recipient Privacy by Default</span>
        </div>
      </div>
    </footer>
  );
};
