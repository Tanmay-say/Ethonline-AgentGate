import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { PaymentStudio } from './components/PaymentStudio';
import { HowItWorks } from './components/HowItWorks';
import { BazanticIntegration } from './components/BazanticIntegration';
import { ArchitectureLayers } from './components/ArchitectureLayers';
import { ComparisonGrid } from './components/ComparisonGrid';
import { VerifiedProof } from './components/VerifiedProof';
import { BuiltWithStack } from './components/BuiltWithStack';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { AgentGateConsole } from './components/AgentGateConsole';

const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (pathname === '/console') {
    return (
      <div className="min-h-screen font-sans" style={{ background: '#F5F0EB' }}>
        <Navbar />
        <AgentGateConsole />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F5F0EB' }}>
      <Navbar />
      <main>
        <Hero />
        <MetricsBar />
        <PaymentStudio />
        <HowItWorks />
        <BazanticIntegration />
        <ArchitectureLayers />
        <ComparisonGrid />
        <VerifiedProof />
        <BuiltWithStack />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default App;
