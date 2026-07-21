import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const VIDEOS = [
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4',
    label: 'Golden Hour',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4',
    label: 'Still Water',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4',
    label: 'Deep Woods',
  },
  {
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4',
    label: 'Quiet Dawn',
  },
];

const OVERLAY_PNG =
  'https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png';

const NAV_LINKS = ['How It Works', 'Features', 'Pricing', 'Community'];

const STATS = [
  '60+ Deep Sessions',
  '12,000+ Creators',
  '4.8 User Satisfaction',
  'Intentional-First Design',
];

const SYSTEM_FONT = { fontFamily: 'system-ui, sans-serif' } as const;

export default function App() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // "Deep Woods" is bright enough that the hero content flips to a dark ink.
  const isDark = activeVideo === 2;
  const heroColor = isDark ? 'text-[#182C41]' : 'text-white';
  const heroColorSoft = isDark ? 'text-[#182C41]/80' : 'text-white/80';

  const switchVideo = (index: number) => {
    if (index === activeVideo || isTransitioning) return;
    setActiveVideo(index);
    setIsTransitioning(true);
    // Cooldown matches the 1000ms CSS crossfade so rapid clicks can't
    // interrupt a fade mid-flight.
    window.setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background video layer */}
      {VIDEOS.map((video, i) => (
        <video
          key={video.src}
          src={video.src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Transparent PNG overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <img
          src={OVERLAY_PNG}
          alt=""
          aria-hidden="true"
          className="train-bob h-full w-full object-cover"
        />
      </div>

      {/* Content layer */}
      <div className="relative z-[2] flex h-full flex-col px-5 py-5 sm:px-8 sm:py-6">
        {/* Navigation */}
        <nav className="flex items-center justify-between">
          <a href="#" className="text-xl italic text-white sm:text-2xl">
            Lumora
          </a>

          {/* Desktop nav pill */}
          <div className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 pl-5 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                style={SYSTEM_FONT}
                className="px-3 text-sm text-white/90 transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
            <button
              style={SYSTEM_FONT}
              className="ml-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="liquid-glass relative flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative flex h-full flex-col items-center justify-center gap-8">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={`liquid-glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-500 ${
                menuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
            >
              <X className="h-5 w-5" />
            </button>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className={`text-3xl text-white transition-all duration-500 ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                  transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
                }}
              >
                {link}
              </a>
            ))}
            <button
              style={{
                ...SYSTEM_FONT,
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                transitionDelay: menuOpen ? '300ms' : '0ms',
              }}
              className={`mt-6 rounded-full bg-white px-8 py-3 text-base font-medium text-black transition-all duration-500 ${
                menuOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              }`}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero content */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className={`liquid-glass rounded-full px-4 py-1.5 transition-colors duration-700 ${heroColorSoft}`}
          >
            <span style={SYSTEM_FONT} className="text-xs sm:text-sm">
              Over 10,000 minds already finding their clarity
            </span>
          </div>

          <h1
            className={`mt-6 max-w-4xl text-4xl leading-[1.1] transition-colors duration-700 sm:text-5xl md:text-7xl lg:text-[5.5rem] ${heroColor}`}
          >
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          <p
            style={SYSTEM_FONT}
            className={`mt-5 max-w-xl text-sm leading-relaxed transition-colors duration-700 sm:text-base ${heroColorSoft}`}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how
            to protect your presence and create with intention.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="liquid-glass mt-8 flex w-full max-w-[320px] items-center rounded-full p-1.5 pl-5 sm:max-w-sm"
          >
            <input
              type="email"
              placeholder="Your Best Email"
              style={SYSTEM_FONT}
              className={`w-full min-w-0 bg-transparent text-sm outline-none transition-colors duration-700 ${
                isDark
                  ? 'text-[#182C41] placeholder:text-[#182C41]/60'
                  : 'text-white placeholder:text-white/60'
              }`}
            />
            <button
              type="submit"
              style={SYSTEM_FONT}
              className="shrink-0 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              Get Early Access
            </button>
          </form>

          {/* Video switcher */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8">
            {VIDEOS.map((video, i) => (
              <button
                key={video.label}
                onClick={() => switchVideo(i)}
                style={SYSTEM_FONT}
                className={`border-b pb-1 text-xs transition-all duration-700 sm:text-sm ${heroColor} ${
                  i === activeVideo
                    ? `opacity-100 ${isDark ? 'border-[#182C41]' : 'border-white'}`
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {video.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={SYSTEM_FONT}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/70 sm:text-sm"
        >
          {STATS.map((stat, i) => (
            <span key={stat} className="flex items-center gap-4">
              {stat}
              {i < STATS.length - 1 && <span className="hidden text-white/30 sm:inline">|</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
