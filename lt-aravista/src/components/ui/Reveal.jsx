import { useInView } from '../../hooks/useInView';

export default function Reveal({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  staggerChildren = false,
}) {
  const { ref, inView } = useInView();
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
