import { ArrowUpRight, MapPin } from './Icons.jsx';

export default function FeaturedPropertyCard({ property, index }) {
  const { name, location, image, alt } = property;
  return (
    <article className="fcard">
      <a href="#properties" className="fcard__link" aria-label={`Know more about ${name}, ${location}`}>
        <div className="fcard__media">
          <img src={image} alt={alt} loading="lazy" width="696" height="450" />
          <span className="fcard__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="fcard__body">
          <div className="fcard__text">
            <h3 className="fcard__name">{name}</h3>
            <p className="fcard__loc">
              <MapPin width={15} height={15} />
              {location}
            </p>
          </div>
          <span className="fcard__cta">
            <span className="fcard__cta-label">Know More</span>
            <span className="fcard__cta-icon">
              <ArrowUpRight width={18} height={18} />
            </span>
          </span>
        </div>
      </a>
    </article>
  );
}
