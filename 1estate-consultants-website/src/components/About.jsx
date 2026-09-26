import { IMAGES } from '../data/content.js';
import Button from './Button.jsx';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__copy">
          <div data-reveal>
            <p className="eyebrow">Who We Are</p>
            <h2 className="about__title" id="about-title">
              Real Estate Decisions, Made Simpler.
            </h2>
            <p className="about__highlight">Trusted Guidance. Better Choices.</p>
          </div>
          <div className="about__body" data-reveal style={{ '--delay': '120ms' }}>
            <p className="about__lead">
              At 1 Estate Consultants, we help homebuyers and investors navigate Bangalore’s real estate
              market with clarity and confidence.
            </p>
            <p>
              From understanding your requirements and identifying suitable projects to comparing options,
              arranging site visits and assisting throughout the buying journey, our focus is on helping you
              make a well-informed property decision.
            </p>
            <p>
              We work across carefully selected residential developments and connect buyers with
              opportunities that match their location, lifestyle, budget and investment objectives.
            </p>
            <Button href="#contact" variant="primary">
              Know More About Us
            </Button>
          </div>
        </div>

        <div className="about__visual" data-reveal style={{ '--delay': '160ms' }}>
          <span className="about__frame" aria-hidden="true" />
          <figure className="about__img about__img--back">
            <img src={IMAGES.interior} alt="Warmly lit modern bedroom interior" loading="lazy" width="530" height="620" />
          </figure>
          <figure className="about__img about__img--front">
            <img
              src={IMAGES.rajkunjPortrait}
              alt="Contemporary residential building facade in Bangalore"
              loading="lazy"
              width="550"
              height="840"
            />
          </figure>
          <p className="about__caption" aria-hidden="true">
            1 Address for Every You.
          </p>
        </div>
      </div>
    </section>
  );
}
