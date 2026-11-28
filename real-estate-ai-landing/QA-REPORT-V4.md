# QA Report — V4

**Date:** 28 Nov 2026.
**Build:** the V4 production build (`vite build` + `vite preview`), tested in Playwright Chromium 1.63.
**Related:** `V4-AUDIT.md` (the V3 site before changes), `PERFORMANCE-REPORT-V4.md`, `CONTENT-CHANGES.md`.

## Summary

| Check | Result |
|---|---|
| Automated tests | **61 passed, 4 skipped by design** (V3: 52). The four skipped tests are mobile-only tests that skip themselves in the desktop project. |
| Test stability | Seven full runs. Six passed completely. In one run a single test timed out at 360 px; it passed on re-run and could not be reproduced in 16 targeted page loads (see §6). |
| TypeScript and production build | No errors |
| Console, JS and network errors | None on load (automated test) and none at any of the six mobile sizes |
| White product UI | Verified by an automated test that measures background colour (see §1) and by inspecting every section capture |
| Horizontal overflow | None at 1920, 1440, 1280, 1024, 768, 430, 390, 375, 360 or 320 px |
| Content clipped off-screen | None at 320, 360, 390 or 768 px (new test, see §1) |
| Lighthouse | Desktop 99–100, mobile 92–97; accessibility, best practices and SEO 100 |
| Walkthrough video | 77.5 s, 10 scenes, 1920 × 1080, 30 fps, white product screens |
| Review recordings | Desktop 199.5 s at 1920 × 1080. Mobile 232.8 s at 780 × 1688 (390 × 844 at 2×). Both real time, 30 fps. |

## 1. New and changed tests in V4

| Test | What it proves |
|---|---|
| Product interfaces are white inside dark sections (new) | The hero dashboard, analytics dashboard, voice player, transcript rows, omnichannel centre card, use-case dashboard and integration cards each resolve to a background luminance above 235 of 255. The six sections around them still have the dark `#080515` background. The hero dashboard shows Overview, Lead management, AI call activity, Qualification, Site visits, Recent activity and the "Last 7 days" selector. |
| No content clipped past the viewport, at 320 / 360 / 390 / 768 px (new) | No heading, paragraph, list item, table cell, button or link extends past the screen edge. The existing overflow test cannot see this, because sections clip sideways overflow. This test found two real defects, both fixed (§5). |
| Integrations (changed) | A hovered card reports `data-active="true"` and the engine caption names the traced tool. |
| Mobile features (changed) | All ten feature cards contain a product illustration on phones. |
| Video modal (changed) | The source is `product-walkthrough-v4`; duration is over 60 s; the silent toggle switches the file; closing stops playback. |

All V3 tests were kept: navigation, dropdown, anchors, demo modal and validation, voice tabs, playback, seek, language switching and exclusivity, workflow steps, use-case tabs with keyboard, funnel toggle, chart tooltips, integration sequence, FAQ with keyboard, legal dialogs, reduced motion, active-section marking, qualification reaching score 86, demo-data consistency, a slow-network run, overflow at ten widths, mobile menu and touch targets.

## 2. White product design system

Tokens (`.product` scope in `src/styles/globals.css`): application background `#F7F8FC`, surface `#FFFFFF`, text `#171923`, body `#475467`, secondary text `#667085`, border `#E5E7EB`, accent `#6A3FF0` (the approved violet at AA contrast on white), success `#16A34A`, warning `#D97706`, error `#DC2626`.

Components (`src/components/product/`): DashboardShell, DashboardSidebar, DashboardHeader, MetricCard, LeadTable, StatusBadge, CallCard, VoiceWaveform, BuyerProfile, QualificationChecklist, AppointmentCalendar, ActivityTimeline, NotificationCard, CampaignChart, IntegrationCard and MobileDashboard, plus Panel, ScoreBar, SelectPill, Avatar and AgentOrb.

| Brief item | Where | Status |
|---|---|---|
| 1 Hero dashboard | Hero | White |
| 2 Performance analytics dashboard | Performance | White |
| 3 Calling campaign interface | How It Works step 2; Use Cases | White |
| 4 Lead management interface | Hero lead table; Problem card 3 | White |
| 5 Lead qualification cards | Hero, Features, Qualification | White |
| 6 Site visit calendar | Hero, Features, How It Works step 5 | White |
| 7 AI calling interface | Voice Agents; How It Works step 3; Features | White |
| 8 Conversation transcript | Voice Agents; Qualification | White |
| 9 WhatsApp demonstration | Features; walkthrough | Kept in WhatsApp's own light chat style, labelled as a demonstration |
| 10 Automation workflow cards | Omnichannel | White |
| 11 Use-case dashboards | Use Cases, all four tabs | White |
| 12 Buyer profiles | Hero; Mobile CRM; Qualification | White |
| 13 Integration cards | Integrations | White |
| 14 Mobile CRM screens | Mobile CRM | Light (the one black button is now violet) |
| 15 Product walkthrough video | `product-walkthrough-v4` | White |
| 16 GIF demonstrations | `media/gifs/` (6 files, regenerated) | White |

Two things stay dark on purpose: the phone hardware bezel in Mobile CRM, and the glowing AI engine tile at the centre of Integrations, which is a brand mark rather than a product screen.

## 3. Mobile test sizes

Each size has a full-page capture in `preview/v4/responsive/`.

| Size | Overflow | Errors | Page height | Targets under 32 px |
|---|---|---|---|---|
| 320 × 568 | none | 0 | 27,581 px | 21 calendar cells (30 × 30) and the skip link |
| 360 × 800 | none | 0 | 26,392 px | same |
| 375 × 812 | none | 0 | 26,006 px | skip link only |
| 390 × 844 | none | 0 | 25,790 px | skip link only |
| 430 × 932 | none | 0 | 25,035 px | skip link only |
| 768 × 1024 | none | 0 | 21,642 px | skip link only |

The page is about 2,200 px taller than V3 at 390 px, because all ten feature illustrations are now shown on phones. The calendar cells meet WCAG 2.2 AA target size (24 px). The skip link is 1 × 1 px until it receives keyboard focus, which is intended.

## 4. Section-by-section visual quality

Captures: `preview/v4/screenshots/desktop/` and `preview/v4/screenshots/mobile/` (01–18), plus `homepage-desktop-v4.png` and `homepage-mobile-v4.png`. Each section was captured, inspected, corrected and captured again.

| # | Section | Desktop | Mobile | V4 changes and what was checked |
|---|---|---|---|---|
| 01 | Navigation | Pass | Pass | Unchanged. Dropdown, anchors, active state and mobile menu re-tested. The sticky bar does not cover headings (84 px scroll offset). |
| 02 | Hero | Pass | Pass | White command centre: sidebar, header with campaign and date selectors, four metric cards, chart, lead table, call activity, qualification, calendar, recent activity. Five white floating notifications sit outside the dashboard edge from 1440 px; between 1280 and 1439 px only one is shown, over empty sidebar space. Dashboard top moved from about 555 px to about 505 px at 1440 × 900. Cycle 17.1 s. **Mobile:** a separate dashboard with 2 × 2 metrics, a compact chart, one lead and one changing notification; no sidebar. |
| 03 | Trusted By | Pass | Pass | Unchanged; approved categories, no client logos. |
| 04 | Problem | Pass | Pass | Three larger white product visuals (notification with scheduled actions, lead timeline, database table). States now hold 1.8–2.4 s. |
| 05 | Lead Funnel | Pass | Pass | Unchanged. |
| 06 | Performance | Pass | Pass | White dashboard with sidebar on desktop; metrics in a 3 × 2 grid; violet and blue chart lines on a grey grid; readable axis labels; campaign cards on phones. |
| 07 | How It Works | Pass | Pass | All five demos on the white system (step 3 was a black panel). |
| 08 | AI Voice Agents | Pass | Pass | White player and transcript; violet play button; active transcript line gets a violet ring; outcome card turns green when the call ends. |
| 09 | Omnichannel | Pass | Pass | White channel cards and centre card; white particle on the active path. |
| 10 | Features | Pass | Pass | Two black call cards replaced with white ones; Multilingual demo filled out; all ten illustrations on phones. |
| 11 | Use Cases | Pass | Pass | Four distinct white dashboards; tabs re-tested with mouse and keyboard. |
| 12 | Qualification | Pass | Pass | Light answer bubbles; four exchanges visible at a time; ten questions kept. |
| 13 | Integrations | Pass | Pass | Compact white cards with the same brand marks and neutral icons; one disclosure line. |
| 14 | Mobile CRM | Pass | Pass | Names no longer truncated; in-app button is violet; "Product Preview · Coming Soon" kept. |
| 15 | Comparison | Pass | Pass | The toggle layout now also covers tablets (below 1024 px), where the table was cut off. |
| 16 | FAQ | Pass | Pass | Unchanged. |
| 17 | Final CTA | Pass | Pass | Unchanged. |
| 18 | Footer | Pass | Pass | Unchanged; links re-tested. |

## 5. Defects found during V4 QA and fixed

| Defect | How it was found | Fix |
|---|---|---|
| Chart axis numbers were about 5 px tall in the hero and Performance charts | Screenshot inspection | Axis labels are now HTML text over the chart. |
| Hero qualification labels "CONFIGURATION" and "BUDGET" collided | Screenshot at 1440 px | Label shortened to "Config." |
| Hero calendar cells overlapped in a narrow column | Screenshot | Wider column and a capped calendar width. |
| Floating card titles were cut off ("New lead …") | Screenshot | Titles wrap; the time stamp was removed from floating cards. |
| Tablet (768 px): the hero showed the sidebar beside a single stacked column, making a very tall dashboard | 768 px capture | Sidebar appears from 1024 px; panels use two columns on tablets. |
| Tablet: the Site Visit Scheduling card was squeezed into half width | 768 px capture | That card and the 24/7 card span the full row on tablets. |
| Tablet: the comparison table was cut off at the right ("Basic IV") | 768 px capture | Toggle layout below 1024 px. |
| 320 px: two Problem cards were wider than the screen and their text was cut | 320 px capture, then the new clipped-content test | Cards can shrink; the timeline and table drop secondary columns on very small screens. |
| 320–360 px: the Performance header ran past the screen edge | New clipped-content test | Header text truncates inside its container. |
| Green text on white failed contrast (3.3 : 1); two labels on the violet-tinted agent card failed (4.4 : 1) | Lighthouse accessibility dropped to 97 | Green text uses `#15803D`; the two labels use darker colours. Accessibility is back to 100. |
| "Export" pill wrapped onto its own line on phones | Mobile capture | Pill hidden on phones, as intended. |
| Walkthrough scene 2: the dashboard overflowed the frame and sat behind the caption | Frame inspection before the full render | Scene resized. |

## 6. Known issues and limits

- **One unexplained test timeout.** In one of seven full runs, the 360 px clipped-content test timed out after 45 s. Separately, two full-page capture runs stalled while taking a very tall screenshot. The page loaded and scrolled normally in 16 instrumented loads at 320–430 px, so the evidence points to the headless browser on this machine rather than the site, but that is not proven. The capture script now times out and retries.
- **Netlify Forms** is still not enabled on the Netlify project. The demo form cannot submit on the live site until form detection is enabled and the site is redeployed.
- **Voice recordings were not regenerated.** The 12 sample-call clips and the walkthrough narration are the existing ElevenLabs recordings (licensed stock voices; none cloned). A native-speaker review of the Hindi and Hinglish clips is still recommended.
- **Integrations are all planned.** Brand marks show intended compatibility only, with a no-endorsement disclosure.
- **The review recordings predate the last small fixes.** They were recorded before the tablet, 320 px and contrast fixes. Those fixes do not change the 1920 px or 390 px layouts shown in the recordings, apart from slightly darker green text.
- **Performance is lab data only**; see `PERFORMANCE-REPORT-V4.md` for the one mobile LCP run above target.

## 7. Media

- **`product-walkthrough-v4.mp4` / `.webm`:** 77.5 s, 1920 × 1080, 30 fps, with voice-over; `-silent` versions; captions `product-walkthrough-v4.vtt`; poster `product-walkthrough-poster.webp` (a frame of the white dashboard). Scenes: Introduction, Incoming Enquiry, AI Calling, Buyer Conversation, Lead Qualification, WhatsApp Follow-up, Site Visit Booking, CRM Handover, Performance Dashboard, Book a Demo; each lasts 6.5–8.7 s. Eight frames were inspected before rendering.
- **`landing-page-desktop-preview-v4.mp4`:** 199.5 s. Opens with a full 17 s hero cycle, plays the demo video in the modal, then visits every section with pauses and interactions (funnel toggle, chart hover, workflow step, voice tab, language and playback, use-case tabs, integration hover, phone tabs, FAQ) and ends on the full footer.
- **`landing-page-mobile-preview-v4.mp4`:** 232.8 s on a real 390 × 844 viewport. Shows the menu opening and closing, the white mobile dashboard, all 18 sections, workflow steps, the voice player, the integration flow, Mobile CRM, the comparison toggle, FAQ, the demo modal and the footer.
- Both recordings are real time (frames are placed at the times the browser produced them) and carry no audio.
- **`media/videos/hero-animation.*`** (17.6 s) and the six GIFs in `media/gifs/` were regenerated with the white UI. None of these, nor the two review recordings, are in the site bundle.
