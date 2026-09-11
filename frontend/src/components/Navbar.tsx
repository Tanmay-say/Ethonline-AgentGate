import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Products', hasDropdown: true },
    { label: 'EVM Chains', hasDropdown: true },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: 'https://tanmay1say.gitbook.io/agentgate-documentation/', external: true },
    { label: 'Resources', hasDropdown: true },
  ];

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="top-banner font-sans">
        Building at ETHOnline 2026? Non-custodial stealth payments for AI agents.{' '}
        <a
          href="https://github.com/Tanmay-say/Ethonline-AgentGate"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-rf-orange hover:underline"
        >
          Star on GitHub →
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
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href || '#'}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium text-rf-dark hover:bg-black/5 transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-40" />}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://tanmay1say.gitbook.io/agentgate-documentation/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rf-orange text-white font-display font-semibold text-sm hover:bg-rf-orange/90 transition-all shadow-sm"
              >
                <span>Docs</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <a
                href="#developer-api"
                className="hidden md:flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-rf-orange text-rf-orange font-display font-semibold text-sm hover:bg-rf-orange hover:text-white transition-all"
              >
                Log In
                <ChevronDown className="w-3 h-3" />
              </a>

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
            className="lg:hidden bg-white border-t border-black/5 px-6 py-5 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href || '#'}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-rf-dark py-2"
              >
                {item.label}
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
          </motion.div>
        )}
      </header>
    </>
  );
};
