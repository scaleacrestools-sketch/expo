import { useInView } from 'react-intersection-observer';

export default function Reveal({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  staggerChildren = false,
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12, rootMargin: '-40px 0px' });
  const cls = ['reveal', `reveal-${variant}`, staggerChildren ? 'reveal-stagger' : '', inView ? 'reveal-visible' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div
      ref={ref}
      className={`${cls} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
