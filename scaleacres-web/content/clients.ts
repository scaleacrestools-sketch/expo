export type Client = {
  name: string;
  /** Path under /public. Real logo files must be added by the team; until then a
   *  monochrome wordmark is rendered and the item is flagged as a dev placeholder. */
  logo?: string;
  website?: string;
  /** Where the relationship is evidenced (case-study page, testimonial on scaleacres.com). */
  source: string;
};

/**
 * Only clients publicly named on scaleacres.com are listed. Do not add a client
 * here without their consent and a verified logo file in /public/brand/clients.
 */
export const clients: Client[] = [
  { name: "Yugen Infra", source: "scaleacres.com/case-studies/" },
  { name: "One Goa", source: "scaleacres.com/case-studies/" },
  { name: "Prominent Realty", source: "Client testimonial, scaleacres.com" },
  { name: "Hometrust Realty", source: "Client testimonial, scaleacres.com" },
];
