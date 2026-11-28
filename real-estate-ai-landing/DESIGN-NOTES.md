# Design Notes

## Reference analysis and its limits

**Important limitation:** the build environment's network allowlist blocked both reference sites (`agenly.framer.ai` and `huvo.ai` returned a proxy 403 / DNS failure). Computed styles could not be extracted in this session. The palette, type and layout below are a documented approximation of the Agenly visual language, which is a dark, near-black Framer template with white display type, a violet accent, glassy bordered cards, bento grids and integration "hub" graphics. HUVO informed the product scope and content hierarchy through the approved copy in the brief.

To verify against the live reference, open `https://agenly.framer.ai/` in Chrome DevTools, read the `--token-*` custom properties on `:root`, and update the variables at the top of `src/styles/globals.css`. Every component reads from those tokens.

## Colour tokens (approximated)

| Token | Value | Role |
|---|---|---|
| `--dark-background` | `#07070A` | Page / dark section background |
| `--dark-surface` | `#101016` | Cards on dark |
| `--dark-surface-2` | `#16161E` | Inner panels |
| `--dark-border` | `rgba(255,255,255,.08)` | Hairline borders |
| `--dark-heading` | `#FAFAFA` | Headings on dark |
| `--dark-text` | `#A1A1AA` | Body on dark |
| `--brand-primary` | `#8B5CF6` | Accent, primary button, active states |
| `--brand-secondary` | `#A78BFA` | Lines, waveforms, highlights |
| `--brand-accent` | `#C4B5FD` | Accent text on dark, gradient end |
| `--brand-deep` | `#6D28D9` | Accent text on white (contrast), gradient start |
| `--light-background` | `#FFFFFF` / `#F7F7F9` | White and off-white sections |
| `--light-heading` | `#0F0F14` | Headings on white (same hue family as dark bg) |
| `--light-text` | `#52525B` | Body on white |
| `--light-border` | `#E7E7EC` | Card borders on white |

Status colours (success `#22C55E`, warning `#F59E0B`, danger `#EF4444`, info `#38BDF8`) are used only inside product UI badges, always paired with text labels.

Primary buttons use a violet vertical gradient (`#9B70FF → #7C3AED`) with an inner highlight and soft glow, which is the main "premium" signature shared by dark and white sections.

## Typography
- **Inter Variable** (SIL Open Font License), self-hosted via `@fontsource-variable/inter` so it works offline and in screenshots. It is the closest freely licensed match to the geometric grotesk used on the reference.
- Display H1 `clamp(40px, 6.4vw, 78px)`, weight 600, tracking −0.045em, line-height 1.02.
- Section H2 `clamp(32px, 4.4vw, 54px)`, weight 600, tracking −0.04em.
- Card titles 18–22px / 600. Body 16–18px. Dashboard text 10.5–13px with tabular numerals.
- Hero heading uses a subtle white-to-lavender text gradient; white-section headings stay solid ink for clarity.

## Dark / light allocation
Ten dark blocks (navigation, hero, trusted by, performance, voice, omnichannel, use cases, integrations, FAQ, final CTA, footer) and seven white or off-white sections (problem, funnel, how it works, features, qualification, mobile, comparison) give roughly 60/40.

Rules that keep both themes one brand:
- One `Section` component sets semantic variables (`--c-head`, `--c-text`, `--c-card`, `--c-line` …) for its theme; every component reads only those.
- Same eyebrow pill, heading scale, radius (20px cards, 14px panels), button system and icon set in both.
- Adjacent white sections alternate `#FFFFFF` and `#F7F7F9` so they read as connected but distinct.
- Product UI keeps its own look in both themes: on white sections the dashboards appear as white cards; key "live" moments (calls) stay dark to match the hero product.

## Layout
- Container 1240px max, 20–32px gutters. Section padding `clamp(56px, 9vw, 120px)`.
- Centered headers for most sections; left-aligned headers where content sits beside a visual (mobile CRM, FAQ).
- Features use an asymmetric 12-column bento (7/5, 4·4·4 with two tall cards, 5/7, 6/6) so no two rows look alike.
- Mobile layouts are composed intentionally: hero floating cards become a story strip, How It Works becomes an accordion with visuals, the omnichannel ring becomes a hub + grid, integrations stack sources → hub → destinations, phones crossfade.

## Animation system
- **Reveal:** fade + 18px rise on scroll, once, 0.7s `cubic-bezier(.22,1,.36,1)`.
- **Story loops:** small `useLoop` hook advances demo states (hero call flow 7×2s, qualification, omnichannel, step visuals). Loops only run while their section is on screen.
- **Continuous CSS motion** (waveforms, marquee, flow dashes, particles) is paused off-screen through `data-inview="false"`.
- **Reduced motion:** all loops jump to their completed state, CSS animations are neutralised, SVG particles are not rendered, auto-advance stops. `?reduced-motion=1` forces this mode for testing.
- No scroll-jacking or parallax.

## Product illustration system
All product imagery is live React/HTML/SVG, built from one primitive set in `src/components/dashboards/primitives.tsx`: `AppWindow` (browser chrome + "Demo data" tag), `Panel`, `Metric`, `Status` badges, `Avatar`, `AgentOrb` (the AI agent's consistent visual), `MiniCalendar`, and the `Waveform`. The same campaign ("Skyline Residences"), agent ("Aria"), buyer ("Rohan Mehta") and sales executive ("Kavya Rao") recur across sections so the page tells one coherent product story. All names and numbers are fictional sample data.

Charts are lightweight custom SVG (line/area with hover tooltip, bar, donut) rather than a chart library, which keeps the bundle small and lets them share tokens.

## Brand and legal guardrails
- Original logo: a waveform inside a rounded violet tile. Replaceable in one place.
- No HUVO or Agenly branding, assets, recordings, logos, testimonials or metrics are used.
- Third-party integrations are shown as neutral monogram tiles (not official logos), all marked **Planned**, with a no-partnership disclaimer.
- Every chart, table and KPI carries a "Demo data" / "Illustrative data" label.
