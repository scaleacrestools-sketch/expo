# Lumora — Cinematic Hero Section

A fullscreen, single-viewport hero for a mindfulness / focus app, built with
**React + TypeScript**, **Tailwind CSS**, and **Lucide** icons via **Vite**.

The whole experience lives in one component — [`src/App.tsx`](src/App.tsx) — with
its styling in [`src/index.css`](src/index.css).

## Highlights

- **Four crossfading background videos** (`Golden Hour`, `Still Water`, `Deep
  Woods`, `Quiet Dawn`) that swap on a 1000ms opacity fade, guarded by a
  transition cooldown so rapid clicks can't stack.
- **Transparent foreground plate** with a continuous `train-bob` drift
  (`translateY 0 → -6px` at a constant `scale(1.03)` so no edges show).
- **Liquid-glass** surfaces — a luminosity-blended blur with a masked gradient
  hairline border — used for the nav pill, badge, email pill, and menu button.
- **Scene-aware theming**: selecting *Deep Woods* transitions all hero copy to
  slate `#182C41` over 700ms while the nav and stats stay white.
- **Responsive nav** with a desktop link pill and a mobile overlay whose links
  stagger in on a `cubic-bezier(0.4, 0, 0.2, 1)` curve.
- **Instrument Serif** for display type, `system-ui` for body copy, and
  `prefers-reduced-motion` support.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

> The background videos and foreground plate are loaded from remote URLs, so an
> internet connection is required to see the full composition.
