import type { Metadata } from "next";
import { InsightsPage } from "@/components/site/pages/Own";
import { latestPosts } from "@/components/site/pages/Blog";

export const metadata: Metadata = {
  title: "Insights",
  description: "Ideas, guides and opinions from the ScaleAcres team on branding, websites, SEO and performance marketing.",
  alternates: { canonical: "/insights/" },
};

export default function Page() {
  return <InsightsPage posts={latestPosts(6)} />;
}
