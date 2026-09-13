import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { useWallet } from '../wallet';

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const Navbar: React.FC = () => {
  const { address, connect, disconnect, isAvailable, isConnecting } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Send Payment', href: '#payment-studio' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Bazantic', href: '#bazantic' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Proof', href: '#proof' },
    { label: 'Docs', href: 'https://tanmay1say.gitbook.io/agentgate-documentation/', external: true },
  ];

  const navigateToConsole = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState({}, '', '/console');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleConnect = () => {
    void connect().catch(() => undefined);
  };

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="top-banner font-sans">
        Building for ETHOnline 2026 · Non-custodial stealth payments for AI agents ·{' '}
        <a
          href="https://github.com/Tanmay-say/Ethonline-AgentGate"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-rf-orange hover:underline inline-flex items-center gap-0.5"
        >
          <span>Star on GitHub</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <img
                src="/images/Agentgate_logo_png.png"
                alt="AgentGate"
                className="h-7 w-auto rounded"
              />
              <span className="font-display font-bold text-lg text-rf-dark tracking-tight">
                AgentGate
              </span>
            </motion.a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium text-rf-dark hover:bg-black/5 transition-colors"
                >
                  <span>{item.label}</span>
                  {item.external && <ExternalLink className="w-3 h-3 opacity-40" />}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {address && (
                <a href="/console" onClick={navigateToConsole} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rf-orange text-white font-display font-semibold text-sm hover:bg-rf-orange/90 transition-all shadow-sm">
                  <span>Test Console</span>
                </a>
              )}

              {address ? (
                <button type="button" onClick={disconnect} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-black/15 text-rf-dark font-display font-semibold text-sm hover:bg-black/5 transition-all" title="Disconnect this app session">
                  <span>{shortenAddress(address)}</span>
                </button>
              ) : (
                <button type="button" onClick={handleConnect} disabled={isConnecting || !isAvailable} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg border-2 border-rf-orange text-rf-orange font-display font-semibold text-sm hover:bg-rf-orange hover:text-white transition-all disabled:opacity-50">
                  <span>{isConnecting ? 'Connecting...' : isAvailable ? 'Connect Wallet' : 'Wallet Unavailable'}</span>
                </button>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-rf-dark"
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-black/5 px-6 py-5 flex flex-col gap-2 shadow-lg"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-rf-dark py-2 flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.external && <ExternalLink className="w-3.5 h-3.5 opacity-40" />}
              </a>
            ))}
            <a
              href="https://tanmay1say.gitbook.io/agentgate-documentation/"
              target="_blank"
              rel="noreferrer"
              className="btn-orange mt-3 text-center text-sm flex items-center justify-center gap-1.5"
            >
              <span>View GitBook Docs ↗</span>
            </a>
            {address && <a href="/console" onClick={navigateToConsole} className="btn-orange mt-3 text-center text-sm">Test Console</a>}
            {!address && <button type="button" onClick={handleConnect} disabled={isConnecting || !isAvailable} className="btn-outline mt-3 text-center text-sm disabled:opacity-50">{isConnecting ? 'Connecting...' : isAvailable ? 'Connect Wallet' : 'Wallet Unavailable'}</button>}
          </motion.div>
        )}
      </header>
    </>
  );
};
