export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  /** Published wording only. */
  overview: string;
  approach: string;
  /** Published outcomes, quoted from the live case-study page. */
  outcomes: string[];
  source: string;
  /** True until the full live case study (challenge, scope, creative, figures) is exported. */
  pendingFullCopy: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "yugen-goa",
    client: "Yugen Infra",
    industry: "Real Estate · North Goa",
    overview: "Yugen is a remote project in North Goa.",
    approach: "ScaleAcres scaled the project through digital-first strategies.",
    outcomes: ["Lakhs in lead volume", "Nationwide reach", "Improved brand presence"],
    source: "scaleacres.com/case-studies/ (Yugen Goa and One Goa)",
    pendingFullCopy: true,
  },
];
