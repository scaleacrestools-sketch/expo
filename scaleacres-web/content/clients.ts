export type Client = {
  name: string;
  /** Expected logo file under /public. Shown only once the file exists (`logoReady: true`). */
  logo: string;
  logoReady: boolean;
  /** Case-study slug when a ScaleAcres case study exists for this client. */
  caseStudy?: string;
  /** Where the relationship is evidenced. */
  source: string;
};

/**
 * Only clients publicly named on scaleacres.com are listed. Do not add a client without
 * their consent. Upload each logo to the exact `logo` path, then set `logoReady: true`.
 */
export const clients: Client[] = [
  { name: "Yugen Infra", logo: "/brand/clients/yugen-infra.svg", logoReady: false, caseStudy: "yugen-goa", source: "scaleacres.com/case-studies/" },
  { name: "One Goa", logo: "/brand/clients/one-goa.svg", logoReady: false, caseStudy: "one-goa", source: "scaleacres.com/case-studies/" },
  { name: "Prominent Realty", logo: "/brand/clients/prominent-realty.svg", logoReady: false, caseStudy: "prominent-realty", source: "Client testimonial, scaleacres.com" },
  { name: "Hometrust Realty", logo: "/brand/clients/hometrust-realty.svg", logoReady: false, caseStudy: "hometrust-realty", source: "Client testimonial, scaleacres.com" },
];
