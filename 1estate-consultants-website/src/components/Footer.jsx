import { CONTACT, FOOTER_LINKS, IMAGES, telHref, whatsappHref } from '../data/content.js';
import { Clock, Facebook, Instagram, LinkedIn, Mail, MapPin, Phone, WhatsApp, XTwitter } from './Icons.jsx';

// Replace '#' with the brand's real profile URLs.
const SOCIAL = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'LinkedIn', href: '#', Icon: LinkedIn },
  { label: 'X (Twitter)', href: '#', Icon: XTwitter },
];

function LinkColumn({ title, links }) {
  return (
    <nav className="footer__col" aria-label={title}>
      <h2 className="footer__heading">{title}</h2>
      <ul className="footer__links">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="footer__logo" aria-label="1 Estate Consultants — back to top">
              <img src={IMAGES.logo} alt="1 Estate Consultants" width="560" height="457" loading="lazy" />
            </a>
            <p className="footer__name">1 Estate Consultants</p>
            <p className="footer__tagline">1 Address for Every You.</p>
            <p className="footer__desc">
              We help homebuyers and investors discover suitable residential developments with personalised
              consultation, project information and buying assistance.
            </p>
            <ul className="footer__social" aria-label="Social media">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} aria-label={label}>
                    <Icon width={17} height={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <LinkColumn title="Quick Links" links={FOOTER_LINKS.quick} />
          <LinkColumn title="Property" links={FOOTER_LINKS.property} />

          <div className="footer__col footer__contact">
            <h2 className="footer__heading">Contact Us</h2>
            <ul className="footer__contact-list">
              <li>
                <Phone width={17} height={17} />
                <div>
                  <span className="footer__label">Phone</span>
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={telHref(p)}>
                      {p}
                    </a>
                  ))}
                </div>
              </li>
              <li>
                <WhatsApp width={17} height={17} />
                <div>
                  <span className="footer__label">WhatsApp</span>
                  <a href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                    {CONTACT.whatsapp}
                  </a>
                </div>
              </li>
              <li>
                <Mail width={17} height={17} />
                <div>
                  <span className="footer__label">Email</span>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </div>
              </li>
              <li>
                <MapPin width={17} height={17} />
                <div>
                  <span className="footer__label">Address</span>
                  <address>
                    {CONTACT.address.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </address>
                </div>
              </li>
              <li>
                <Clock width={17} height={17} />
                <div>
                  <span className="footer__label">Business Hours</span>
                  <span>{CONTACT.hours.days}</span>
                  <span>{CONTACT.hours.time}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__legal">
          <dl className="footer__reg">
            <div>
              <dt>RERA Registration</dt>
              <dd>{CONTACT.rera}</dd>
            </div>
            <div>
              <dt>GSTIN</dt>
              <dd>{CONTACT.gstin}</dd>
            </div>
          </dl>
          <p className="footer__disclaimer" id="disclaimer">
            <strong>Disclaimer:</strong> Information, specifications, images, pricing and availability displayed on
            this website are provided for general informational purposes and may change based on developer updates
            and inventory availability. Buyers are advised to verify current project information, statutory
            approvals and pricing before making a property decision.
          </p>
        </div>

        <div className="footer__bottom">
          <p>© 2026 1 Estate Consultants. All Rights Reserved.</p>
          <ul className="footer__legal-links">
            {FOOTER_LINKS.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
