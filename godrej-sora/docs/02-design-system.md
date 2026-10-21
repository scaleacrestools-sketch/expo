# Deliverable 3 — Design system

Tokens live in `app/globals.css` under `@theme`; components only reference tokens.

## Colour

| Token | Working value | Role | Refine by sampling |
|---|---|---|---|
| `--color-sora-red` | #BD1E2D | Principal accent: eyebrows, primary buttons, rules, blossom | Logo red (brochure p.10 / p.64) |
| `--color-sora-red-deep` | #8F1522 | Hover state of primary | derived |
| `--color-ivory` | #F5EFE5 | Page background (washi) | brochure paper tone |
| `--color-ivory-soft` | #FAF6EF | Alternate section background | derived |
| `--color-washi` / `--color-sand` / `--color-sand-deep` | #EFE7D8 / #E3D7C3 / #C9B89C | Image frames, rules, borders | brochure sandstone |
| `--color-gold` / `--color-gold-soft` | #D5A33C / #E7C77C | Eight Rays sun, italic display accents on dark, gold CTA | Eight Rays artwork (p.11) |
| `--color-ink` / `-soft` / `-mute` | #24211F / #4B4541 / #8A817A | Type and dark sections | brochure typography |
| `--color-sage` / `--color-sage-deep` | #87988B / #5F7264 | Landscaping section only | brochure landscape pages |

No navy, no glossy gradients, no neon. Dark sections use ink, never pure black.

## Typography

- **Manrope Variable** (self-hosted via Fontsource) for everything: display at weight 300 with −0.02em tracking, UI labels at 600 with 0.14–0.34em tracking, body at 400.
- **Instrument Serif Italic** only for the second line of section headings and single-word emphasis (`<em>` inside `.display`, or `.serif-accent`). Never for body copy.
- Type scale is fluid: display `clamp(2.1rem, 5vw, 4.4rem)`, hero `clamp(2.6rem, 7vw, 6.6rem)`, lede `clamp(1.05rem, 1.3vw, 1.25rem)`.
- Official logo artwork is used as supplied (`brand/godrej-sora-logo.*`); the typeset wordmark in `components/Wordmark.tsx` is only the fallback.

## Spacing and grid

- Gutter: 16px (mobile) → 40px (tablet) → 72px (desktop). Max content width 1440px.
- Section rhythm: `--section-y = clamp(5rem, 12vw, 10rem)`.
- Layouts are 12-column editorial compositions (offset images, asymmetric gallery), not equal cards.

## Texture and motifs

- `.washi` (soft radial paper tint) and `.grain` (SVG fractal noise at 4.5% multiply) on light sections.
- Original SVG motifs in `components/ui/motifs.tsx`: eight-ray sun, five-petal blossom, Torii line drawing. These are design-language elements, not reproductions of the logo.
- Thin architectural rules (`.rule`, `.rule-red`).

## Motion principles

- Reveals: translate-up fade (`.reveal`), masked line reveal (`.reveal-mask`), clip-path image reveal (`.img-reveal`), slow image settle (`.img-scale`), ink wipe (`.ink-reveal`). All use `--ease-sora: cubic-bezier(.22,1,.36,1)` and 1–1.8s durations.
- GSAP + ScrollTrigger for the hero parallax and the pinned architecture story (desktop only). Everything else uses IntersectionObserver.
- Balcony image pans 6% over 24s; Eight Rays emblem rotates once per 120s.
- `prefers-reduced-motion: reduce` disables every transform, pan, spin and GSAP timeline.

## Interaction

- Buttons are pill-shaped, uppercase, 0.74rem, 52px tall; hover darkens (primary) or fills 5% (ghost). Focus ring is 2px gold.
- Forms use underline inputs; errors in Sora red, under the field.
- Drawer (side panel) for lead magnets; inline form only in Section 18. No pop-ups.
