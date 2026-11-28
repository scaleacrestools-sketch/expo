import { useState } from 'react';
import { AppProvider, useApp } from './components/ui/AppContext';
import { Modal } from './components/ui/Modal';
import { DemoForm } from './components/forms/DemoForm';
import { VideoModal } from './components/ui/VideoModal';
import { LegalModal } from './components/ui/LegalModal';
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { TrustedBy } from './sections/TrustedBy';
import { Problem } from './sections/Problem';
import { LeadFunnel } from './sections/LeadFunnel';
import { Performance } from './sections/Performance';
import { HowItWorks } from './sections/HowItWorks';
import { VoiceAgents } from './sections/VoiceAgents';
import { Omnichannel } from './sections/Omnichannel';
import { Features } from './sections/Features';
import { UseCases } from './sections/UseCases';
import { Qualification } from './sections/Qualification';
import { Integrations } from './sections/Integrations';
import { MobileCRM } from './sections/MobileCRM';
import { Comparison } from './sections/Comparison';
import { FAQ } from './sections/FAQ';
import { FinalCTA } from './sections/FinalCTA';
import { Footer } from './sections/Footer';

function DemoModal() {
  const { demoOpen, closeDemo } = useApp();
  return <Modal open={demoOpen} onClose={closeDemo} title="Book a demo" testId="demo-modal"><DemoForm /></Modal>;
}

export default function App() {
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  return (
    <AppProvider>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustedBy />
        <Problem />
        <LeadFunnel />
        <Performance />
        <HowItWorks />
        <VoiceAgents />
        <Omnichannel />
        <Features />
        <UseCases />
        <Qualification />
        <Integrations />
        <MobileCRM />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer onLegal={setLegal} />
      <DemoModal />
      <VideoModal />
      <LegalModal which={legal} onClose={() => setLegal(null)} />
    </AppProvider>
  );
}
