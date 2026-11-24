import { DEVELOPER_DISCLAIMER, SITE } from '../config/site';
import LegalPage from './LegalPage';

const POINTS = [
  `This website is operated by an Independent Real Estate Consultant and Authorized Channel Partner for marketing and lead generation purposes only for ${SITE.name} at Sector 86, Gurugram.`,
  'This website is NOT the official website of L&T Realty or Larsen & Toubro. The information provided on this website is for general informational purposes only and does not constitute an offer to sell, a solicitation to buy, or a recommendation.',
  'All project details including prices, specifications, layouts, amenities, availability, and timelines are subject to change without prior notice and are subject to approvals from respective authorities.',
  'Images, visuals, brochures, and artistic impressions used on this website are for representational purposes only and may not reflect the actual product.',
  'We do not collect any payments through this website. All bookings, allotments, and transactions, if any, are subject to the terms and conditions of the respective developer.',
  'All trademarks, logos, brand names, and registered marks belong to their respective owners.',
];

export default function Disclaimer() {
  return (
    <LegalPage title="Disclaimer">
      <div className="mt-8 space-y-5 font-sans text-sm leading-7 text-neutral-600 sm:text-[15px]">
        {POINTS.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
        <div>
          <h2 className="font-serif text-xl font-light text-neutral-900">Developer Disclaimer</h2>
          <p className="mt-2">{DEVELOPER_DISCLAIMER}</p>
        </div>
        <div className="rounded border border-neutral-200 bg-neutral-50 px-4 py-4 text-neutral-700">
          <p className="font-medium text-neutral-900">Contact &amp; RERA</p>
          <p className="mt-2">
            Contact:{' '}
            <a href={SITE.phoneTel} className="text-[#443e36] hover:underline">
              {SITE.phoneDisplay}
            </a>
          </p>
          <p>
            WhatsApp:{' '}
            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#443e36] hover:underline">
              {SITE.whatsappDisplay}
            </a>
          </p>
          <p className="mt-2">Agent RERA Number: {SITE.agentRera}</p>
          <p>Registered Project: {SITE.registeredProjectName}</p>
          <p>Project RERA Number: {SITE.projectRera}</p>
          <p>
            HRERA website:{' '}
            <a href={SITE.reraWebsite} target="_blank" rel="noopener noreferrer" className="text-[#443e36] hover:underline">
              haryanarera.gov.in
            </a>
          </p>
        </div>
      </div>
    </LegalPage>
  );
}
