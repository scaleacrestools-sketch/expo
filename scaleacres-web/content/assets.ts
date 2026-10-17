/**
 * Homepage sections 05–09 media.
 *
 * Images are self-hosted in /public. The four testimonial MP4s are still streamed from the
 * Higgsfield CDN (same arrangement as the showreel in content/media.ts); move them into
 * /public/videos/testimonials/ before production.
 *
 *  - CONCEPT images are AI-generated (Higgsfield GPT Image 2.5, 17 Oct 2026). They illustrate a
 *    stage or a mood only and are always labelled "Concept visual" on the page. Never present
 *    them as client work.
 *  - Client logos and testimonial videos are taken unaltered (logos recoloured to one ink tone
 *    for the white grid) from scaleacres.com, where ScaleAcres already publishes them.
 */
const CDN = "https://d2ol7oe51mr4n9.cloudfront.net/user_3CQanTnpSTSldAcnyg2IWvXN786";

export type ConceptImage = { src: string; width: number; height: number; alt: string };

export const processImages: Record<"discover" | "strategize" | "create" | "launch" | "optimize", ConceptImage> = {
  discover: {
    src: "/images/process/discover-concept.webp",
    width: 896,
    height: 1120,
    alt: "Strategists reviewing site plans and market maps on a lit table",
    
  },
  strategize: {
    src: "/images/process/strategize-concept.webp",
    width: 896,
    height: 1120,
    alt: "Hands arranging white blocks into a rising staircase",
    
  },
  create: {
    src: "/images/process/create-concept.webp",
    width: 896,
    height: 1120,
    alt: "Cinematographer framing a shot with a cinema camera in blue light",
    
  },
  launch: {
    src: "/images/process/launch-concept.webp",
    width: 896,
    height: 1120,
    alt: "Residential tower lit in blue with searchlights at night",
    
  },
  optimize: {
    src: "/images/process/optimize-scale-concept.webp",
    width: 896,
    height: 1120,
    alt: "Five glass bars rising from left to right in blue light",
    
  },
};

export const contactBanner = {
  desktop: { src: "/images/contact/contact-cta-concept.webp", width: 2400, height: 1029 },
  /** Right-hand crop (the towers) for portrait screens. */
  mobile: { src: "/images/contact/contact-cta-concept-mobile.webp", width: 900, height: 682 },
  alt: "Residential towers beside still water at blue hour",
};

/**
 * Client logos as published in the "Loved and Trusted by" strip on scaleacres.com.
 * All twenty are packed into one transparent sprite (4 columns × 5 rows, 480 × 240 per cell,
 * logos optically sized to equal visual weight) and drawn with CSS masks so they can take
 * the brand's ink colour. `i` is the cell index in the sprite.
 */
export const clientSprite = { src: "/brand/clients/clients-sprite.webp", cols: 4, rows: 5 };

export type ClientLogo = { name: string; i: number; caseStudy?: string };

export const clientLogos: ClientLogo[] = [
  { name: "Adani Realty", i: 0 },
  { name: "Tata Realty", i: 16 },
  { name: "M3M", i: 8 },
  { name: "Signature Global", i: 14 },
  { name: "Elan", i: 5 },
  { name: "ATS", i: 1 },
  { name: "Bhutani Infra", i: 2 },
  { name: "Smartworld", i: 15 },
  { name: "Birla Navya", i: 3 },
  { name: "Hero Realty", i: 6 },
  { name: "Trehan Luxury Floors", i: 18 },
  { name: "The Islands by Gaurs", i: 17 },
  { name: "Yugen Infra", i: 19, caseStudy: "yugen-goa" },
  { name: "Hometrust", i: 7, caseStudy: "hometrust-realty" },
  { name: "RPS Rudrom", i: 11 },
  { name: "SeaBreeze Villas", i: 12 },
  { name: "Bric-X Infra", i: 4 },
  { name: "Raksha Towers", i: 10 },
  { name: "SHF Square", i: 13 },
  { name: "Mi Casa", i: 9 },
];

export type Testimonial = {
  id: string;
  /** Company shown on screen in the video. */
  company: string;
  /** Only when the person is named in the video itself. */
  person?: string;
  role?: string;
  /** As the client describes their business in the video. */
  sector?: string;
  duration: string;
  src: string;
  poster: string;
  /** Original hosting on the live site. */
  wistia: string;
};

/** The four client video testimonials published on scaleacres.com (Wistia). No quotes are paraphrased. */
export const testimonials: Testimonial[] = [
  {
    id: "lets-movin",
    company: "Let's Movin",
    person: "Sunita Bishnoi",
    sector: "Real estate consultancy",
    duration: "0:39",
    src: `${CDN}/3e7f6019-1327-4ce8-a727-aa54216ed82c.mp4`,
    poster: "/images/testimonials/sunita-bishnoi-lets-movin-poster.webp",
    wistia: "v3e25qemdd",
  },
  {
    id: "nrg-india",
    company: "NRG India",
    sector: "Real estate",
    duration: "0:45",
    src: `${CDN}/04cd09b1-2d65-4289-801f-2692c736c418.mp4`,
    poster: "/images/testimonials/nrg-india-poster.webp",
    wistia: "7lav103px4",
  },
  {
    id: "ipd",
    company: "IPD · International Property Deal",
    sector: "Luxury homes",
    duration: "0:40",
    src: `${CDN}/c629f1ba-80e4-4fab-a839-42561497c428.mp4`,
    poster: "/images/testimonials/ipd-poster.webp",
    wistia: "xb02i3dfjm",
  },
  {
    id: "timespro",
    company: "TimesPro",
    duration: "0:36",
    src: `${CDN}/8a75e150-4511-48be-984b-8e8cc766275b.mp4`,
    poster: "/images/testimonials/timespro-poster.webp",
    wistia: "8a27jjrd8h",
  },
];
