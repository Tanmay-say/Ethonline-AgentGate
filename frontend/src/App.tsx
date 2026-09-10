import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricsBar } from './components/MetricsBar';
import { ComparisonGrid } from './components/ComparisonGrid';
import { InteractiveConsole } from './components/InteractiveConsole';
import { ArchitectureLayers } from './components/ArchitectureLayers';
import { Testimonials } from './components/Testimonials';
import { PricingPlans } from './components/PricingPlans';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#F5F0EB' }}>
      <Navbar />
      <main>
        <Hero />
        <MetricsBar />
        <ComparisonGrid />
        <ArchitectureLayers />
        <InteractiveConsole />
        <Testimonials />
        <PricingPlans />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default App;
