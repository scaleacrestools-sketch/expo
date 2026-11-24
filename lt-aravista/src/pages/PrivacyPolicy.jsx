import { SITE } from '../config/site';
import LegalPage from './LegalPage';

const SECTIONS = [
  {
    title: 'Information We Collect',
    intro: 'We may collect the following types of information when you use our website or interact with us:',
    items: [
      'Personal Information (such as name, phone number, email address) when you submit inquiries or lead forms.',
      'Usage Data (such as IP address, browser type, device information, and time spent on pages).',
    ],
  },
  {
    title: 'How We Use Your Information',
    intro: 'We use your information for the following purposes:',
    items: [
      'To respond to your inquiries and provide requested information',
      'To provide, manage, and maintain our services',
      'To communicate with you regarding updates, offers, or inquiries',
      'To improve our website performance and user experience',
      'To comply with applicable legal and regulatory requirements',
    ],
  },
  {
    title: 'Cookies and Tracking Technologies',
    body: 'We use cookies and similar technologies to enhance your browsing experience and analyze website usage. You may control or disable cookies through your browser settings; however, some features of the website may not function properly.',
  },
  {
    title: 'Data Retention',
    body: 'We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. Data is securely deleted or anonymized once no longer required.',
  },
  {
    title: 'Data Security',
    body: 'We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no method of transmission over the internet is completely secure, and absolute security cannot be guaranteed.',
  },
  {
    title: 'Your Rights',
    intro: 'You have the right to:',
    items: [
      'Access your personal information',
      'Request correction or deletion of your data',
      'Withdraw consent for marketing communications at any time',
    ],
  },
  {
    title: "Children's Privacy",
    body: 'This website is not intended for individuals under the age of 13. We do not knowingly collect personal data from children.',
  },
  {
    title: 'Third-Party Links',
    body: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.',
  },
  {
    title: 'Independent Consultant Disclosure',
    body: `This website is operated by an Independent Real Estate Consultant and Authorized Channel Partner for marketing and lead generation purposes only for ${SITE.name} at Sector 86, Gurugram. This is not the official website of L&T Realty or Larsen & Toubro. Contact: ${SITE.phoneDisplay}. WhatsApp: ${SITE.whatsappDisplay}. Agent RERA Number: ${SITE.agentRera}. Project RERA Number: ${SITE.projectRera}.`,
  },
  {
    title: 'Updates to This Policy',
    body: 'We may update this Privacy Policy periodically. Any changes will be posted on this page with a revised effective date.',
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy">
      <div className="mt-8 space-y-7 font-sans text-sm leading-7 text-neutral-600 sm:text-[15px]">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-serif text-xl font-light text-neutral-900">{s.title}</h2>
            {s.intro ? <p className="mt-2">{s.intro}</p> : null}
            {s.items ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : null}
            {s.body ? <p className="mt-2">{s.body}</p> : null}
          </div>
        ))}
      </div>
    </LegalPage>
  );
}
