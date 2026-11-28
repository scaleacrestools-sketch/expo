import { useEffect, useState } from 'react';
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
import { LegalModal } from './components/ui/LegalModal';

/** Sections below the first viewport. Loaded as a separate chunk right after first paint. */
export default function BelowFold() {
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  useEffect(() => {
    // The browser could not scroll to a deep link before these sections existed.
    const h = window.location.hash;
    if (h && h.length > 1) document.querySelector(h)?.scrollIntoView({ block: 'start' });
  }, []);
  return (
    <>
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
      <Footer onLegal={setLegal} />
      <LegalModal which={legal} onClose={() => setLegal(null)} />
    </>
  );
}
