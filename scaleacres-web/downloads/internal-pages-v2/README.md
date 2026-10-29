# ScaleAcres internal pages: review fixes (v2)

This version fixes the issues from the internal-pages design review. It keeps the existing design system: Outfit, the same header, the black footer, and blue used only as an accent.

## Files

| File | Contents |
| --- | --- |
| `scaleacres-internal-pages-v2-preview.zip` | The staging preview. Every page is noindex, and robots.txt disallows all crawling. |
| `scaleacres-internal-pages-v2-desktop-1440x900.mp4` | Desktop walkthrough, 2 min 23 s. |
| `scaleacres-internal-pages-v2-mobile-390x844.mp4` | Mobile walkthrough, 2 min 43 s. |
| `scaleacres-internal-pages-v2-screenshots.zip` | Full-page screenshots of 20 pages, in `desktop/` (1440 px) and `mobile/` (390 px). |
| `*-desktop.jpg`, `*-mobile.jpg`, `enquiry-form-validation.jpg` | Quick-look screenshots. |
| `scaleacres-internal-pages-v2-source.zip` | The Next.js source code. |

**How each walkthrough ends.** The Contact page shows the form's live validation. On Our Work, a video tile is opened: the dialog opens, but the player stays black in the recording. Vimeo and YouTube cannot load on our test machine. Playback itself was checked separately (see "Checked in a real browser" below).

## Page-by-page checklist

### 1. About us
**Fixed**
- The live "Get started" line used to sit alone in a large empty section. It is now one compact call-to-action strip.
- The founders photo was a full-height arch. It is now a portrait beside the story, with the story set large.
- The numbers band ("Why ScaleAcres?") is shorter.
- "Our Journey" is set at reading size.
- Body copy on all internal pages is larger and higher-contrast: 18 px body and 18–21 px leads.
- Vertical spacing between sections is about 15% tighter on every internal page.

**Also changed:** On the live site, the three "Our expertise" lines are cut off mid-sentence ("Targeted Lead Generation – Connecting you"). The page now shows only the complete names, each paired with the matching ScaleAcres service work.

**Unresolved:** About says "29+ team members, 6+ years", while Our Services says "33+, 4+". Both figures come from the live pages. Please confirm which is correct.

### 2. Our team
**Fixed**
- The hero collage photo cropped badly. It is replaced by three culture photos, all at the same ratio.
- Empty sections are removed:
  - the "Our Journey" heading, which had no content;
  - the decorative background shape;
  - the carousel's Previous/Next leftovers.
- All 55 profile cards now use the same 4:5 crop, with faces kept near the top.
- The life cards and the work-culture gallery now form even 4-column grids.
- Founders use the same layout as on About.

**Verified:** Every name and role is exactly as published on scaleacres.com. Where the live page gives no role, none is shown.

**Unresolved:** Some source portraits are casual phone photos. Consistent professional headshots would lift this page further.

### 3. Our services
**Kept:** The stacked services showcase, unchanged.

**Fixed**
- Every "Solution we provide" image now sits in the same white frame on a light background. The frame uses a fixed 16:10 ratio and the image is contained, not cropped.
- Solution headings are larger, and each is numbered (for example 01 / 07).
- The live page repeats "Generate leads, enhance branding…" twice. It now appears once, as a compact strip.

### 4. Our work
**Fixed**
- Every website project now has a proper client name and a consistent label, such as "Real estate · Next.js, Node.js". Before, some labels were garbled filenames like "Rpsrudrom" or "Jbbr Homee Page 1".
- The real estate video grid was a set of blank embeds. It now shows real Vimeo posters. A video plays in a dialog only when someone clicks it.
- No full PDF or PPT slides are used. Website work is shown in browser frames that scroll on hover.

### 5. Case studies
**Fixed**
- The two "COMING SOON" cards (Damac Hills 2 and DLF Privana) are removed. The page now shows only the two finished case studies, Yugen Infra and One Goa.
- New detail layout, built only from the live case-study copy. It has:
  - a hero with the client logo, the result, client, location and services;
  - a project overview with key facts;
  - the client's real ad films, with posters and playback;
  - numbered challenges;
  - step-by-step strategy;
  - the real-time campaign dashboard;
  - results and conclusion;
  - a link to the next case study.
- Left out from the live case-study pages:
  - stock line illustrations;
  - the One Goa page's broken placeholders ("[show-required]", a duplicated heading).
- The short URLs `/case-studies/yugen-goa/` and `/case-studies/one-goa/` now show the full case study. Their canonical still points to the live URL.

**Unresolved**
- `/case-studies/prominent-realty/` and `/hometrust-realty/` were never live pages, and they had no case-study content or visuals. They are no longer built. Send their material and they can return.
- The live figures disagree:
  - Yugen's card says 15k leads; its page says 16k+.
  - One Goa's card says 3.4k leads; its page says 9K+.

  Each place keeps its own published figure. Please confirm the correct numbers.

### 6. Careers
**Fixed**
- The 3+1 culture grid is now an even 4-column grid.
- "Open positions" and the application form are merged into one balanced section. It holds:
  - a clear "Current openings" note;
  - three plain steps on how to apply;
  - the form beside them.

**Verified:** No vacancies were invented. The source lists none.

### 7. Blog
**Fixed**
- All thumbnails use one ratio (19:10).
- Metadata is consistent everywhere: category · date · read time.
- Author usernames are shown as names ("prem" → "Prem"), and author links work.
- The featured image on an article is no longer cropped.
- Article typography is larger (19 px body). Bulleted lists now show bullets instead of the numbered "01 / 02" rows.

All article content is unchanged.

### 8. Creative studio
**Kept:** The dark hero and the video gallery.

**Verified**
- All 23 YouTube Shorts shown load in the embedded player:
  - AI Videos: 7
  - Social Media Videos: 8
  - Ad Videos: 8
- Categories match the live site's tabs.
- Every tile has its real thumbnail.
- One social video (XfgdunDbBzE) is blocked from embedding by YouTube, so it is not shown.

### 9. Enquire now (the form on every page)
**Fixed**
- More balanced panel, with a header and a phone link.
- Larger input text (18 px).
- Live validation per field:
  - each field is checked when you leave it, then as you type;
  - errors are shown in red with an icon, plus a summary count;
  - the message field has a 20-character minimum with a counter.
- On mobile, the phone field opens the phone keypad.

**Tested end to end** on a full (non-static) build:
1. An empty submit flagged all 7 fields.
2. A bad email was flagged as soon as the field was left, and the error cleared once fixed.
3. A valid submit returned reference `SA-MVT3FLWY`, and the full payload reached the configured webhook.

**Before launch:** The live server needs a delivery channel: either a Resend key with a sender address, or a webhook. Without one, the form shows "not connected yet" and asks visitors to email instead. In the static preview, sending is deliberately switched off.

### 10. Contact
**Fixed**
- The map no longer shows as an empty frame. A captured Google map of the actual listing (with Google attribution) shows first, with two buttons:
  - "Load interactive map" loads the live map;
  - "Directions in Google Maps" opens the listing.

**Verified details**
- Phones: +91 70171 69215, +91 92660 23436
- Careers: +91 97736 63033
- Email: scaleacres@gmail.com
- Address and hours as on the live page

**Unresolved:** Google's listing gives the address as "55, Lane 2, Westend Marg…". The website says "Plot No. 5, 2nd Floor…". Please confirm which is correct.

## Checked in a real browser (Chromium)

- **Layout:** 20 pages at desktop (1440), tablet (820) and mobile (390). None has horizontal overflow or script errors.
- **Images:** no broken local images. Images that load from scaleacres.com show as blocked only on our test machine.
- **Links:** all 165 internal links on those pages return 200.
- **Navigation:** the menu and footer links work, and Map goes to `/contact-us/#map`.
- **Video playback:** all 28 YouTube and 8 Vimeo videos used on these pages load in an embedded player.

## Still open / missing authentic assets

- **Visuals:** professional team headshots, plus visuals for the Prominent Realty and Hometrust Realty case studies.
- **Your confirmation needed:**
  - case-study figures (cards and pages disagree);
  - team size and years (About vs Our Services);
  - the studio address.
- **Images still on the live server:** a few images on location pages (and three very large decorative SVGs) are not yet bundled with the preview. They still load from scaleacres.com.
