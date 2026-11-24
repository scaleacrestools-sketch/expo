import { Link } from 'react-router-dom';
import { IMAGES } from '../../config/images';

export default function Logo({ variant = 'light', className }) {
  return (
    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-block min-w-0">
      <img
        src={IMAGES.ProjectLogo}
        alt="L&T Realty, Sector 86 Gurgaon, Authorized Channel Partner"
        width={320}
        height={128}
        className={`${className ?? 'h-11 w-auto object-contain transition-all duration-300 sm:h-12 md:h-14'} ${variant === 'dark' ? 'brightness-0' : ''}`}
      />
    </Link>
  );
}
