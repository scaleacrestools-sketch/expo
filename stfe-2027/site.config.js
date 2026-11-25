// STFE 2027 — site configuration
// These flags gate content that must only appear once the organiser has supplied / approved the real asset.
// They are read by the build check (scripts/postbuild-check.mjs) and by the page at runtime (src/main.js).
export const SITE = {
  // Set true only after the original approved brochure PDF is placed at public/downloads/STFE-2027-Brochure.pdf
  brochureAvailable: false,
  // Set true only after the ORIGINAL schematic plans are placed at
  // public/assets/floor-plans/ground-floor.png and public/assets/floor-plans/first-floor.png
  floorPlansAvailable: false,
  // Set true only after written confirmation of the authorised relationship with each government body/programme,
  // and the approved mark files are placed in public/assets/institutional/ (see README). Never set true to "look official".
  institutionalMarksApproved: false,
  // Approved partner logo files placed in public/assets/partners/<slug>.png. Partners without a file show as a wordmark.
  partnerLogosAvailable: false,
  // Organiser-owned photography placed in public/assets/photos/ (see README for the exact filenames and sizes).
  photographyAvailable: false,

  organiser: {
    name: 'Smart Vision Event & Promotions',
    phoneDisplay: '+91 96341 26260',
    phoneE164: '919634126260',
    email: 'svepindia@gmail.com',
    website: 'https://www.svepindia.com',
  },
  whatsappMessage:
    'Hello, I am interested in exhibiting at STFE 2027. Please share stall availability and participation details.',
  venueMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Soor+Sadan+Auditorium%2C+M.G.+Road%2C+Sanjay+Place%2C+Agra%2C+Uttar+Pradesh',
};
