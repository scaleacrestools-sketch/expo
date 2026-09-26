import { useEffect, useState } from 'react';

export default function StatItem({ value, suffix, label, start, reduced }) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!start) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }
    const duration = 1600;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, reduced]);

  return (
    <li className="stat">
      <p className="stat__value" aria-hidden="true">
        {display}
        <span className="stat__suffix">{suffix}</span>
      </p>
      <p className="stat__label">
        <span className="visually-hidden">
          {value}
          {suffix}{' '}
        </span>
        {label[0]}
        <br />
        {label[1]}
      </p>
    </li>
  );
}
