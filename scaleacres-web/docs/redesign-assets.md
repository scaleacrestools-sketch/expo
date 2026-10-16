# Homepage redesign — real assets used and assets still needed

## Real assets used
| Asset | Where it appears | Source |
|---|---|---|
| 12 showreel clips (6 shots × 16:9 and 9:16) | Hero showreel (crossfading playlist), About, Services rows 01/03/04/06, Creative Studio → AI Videos, Real Estate background, Contact background | Commissioned in Higgsfield on 16 Oct 2026 (job IDs in `content/media.ts`). Streamed from Higgsfield's CDN for staging. |
| Protected homepage SEO copy (H1, positioning, intro, boilerplate, service headings) | Hero H1, Real Estate section | `content/seo/homepage.ts` (from the Brand Kit; still to be confirmed against the live site) |
| Client and project names, published case-study outcomes | Work, Case Studies | scaleacres.com/case-studies/ and client testimonials |
| Three real blog articles | Insights | scaleacres.com/blog/ |
| Brand colours `#0B0D0D` / `#1CA6DC` and Outfit | Everywhere | ScaleAcres Brand Kit v1.0 |

## Removed
All generated placeholder art is gone: the orange circles, grey bars, fake thumbnails, fake video cards and the gradient showreel.

## Assets still needed (blocking a finished look)
1. **Official ScaleAcres logo:** colour and white PNG/SVG. The header shows a labelled text fallback until then.
2. **Client logos** for Yugen Infra, One Goa, Prominent Realty and Hometrust Realty, plus consent. The client section stays hidden until at least three real logos exist. It never falls back to plain text names.
3. **Project visuals** for each project: website screenshots, brand boards, campaign creatives. Until then the cards show typographic covers labelled "Project visuals pending".
4. **Full case-study copy** from scaleacres.com/case-studies/: challenge, scope, creative and figures.
5. **Social Media Videos and Ad Videos:** web exports of approved reels, such as Auriga 9, DTC Stillwaters, La Wisteria, Codename Flow and BPTP. Those tabs show an "awaiting approved files" state.
6. **Team or studio photography**, if wanted for the About page.
7. **Local copies of the showreel clips:** download them from Higgsfield and run `npm run showreel -- ./clips` before production, so the site does not depend on Higgsfield's CDN.

### How to send files
Either attach them to the chat, or upload them through GitHub's web interface into `scaleacres-web/public/` on the `claude/funny-pascal-2vnisf` branch.
