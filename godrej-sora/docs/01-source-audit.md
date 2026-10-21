# Deliverable 1 — Source audit

**Audit date:** 21 October 2026. **Auditor:** Claude Code session, on behalf of the advertiser.

## What was accessible from this environment

| Source | Status | Notes |
|---|---|---|
| Official project page `godrejproperties.com/gurugram/residential/godrej-sora` | **Blocked** by the session's outbound network policy (HTTP 403 from the egress proxy on `www.godrejproperties.com`) | Facts below were taken from the page's indexed snippets via web search, not from a direct read. Re-run the audit from an unrestricted machine before go-live. |
| 64-page Godrej Sora brochure (PDF) | **Not supplied** — not in the repository, not in the connected Google Drive (only Godrej MSR City "Barca" brochures were found) | All brochure-page references in this project come from the brief's page table. Verify each against the real PDF. |
| Google Drive image `2 godrej sora 1080x1080.jpg` | Found, inspected, **rejected** | A pre-launch channel-partner creative with baked-in text, an outdated "Starting @ ₹11.4 Cr / EOI ₹21 Lakh" claim and a generic tower render. Not used. |
| Haryana RERA portal | Blocked by network policy | RERA number taken from the brief; it matches the number cited consistently by third-party listings. |

## Verified project facts (as used on the page)

| Fact | Value | Source | Confidence |
|---|---|---|---|
| Name / tagline | Godrej Sora — "Your Place in the Sun" | brief + official page snippet | High |
| Address | Sector 53, Gurugram; steps from Golf Course Road | official page snippet | High |
| Total residences | 244 | official page snippet ("244 ultra-luxury Japanese-inspired homes") | High |
| Configurations | 3 & 4 BHK | official page snippet | High (see conflict below) |
| Starting price | ₹8.31 Cr* | official page snippet at audit time | Medium — prices change; set from cost sheet |
| Possession | September 2032 | official page snippet | Medium |
| RERA | RC/REP/HARERA/GGM/976/708/2025/79, dated 25-08-2025 | brief; matches listings | High |
| Architect | Hafeez Contractor | official page snippet | High |
| Landscape | Oracles | official page snippet | High |
| Design language | Japanese Shibui; Torii-inspired façade; Zen gardens; water features | official page snippet | High |
| Approx. 50-ft balconies, triple-height lobby, Shiki Clubhouse, onsen-inspired pool | official page snippet | High |
| 2 units per core, private lift lobbies, 3.4 m floor-to-floor, 380–600 sq ft living/dining, Schüco / Villeroy & Boch "or equivalent", 5 lifts per tower | brief (brochure p.44–49) | Medium — reconfirm against brochure |
| Eight Rays (Accessibility … Partnership) | brief (brochure p.11) | Medium — reconfirm wording |
| Amenity list (onsen pool, rooftop pool, gym, spa, sculpted staircase, squash, padel, badminton/multipurpose hall) | brief (brochure p.33–36) | Medium |

## Conflicts found

- **Configuration nomenclature.** The official project page says "3 & 4 BHK"; a separate Godrej landing page (`/landing-page/gurgaon/residential/godrej-sora/`) has described "3.5 & 4.5 BHK". The site uses "3 & 4 BHK" and flags the discrepancy in `content/project.ts`.
- **Areas.** Aggregators disagree wildly (1,552–2,483 sq ft; 2,771–3,971 sq ft; 3,050–4,270 sq ft), likely mixing carpet, built-up and super areas. **No area is shown**; both configurations say "On request" until the cost sheet is loaded.
- **Starting price.** Listings range from ₹7.99 Cr to ₹11.4 Cr. The official-page figure (₹8.31 Cr) is used with an asterisk and a pricing disclaimer.
- **Tower count / land area.** Third-party pages say 2, 3 or 4 towers and 3.6–3.7 acres. **Not used.**
- **Walkthrough.** No official walkthrough URL could be verified. The section is built click-to-play and stays in "pending" mode until `project.walkthrough.id` is set.

## Important missing details (operator to supply)

1. The 64-page brochure PDF, and written permission to republish its artwork and the Godrej / Sora logos.
2. Official renders at source resolution (see `docs/03-image-usage.md` for the exact list and target ids).
3. Current cost sheet: carpet/super area per configuration, price, payment plan.
4. Current availability statement (never imply 244 units are open).
5. Official walkthrough video embed URL and permission.
6. Brochure location map and its distance/time table with the brochure's own caveat wording.
7. Advertiser identity, agent RERA number, sales phone, WhatsApp number and email (`.env.local`).
8. Godrej Properties corporate credentials for Section 17 (approved fact sheet only).
