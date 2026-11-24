import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEVELOPER_DISCLAIMER, SITE } from '../../config/site';
import { ROUTES } from '../../config/routes';
import { IconLocationOutline } from '../ui/Icons';

const DISCLAIMER_INTRO =
  'Please be advised that this website is not the official website of L&T Realty or Larsen & Toubro. It serves solely as an informational portal managed by a RERA-authorized real estate agent.';
const DISCLAIMER_MORE =
  ' This site does not constitute an offer or guarantee of any services or properties. The prices displayed on this website are subject to change without prior notice, and the availability of properties cannot be guaranteed. The images showcased on this website are for representational purposes only and may not accurately reflect the actual properties or amenities. For accurate and up-to-date information regarding services, pricing, availability, and any other details, we recommend that you contact us directly using the contact information provided on this website. We may share your data with Real Estate Regulatory Authority (RERA)-registered developers for further processing as necessary. Additionally, we may send updates and promotional information to the mobile number or email address you provide. All rights reserved. The content, design, and information on this website are protected by copyright and other intellectual property rights. Any unauthorized use or reproduction of the content may violate applicable laws.';

export default function Footer() {
  const [expanded, setExpanded] = useState(false);
  return (
    <footer className="bg-luxury-dark relative overflow-hidden text-white">
      <div className="container mx-auto space-y-5 px-6 py-12 pb-24 text-center font-sans md:px-10 md:pb-12">
        <p className="flex items-center justify-center gap-2 font-serif text-xl text-white md:text-2xl">
          <IconLocationOutline className="shrink-0 text-lg text-champagne" />
          {SITE.name}, {SITE.location}
        </p>
        <p className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs leading-6 text-white/90 md:text-sm">
          Agent RERA Number : {SITE.agentRera}
          <span className="mx-2 hidden text-white/40 sm:inline">|</span>
          <br className="sm:hidden" />
          Project RERA No. {SITE.projectRera}
        </p>
        <p className="mx-auto max-w-5xl font-body text-xs leading-6 text-white/80 md:text-sm md:leading-7">
          <span className="font-semibold text-white/80">Disclaimer</span> - {DISCLAIMER_INTRO}
          {expanded ? DISCLAIMER_MORE : '...'}{' '}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="cursor-pointer text-champagne underline underline-offset-2 transition-colors hover:text-white"
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        </p>
        {expanded ? (
          <p className="mx-auto max-w-5xl font-body text-[11px] leading-6 text-white/65 md:text-xs">
            <span className="font-semibold text-white/80">Developer disclaimer</span> - {DEVELOPER_DISCLAIMER}
          </p>
        ) : null}
        <p className="font-body text-xs text-white/60">
          <Link to={ROUTES.privacyPolicy} className="transition-colors hover:text-champagne">
            Privacy Policy
          </Link>
          <span className="mx-2 text-white/30">|</span>
          <Link to={ROUTES.disclaimer} className="transition-colors hover:text-champagne">
            Disclaimer
          </Link>
          <span className="mx-2 text-white/30">|</span>
          <a href={SITE.reraWebsite} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-champagne">
            haryanarera.gov.in
          </a>
        </p>
      </div>
    </footer>
  );
}
