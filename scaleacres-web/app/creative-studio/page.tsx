import type { Metadata } from "next";
import { CreativeStudioPage } from "@/components/site/pages/Own";

export const metadata: Metadata = {
  title: "Creative Studio",
  description: "ScaleAcres Creative Studio: AI videos, social media videos and ad videos that turn ideas into visual stories.",
  alternates: { canonical: "/creative-studio/" },
};

export default function Page() {
  return <CreativeStudioPage />;
}
