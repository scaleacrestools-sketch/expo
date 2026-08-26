/* ============================================================================
   ScaleAcres — homepage content configuration
   ----------------------------------------------------------------------------
   This file is the single place to swap placeholder content for verified,
   real ScaleAcres material.

   PLACEHOLDERS (must be replaced before publishing)
   -------------------------------------------------
   • Every entry below with `placeholder: true` carries bracketed copy such as
     "[Actual Client Name]". Nothing here invents a client, a company, a
     designation, a quotation, a result or a statistic — the brackets are
     deliberate empty slots.
   • `video` is null on every card. Add the real client-story file (an .mp4 or
     an embed URL) and the modal will play it. While null, the modal shows a
     neutral "video not yet connected" panel rather than fake media.
   • `poster` points at an original vector placeholder in assets/img. Replace
     with a compressed WebP/AVIF still exported from the real film.

   Card kinds
   ----------
   'story'  → a client testimonial video card (shows name / designation /
              company / project + "Watch Story")
   'work'   → a branding-work card (presentation, website, brochure, hoarding,
              social campaign, launch film). Carries a descriptive caption
              only — no client attribution.
   ========================================================================== */

window.SCALEACRES = {
  /* Rows behind the circular panel. Each row loops seamlessly. */
  stories: [
    /* ---------------------------------------------------------- top row */
    { row: 'top', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-01.svg', video: null },
    { row: 'top', kind: 'work', caption: 'Project identity presentation', poster: 'logo-presentation.svg' },
    { row: 'top', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-02.svg', video: null },
    { row: 'top', kind: 'work', caption: 'Project website preview', poster: 'website.svg' },
    { row: 'top', kind: 'work', caption: 'Launch hoarding', poster: 'hoarding.svg' },

    /* ------------------------------------------------------- middle row */
    { row: 'mid', kind: 'work', caption: 'Brochure and sales collateral', poster: 'brochure.svg' },
    { row: 'mid', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-03.svg', video: null },
    { row: 'mid', kind: 'work', caption: 'Social media campaign', poster: 'social-campaign.svg' },
    { row: 'mid', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-04.svg', video: null },
    { row: 'mid', kind: 'work', caption: 'Sales gallery branding', poster: 'sales-gallery.svg' },

    /* ------------------------------------------------------- bottom row */
    { row: 'bot', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-02.svg', video: null },
    { row: 'bot', kind: 'work', caption: 'Brand guidelines', poster: 'brand-guidelines.svg' },
    { row: 'bot', kind: 'work', caption: 'Directional signage', poster: 'signage.svg' },
    { row: 'bot', kind: 'story', placeholder: true,
      name: '[Actual Client Name]', role: '[Designation]', company: '[Company Name]',
      project: '[Project or Service]', poster: 'campaign-film-01.svg', video: null },
    { row: 'bot', kind: 'work', caption: 'Channel-partner material', poster: 'channel-partner.svg' },
  ],

  /* Copy used by the modal when a story has no video source connected yet. */
  videoPendingNote: 'Client story film not yet connected. Add the verified video source in assets/js/content.js.',
};
