import { IMAGES } from '../data/content.js';
import VisitForm from './VisitForm.jsx';

export default function RequestVisit() {
  return (
    <section className="visit" id="contact" aria-labelledby="visit-title">
      <div className="visit__bg" aria-hidden="true">
        <img src={IMAGES.rajkunjStreet} alt="" loading="lazy" />
      </div>
      <div className="container visit__grid">
        <div className="visit__copy" data-reveal>
          <span className="visit__rule" aria-hidden="true" />
          <p className="visit__lead">Find the right property with guidance that puts your needs first.</p>
          <p className="visit__text">
            Explore carefully selected projects across Bangalore and make your next real estate decision with
            greater clarity and confidence.
          </p>
          <ul className="visit__highlights" aria-label="What we offer">
            <li>Curated Projects</li>
            <li>Personalized Guidance</li>
            <li>Seamless Site Visits</li>
          </ul>
        </div>
        <div data-reveal style={{ '--delay': '140ms' }}>
          <VisitForm />
        </div>
      </div>
    </section>
  );
}
