import React, { useState, useEffect } from 'react';
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
    { label: 'Docs', href: '#developer-api' },
    { label: 'Resources', hasDropdown: true },
  ];

  return (
    <>
      {/* Top Announcement Banner — exact RPC Fast style */}
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

      {/* Main Navigation — RPC Fast exact look */}
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5">
              <img
                src="/images/Agentgate_logo_png.png"
                alt="AgentGate"
                className="h-8 w-auto rounded"
              />
              <span className="font-display font-bold text-xl text-rf-dark tracking-tight">
                AgentGate
              </span>
            </a>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href || '#'}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-[15px] font-medium text-rf-dark hover:bg-white/60 transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <a
                href="#developer-api"
                className="hidden md:flex items-center gap-1 px-5 py-2.5 rounded-xl border-2 border-rf-orange text-rf-orange font-display font-semibold text-[15px] hover:bg-rf-orange hover:text-white transition-all"
              >
                Log In
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
              <a
                href="#developer-api"
                className="btn-orange !py-2.5 !px-5 !text-[15px] !rounded-xl flex items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.515 3.125L2.027 10.864C0.697 11.414 0.705 12.178 1.783 12.518L6.787 14.126L18.363 6.604C18.91 6.261 19.41 6.446 18.999 6.822L9.62 15.538H9.618L9.62 15.539L9.275 20.85C9.781 20.85 10.004 20.611 10.287 20.329L12.718 17.896L17.773 21.741C18.705 22.269 19.374 21.998 19.606 20.852L22.924 4.748C23.264 3.346 22.404 2.711 21.515 3.125Z" fill="currentColor"/>
                </svg>
                Chat
              </a>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-rf-dark"
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div className="lg:hidden bg-white border-t border-black/5 px-6 py-6 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href || '#'}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-rf-dark py-2"
              >
                {item.label}
              </a>
            ))}
            <a href="#developer-api" className="btn-orange mt-3 text-center">
              Get Started Free
            </a>
          </div>
        )}
      </header>
    </>
  );
};
