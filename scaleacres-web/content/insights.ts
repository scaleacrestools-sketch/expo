export type Article = {
  title: string;
  href: string;
  category: string;
  excerpt: string;
  /** ISO month precision where only month/year is confirmed; full date when verified. */
  publishedOn: string;
  displayDate: string;
  image: string;
  placeholder: boolean;
};

/**
 * Real articles from scaleacres.com/blog/. Links point to the live blog, which is
 * preserved during migration. Dates are month-level as confirmed in search indexes;
 * replace with exact bylines when the WordPress export is imported.
 */
export const articles: Article[] = [
  {
    title: "Why Your Ad Budget Is Wasted If Your Website Loads Slow",
    href: "https://scaleacres.com/blog/why-your-ad-budget-is-wasted-if-your-website-loads-slow/",
    category: "Performance",
    excerpt:
      "When paid campaigns underperform, the ad is rarely the only problem. A slow landing page quietly drains budget before a single lead converts.",
    publishedOn: "2026-08",
    displayDate: "August 2026",
    image: "/images/insights/ad-budget-speed.svg",
    placeholder: true,
  },
  {
    title: "Custom vs Template Real Estate Websites",
    href: "https://scaleacres.com/blog/custom-vs-template-real-estate-websites/",
    category: "Web",
    excerpt:
      "Templates get you live fast, custom builds get you exactly what you need. A practical look at what each approach costs and when it pays off.",
    publishedOn: "2026-03",
    displayDate: "March 2026",
    image: "/images/insights/custom-vs-template.svg",
    placeholder: true,
  },
  {
    title: "How to Create High-Converting Real Estate Landing Pages?",
    href: "https://scaleacres.com/blog/how-to-create-high-converting-real-estate-landing-pages/",
    category: "Conversion",
    excerpt:
      "The landing page is where campaign budget becomes enquiries. What to include, what to remove and how to structure a page built to generate leads.",
    publishedOn: "2026-01",
    displayDate: "January 2026",
    image: "/images/insights/landing-pages.svg",
    placeholder: true,
  },
];

export const blogIndexHref = "https://scaleacres.com/blog/";
