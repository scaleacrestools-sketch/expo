# ScaleAcres internal pages: v4, art-directed hero banners

The split hero (headline on the left, picture on the right) is gone. Each internal page now opens on a full-bleed banner, and the headline is set over it in live HTML. Every banner uses a different composition, and each is built only from genuine ScaleAcres material.

The design system is unchanged:
- Outfit;
- Brand Black, Royal, Royal Deep, Sky, white and Mist;
- the homepage header and the black footer.

Black stays black, and blue is used only as an accent.

## Files

| File | What it is |
| --- | --- |
| `banners-desktop.jpg` | All 18 desktop banners (16:9), labelled with page and file name |
| `banners-mobile.jpg` | The 18 phone versions (2:3), each composed separately |
| `banners-careers.jpg` | The Careers photo fill for the headline and the team strip |
| `live-heroes-desktop-1.jpg`, `live-heroes-desktop-2.jpg` | The banners live on the pages at 1440 × 900 |
| `live-heroes-mobile.jpg` | The banners live on the pages at 390 × 844 |
| `scaleacres-internal-pages-v4-desktop-1440x900.mp4` | Desktop walkthrough, 3 min 13 s, 23 pages |
| `scaleacres-internal-pages-v4-mobile-390x844.mp4` | Mobile walkthrough, 2 min 43 s, 18 pages |
| `scaleacres-internal-pages-v4-screenshots-desktop.zip`, `-tablet.zip`, `-mobile.zip` | Full-page screenshots of 28 pages at desktop 1440, tablet 820 and mobile 390 (84 images, split by device to stay under GitHub's file-size limit) |
| `about-us-desktop.jpg`, `our-services-desktop.jpg`, `our-work-mobile.jpg`, `creative-studio-tablet.jpg` | Samples from the screenshot set |
| `scaleacres-internal-pages-v4-preview.zip` | Staging preview. Every page is noindex, and nothing on the live site was changed. |
| `scaleacres-internal-pages-v4-source.zip` | Next.js source |

## The banners, page by page

| Page | Composition | Genuine material |
| --- | --- | --- |
| About us | A river of images across the full frame, centred headline, capability labels along the bottom | Delhi studio, founders, SID Realtech Ellington 86 creative, JBBR Group cover, SID website, Intech creative |
| Our team | A wall of 40 real team portraits under a centred headline | Team photos from the live team page only |
| Our services | Eight tall masked slices, one per service. A slice opens on hover and links to its page. | The eight service visuals from the homepage |
| Our work | A tilted portfolio wall in perspective, centred headline | Brand identities, websites and campaign creatives |
| Case studies | A diptych: Yugen Infra on a green-black ground, One Goa on bronze-black | Yugen ad-film posters, One Goa render and film |
| Careers | White page. The oversized headline is filled with team photos, and a strip of team life scrolls beneath it. | Celebration, studio and office photos |
| Blog, Insights and category pages | White magazine front page: an oversized masthead, the lead story large and two more beside it | The posts' own featured images |
| Creative studio | The ScaleAcres reel at full width with a pause control, plus a filmstrip of 23 real film posters | ScaleAcres reel, ad-film, social-video and AI-film posters |
| Contact | "Let's talk." set large over the studio map in Brand Black and Royal. The details sit beneath it and the form follows unchanged. | Studio map |
| Website design | A 3D cascade of live sites with a phone | SID Realtech, Subata, Imperial, Research, Finsckool sites; Subata mobile |
| SEO | Analytics and ranking captures in depth | SEO service visual, first-page rankings, Google results |
| PPC | Google Ads capture with the campaign posts that ran | Google Ads capture; TRG, JBBR, SID, Intech creatives (4:5, uncropped) |
| Lead generation | The live campaign dashboard plus creatives | Yugen / One Goa campaign dashboards; client creatives |
| Facebook ads | Meta Ads results plus creatives | Meta Ads capture; client creatives |
| Branding | A flat-lay of identities | TRG, Ottimo, Karyan, JBBR, Intech identities; SID hoarding |
| Social media | A feed fan: phones with short films and 4:5 posts | Social video posters, JBBR / Intech / SID posts |
| Video production | A 3D wall of film posters, plus a new section of playable films on the page | 16 ScaleAcres film posters |
| Ecommerce | Store in a browser and on a phone | MW&B store |
| Custom applications | Platform in a browser and on a phone | Finsckool |
| City and country pages (92) | A wall of six service visuals | Service visuals |
| Case-study detail pages | The campaign's films (Yugen) or the render and film (One Goa), with the logo, result, client and services in a bar along the bottom | As above |

Each banner is a real file in `public/images/heroes`. There are two sizes for desktop (2400 and 1600 px wide) and two for phones (1080 and 720 px), all WebP, 7.3 MB in total. The phone version is a separate composition, not a crop: the work sits at the top and the headline goes over the dark base.

The rules held throughout:
- Client artwork is never cropped or altered. The 4:5 creatives are shown whole as feed cards.
- No complete PDF or PPT slide is used.
- No logo, screenshot or result is invented.
- No AI or Higgsfield generation was used.

The banners are rebuilt with `scripts/hero-banners` (see its README).

## Motion (same style as the homepage)
- **Load:** the banner unmasks and settles from a slight zoom while the headline rises word by word.
- **Scroll:** the art drifts slower than the copy, and the copy eases out.
- **Pages:** the Services slices open on hover; the Studio filmstrip and Careers strip move slowly and pause on hover.
- **Reduced motion:** for visitors who prefer it, the art shows immediately, the strips stand still and the reel does not play.

## Other page changes
- **Blog:** the three stories in the hero no longer repeat in the list beneath it.
- **Video production:** now has a "Recent films" section with eight playable films.
- **Contact:** the details moved into the banner. The enquiry form, its validation and the map section are unchanged.
- **Code removed:** the old split-hero code (`HeroArt`, `heroes`, `SplitHero`).

## Browser verification (Chromium, actually run)
- **Layout:** 28 pages at 1440, 820 and 390. None has horizontal overflow, broken local images or console errors.
- **Links:** all 170 internal links return 200. Menu, footer and the Map anchor work.
- **Video dialogs:** checked on Creative studio, Our work, Yugen case study and Video production. Each opens the right film with its poster and a fallback link.
- **Banners:** every banner was viewed at full size before use.

## Missing original assets
- **Team:** professional headshots. Several portraits are phone photos, and the team wall would be much stronger with matched studio headshots.
- **Studio:** high-resolution studio and office photography. The About banner and Careers strip use the photos on the live site.
- **Case studies:**
  - the original Yugen and One Goa results cards (only 536 px versions exist);
  - more One Goa campaign creatives;
  - material for Prominent Realty and Hometrust Realty.
- **Campaign captures:** full-resolution Google Ads / Meta Ads screenshots (the current ones are about 1,200–1,400 px wide).
- **Contact:** a higher-resolution map capture or an office exterior photo (the map is 1,600 px wide).

Still awaiting your confirmation (open from v2):
- the case-study figures;
- team size and years;
- the studio address.
