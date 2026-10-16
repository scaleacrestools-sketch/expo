export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  challenge: string;
  scope: string[];
  solution: string;
  highlights: string[];
  /** Only populated when a verifiable source exists. Empty means "no numeric claims". */
  outcomes: string[];
  image: string;
  placeholder: boolean;
};

/**
 * Documented on scaleacres.com/case-studies/. Numeric outcomes are omitted until
 * source material (campaign reports) is attached to this record.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "yugen-goa",
    client: "Yugen Infra",
    industry: "Real Estate · Residential",
    challenge:
      "Yugen is a remote project in North Goa. Local footfall alone could not build the buyer pipeline the launch needed, so demand had to be created with buyers across India who had never visited the site.",
    scope: ["Campaign strategy", "Creative & ad production", "Meta & Google campaigns", "Lead qualification journey"],
    solution:
      "A digital-first launch that treated the project's remoteness as the story: location-led creatives, geo-expanded paid media and a lead journey designed for out-of-state buyers who research before they travel.",
    highlights: ["Location-first creative direction", "Nationwide audience expansion", "Consistent brand presence across platforms"],
    outcomes: [],
    image: "/images/projects/yugen-goa.svg",
    placeholder: true,
  },
];
