import { PROPERTIES } from '../data/content.js';
import Button from './Button.jsx';
import PropertyCard from './PropertyCard.jsx';
import SectionHeading from './SectionHeading.jsx';

export default function ExploreProperties() {
  return (
    <section className="section explore" id="properties" aria-labelledby="explore-title">
      <div className="container">
        <SectionHeading
          align="center"
          ornament
          id="explore-title"
          title={
            <>
              Explore Properties Made for <em>Every You.</em>
            </>
          }
        >
          From your first home to your next investment, explore thoughtfully selected real estate opportunities
          across Bangalore.
        </SectionHeading>
        <div className="explore__grid">
          {PROPERTIES.map((p, i) => (
            <div key={p.id} data-reveal style={{ '--delay': `${(i % 3) * 90}ms` }}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
        <div className="explore__foot" data-reveal>
          <Button href="#properties" variant="outline">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
