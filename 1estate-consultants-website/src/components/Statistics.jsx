import { STATS } from '../data/content.js';
import useInView from '../hooks/useInView.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import StatItem from './StatItem.jsx';

export default function Statistics() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  return (
    <section className="stats" aria-label="1 Estate Consultants in numbers">
      <div className="container">
        <ul className="stats__list" ref={ref}>
          {STATS.map((s) => (
            <StatItem key={s.label.join(' ')} {...s} start={inView} reduced={reduced} />
          ))}
        </ul>
      </div>
    </section>
  );
}
