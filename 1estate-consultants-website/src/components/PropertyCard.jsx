import { whatsappHref } from '../data/content.js';
import { ArrowRight, MapPin, WhatsApp } from './Icons.jsx';

export default function PropertyCard({ property }) {
  const { name, location, image, position, alt } = property;
  return (
    <article className="pcard">
      <div className="pcard__media">
        <img src={image} alt={alt} loading="lazy" style={{ objectPosition: position }} />
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{name}</h3>
        <p className="pcard__loc">
          <MapPin width={15} height={15} />
          {location}
        </p>
        <div className="pcard__actions">
          <a
            className="pcard__btn pcard__btn--wa"
            href={whatsappHref(`${name}, ${location}`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${name} on WhatsApp (opens in a new tab)`}
          >
            <WhatsApp width={16} height={16} />
            WhatsApp
          </a>
          <a className="pcard__btn pcard__btn--primary" href="#contact" aria-label={`View details of ${name}`}>
            View Details
            <ArrowRight width={15} height={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
