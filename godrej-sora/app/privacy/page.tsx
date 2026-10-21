import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Privacy Policy — Godrej Sora enquiries', robots: { index: false } };

export default function Privacy() {
  const who = site.advertiser.isDeveloper ? 'Godrej Properties Limited' : site.advertiser.name || 'the advertiser (an authorised channel partner)';
  return (
    <main className="washi min-h-screen py-24">
      <article className="container-sora prose-sora max-w-3xl">
        <p className="eyebrow">Privacy policy</p>
        <h1 className="display mt-4 text-4xl">How we use your enquiry.</h1>
        <div className="mt-8 grid gap-5 text-[0.95rem] leading-relaxed text-ink-soft">
          <p><strong>Who collects your data.</strong> Details you submit on this page are collected by {who} to respond to your enquiry about Godrej Sora, Sector 53, Gurugram.</p>
          <p><strong>What we collect.</strong> Name, mobile number, email (where provided), your residence preference, budget, timeline, preferred visit date and time, any message you add, your marketing consent, the lead magnet and button you used, campaign parameters (UTM, click IDs), the referring page, IP address and browser information.</p>
          <p><strong>Why.</strong> To call, message or email you about the project, to send the material you requested (brochure, floor plans, cost sheet, location guide), to arrange a site visit, to prevent spam and duplicate submissions, and to measure advertising effectiveness.</p>
          <p><strong>Consent.</strong> By ticking the consent box you authorise us to contact you via call, SMS, WhatsApp and email, even if your number is registered under DND/NDNC. You can withdraw consent at any time by writing to {site.contact.email || 'the sales desk'}.</p>
          <p><strong>Sharing.</strong> Your details may be shared with Godrej Properties Limited and its authorised sales team, and with service providers (CRM, email, hosting, analytics) who process data on our behalf. We do not sell your data.</p>
          <p><strong>Analytics and advertising.</strong> Where enabled, this site uses Google Analytics 4 and Meta Pixel to measure traffic and conversions. These may set cookies; you can control them through your browser settings.</p>
          <p><strong>Retention.</strong> Enquiry records are kept for as long as needed to serve your enquiry and to meet legal obligations, then deleted.</p>
          <p><strong>Your rights.</strong> You may ask us to access, correct or delete your data, or to stop contacting you, by writing to {site.contact.email || 'the sales desk'}.</p>
          <p className="fine">This policy applies to this marketing landing page only. Godrej Properties Limited&rsquo;s own privacy policy governs data collected on godrejproperties.com.</p>
        </div>
        <Link href="/" className="btn btn-ghost mt-12">Back to Godrej Sora</Link>
      </article>
    </main>
  );
}
