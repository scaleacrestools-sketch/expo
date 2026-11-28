# Design Notes (V2)

V1 was designed without access to the references. For V2 both were opened in a browser and their computed styles read directly (see `V2-AUDIT.md` §1). This file records what was taken from each and why.

## Sources
- **Agenly** (`agenly.framer.ai`) — primary visual reference: backgrounds, surfaces, card glow, type weight and tracking, button structure, horizon glows, divider orbs, integration hub.
- **HUVO** (`huvo.ai`) — product positioning, real estate workflow, white-section ink/slate palette and spacing.
- **Brand** — the approved purple direction is kept. Agenly itself ships a violet token (`#8057FF`), which is now the primary.

## Colour tokens (`src/styles/globals.css`)
| Token | V2 value | Source |
|---|---|---|
| `--dark-background` | `#080515` | Agenly page background (measured) |
| `--dark-surface` / `-2` | `#0D0D1C` / `#111225` | Agenly cards (measured) |
| `--dark-text` | `#B1B1C1` | Agenly token |
| `--dark-muted` | `#8A8A99` | Between Agenly `#86868E` and V1, AA on navy |
| `--brand-primary` | `#8057FF` | Agenly violet token |
| `--brand-deep` | `#4826B3` | Agenly deep violet token |
| `--brand-solid` | `#6A3FF0` | Solid fill behind small white text (≥4.5:1) |
| `--brand-blue` | `#1856FF` | Agenly primary blue; used only as a secondary data/glow accent |
| `--light-heading` | `#0D1424` | HUVO ink (measured) |
| `--light-text` | `#4F5D73` | HUVO slate (measured, darkened for AA) |
| `--light-border` | `#E6EBF2` | HUVO hairline |
| `--success` / `--warning` / `--danger` | `#12B881` / `#FEBC2E` / `#FF4A4D` | Agenly status tokens |

## Surfaces and depth
- Dark cards use Agenly's inset glow: `inset 0 -16px 64px rgba(116,176,253,.06), inset 0 3px 12px rgba(212,232,255,.04)` over `#0D0D1C`, with an 8% white hairline.
- White cards use a HUVO-style hairline plus a soft, cool drop shadow; hover adds a faint violet lift.
- Primary buttons copy Agenly's structure (vertical gradient, `0 10px 25px` glow, `1.5px` inset highlight, pill radius) in brand violet.

## Typography
- **Inter** for text and **Inter Display** (Inter's 32 pt optical size) for headings, self-hosted as two subset WOFF2 files: 27.5 KB + 26 KB, Latin + ₹ + typographic punctuation (V1 loaded 133 KB).
- Headings use weight 500 with −0.045 to −0.05 em tracking. Agenly uses 400 at 80 px; 500 keeps the same airy display look while staying readable at smaller sizes and on white.
- Devanagari transcripts fall back to the system font (`Noto Sans Devanagari` where available).

## Section transitions
- Wherever the theme changes, the incoming section rises over the previous one as a **sheet** with 24–40 px rounded top corners. Dark sheets carry a 1 px violet hairline; white sheets cast a soft violet shadow upward.
- Same-theme neighbours (Voice → Omnichannel, Final CTA → Footer) are separated by Agenly's **divider orb**.
- Dark sections that end before a white one carry a static violet **horizon glow** at their foot. Nothing large and blurred is animated.
- Section padding reduced to `clamp(56px, 7.5vw, 104px)`.

## Motion system (`src/config/motion.ts` + CSS variables)
| Use | Duration | Easing |
|---|---|---|
| Hover / press | 120–200 ms (`--dur-fast` 160 ms) | `cubic-bezier(.22,1,.36,1)` |
| Card transitions | 200–300 ms (`--dur-card` 260 ms) | same |
| Section entrance | 480 ms, 16 px rise | same |
| Stagger | 60 ms | — |
| Product loops | Hero 9 × 1.15 s ≈ 10 s; omnichannel 7 × 1.5 s; qualification ≈ 12 s; How It Works step every 8 s | linear stepping |

Rules: animate transform and opacity; loops run only while visible (IntersectionObserver); continuous CSS animations pause off-screen; `prefers-reduced-motion` (or `?reduced-motion=1`) shows every demo in its finished state; text renders immediately so a JS failure never hides content above the fold.

## Product storytelling
One fictional story (`src/data/story.ts`) runs through the hero, How It Works, Voice AI, Omnichannel, Qualification, Features, Mobile CRM and the walkthrough video: **Rohan Mehta** enquires via Meta Ads about **Skyline Residences, Whitefield**; wants a **3 BHK**, **₹2 Crore**, **self-use**, **6 months**; **Aria** calls; score **86**; visit **Sat 15 Nov, 11 AM**; assigned to **Kavya Rao**. Dashboard totals (2,480 calls, 68% connect, 846 qualified, 124 visits) are identical in the hero, analytics and video.

## Voice
Sample calls are licensed ElevenLabs `eleven_v4` recordings: agent "Palak M" (female, Indian customer-care), buyer "Neeraj" (male, Delhi Hindi/Hinglish). Each line is a separate clip, so the transcript is time-aligned exactly. The player's waveform is computed from the real audio (RMS peaks). The walkthrough narrator is "Amit Gupta – Confident Sales Advisor". No voices were cloned.
