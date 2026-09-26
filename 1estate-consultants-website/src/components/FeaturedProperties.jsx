import { FEATURED } from '../data/content.js';
import Button from './Button.jsx';
import Carousel from './Carousel.jsx';
import FeaturedPropertyCard from './FeaturedPropertyCard.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function FeaturedProperties() {
  return (
    <section className="section featured" id="featured" aria-labelledby="featured-title">
      <div className="container">
        <div className="featured__head">
          <SectionHeading eyebrow="Featured Properties" title="Explore Top Developments" id="featured-title" />
          <div className="featured__intro" data-reveal style={{ '--delay': '120ms' }}>
            <p>
              Discover thoughtfully selected residential developments across Bangalore, curated to match
              modern lifestyles, investment goals and long-term aspirations.
            </p>
            <Button href="#properties" variant="outline">
              View All Properties
            </Button>
          </div>
        </div>
      </div>
      <div className="featured__slider" data-reveal style={{ '--delay': '180ms' }}>
        <Carousel label="Featured properties">
          {FEATURED.map((p, i) => (
            <FeaturedPropertyCard key={`${p.name}-${i}`} property={p} index={i} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
