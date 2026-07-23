import { Fragment, useEffect, useState } from 'react';
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';

/* ------------------------------------------------------------------ *
 * Data
 * ------------------------------------------------------------------ */

type Scene = {
  src: string;
  label: string;
};

const SCENES: Scene[] = [
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

/** The "Deep Woods" scene reads as light, so hero copy inverts to slate. */
const DARK_SCENE_INDEX = 2;
const DARK_FG = '#182C41';
const LIGHT_FG = '#FFFFFF';

/** Body copy opts out of the display serif for legibility. */
const SANS = 'system-ui, sans-serif';

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function App() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // One-shot entrance reveal for the hero block.
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isDark = activeVideo === DARK_SCENE_INDEX;
  const fg = isDark ? DARK_FG : LIGHT_FG;

  const handleVideoChange = (index: number) => {
    // Ignore re-selecting the current scene or clicks during the crossfade.
    if (index === activeVideo || isTransitioning) return;
    setIsTransitioning(true);
    setActiveVideo(index);
    // Cooldown matches the 1000ms opacity crossfade below.
    window.setTimeout(() => setIsTransitioning(false), 1000);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* ---------------------------------------------------------------- *
       * Layer 0 — Background videos (crossfaded)
       * ---------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        {SCENES.map((scene, i) => (
          <video
            key={scene.src}
            src={scene.src}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === activeVideo ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* Edge scrims — keep the always-white nav + stats legible over any
          scene without dimming the center of the frame. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-44 bg-gradient-to-t from-black/45 to-transparent"
      />

      {/* ---------------------------------------------------------------- *
       * Layer 1 — Transparent foreground plate (gentle train-bob)
       * ---------------------------------------------------------------- */}
      <img
        src={OVERLAY_PNG}
        alt=""
        aria-hidden="true"
        className="animate-train-bob pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover"
      />

      {/* ---------------------------------------------------------------- *
       * Layer 2 — Content
       * ---------------------------------------------------------------- */}
      <div className="relative z-[2] flex h-full flex-col px-5 sm:px-8 lg:px-12">
        {/* ----- Navigation ----- */}
        <nav className="flex items-center justify-between py-5 sm:py-6">
          <span className="select-none text-xl italic text-white sm:text-2xl">Lumora</span>

          {/* Desktop nav pill */}
          <div className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 pl-2 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="rounded-full px-4 py-2 text-sm text-white/90 transition-colors hover:text-white"
                style={{ fontFamily: SANS }}
              >
                {link}
              </a>
            ))}
            <a
              href="#"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              style={{ fontFamily: SANS }}
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger with crossfade icons */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="liquid-glass relative flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          >
            <Menu
              className={`absolute h-5 w-5 text-white transition-all duration-300 ${
                menuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-5 w-5 text-white transition-all duration-300 ${
                menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* ----- Hero content ----- */}
        <main
          className={`flex flex-1 flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Badge */}
          <div
            className="liquid-glass hero-fg inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ color: fg }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-80" />
            <span className="text-xs sm:text-sm" style={{ fontFamily: SANS }}>
              Over 10,000 minds already finding their clarity
            </span>
          </div>

          {/* Heading */}
          <h1
            className="hero-fg mt-6 max-w-4xl text-4xl leading-[1.1] sm:text-5xl md:text-7xl lg:text-[5.5rem]"
            style={{ color: fg }}
          >
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          {/* Subtext */}
          <p
            className="hero-fg mt-6 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg"
            style={{ color: fg, fontFamily: SANS }}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless demands. Discover how
            to protect your presence and create with intention.
          </p>

          {/* Email capture */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="liquid-glass hero-fg mt-8 flex w-full max-w-[320px] items-center gap-2 rounded-full p-1.5 pl-5 sm:max-w-sm"
            style={{ color: fg }}
          >
            <label htmlFor="email" className="sr-only">
              Your best email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Best Email"
              className="email-field hero-fg min-w-0 flex-1 bg-transparent text-sm outline-none"
              style={{ color: fg, fontFamily: SANS }}
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:px-5"
              style={{ fontFamily: SANS }}
            >
              Get Early Access
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Scene switcher */}
          <div className="mt-10 flex items-center gap-6 sm:gap-8">
            {SCENES.map((scene, i) => {
              const active = i === activeVideo;
              return (
                <button
                  key={scene.src}
                  type="button"
                  data-active={active}
                  onClick={() => handleVideoChange(i)}
                  className="switch-btn border-b-2 pb-1 text-xs sm:text-sm"
                  style={{
                    color: fg,
                    borderBottomColor: active ? fg : 'transparent',
                    fontFamily: SANS,
                  }}
                >
                  {scene.label}
                </button>
              );
            })}
          </div>
        </main>

        {/* ----- Bottom stats ----- */}
        <footer
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-5 sm:py-6"
          style={{ fontFamily: SANS }}
        >
          {STATS.map((stat, i) => (
            <Fragment key={stat}>
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-white/40 sm:inline">
                  |
                </span>
              )}
              <span className="text-xs text-white/70 sm:text-sm">{stat}</span>
            </Fragment>
          ))}
        </footer>
      </div>

      {/* ---------------------------------------------------------------- *
       * Mobile menu overlay
       * ---------------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
        />

        {/* Close affordance */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className={`liquid-glass absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Panel */}
        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-6">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              onClick={() => setMenuOpen(false)}
              className={`text-3xl text-white transition-all duration-500 ${
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{
                fontFamily: SANS,
                transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms',
              }}
            >
              {link}
            </a>
          ))}

          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className={`mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-medium text-black transition-all duration-500 ${
              menuOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
            }`}
            style={{
              fontFamily: SANS,
              transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
              transitionDelay: menuOpen ? '300ms' : '0ms',
            }}
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
