import type { Metadata } from "next";
import { ServicePage, serviceMetadata } from "@/components/ServicePage";

/** Protected production URL /real-estate-branding-agency/ — served at the same path as on WordPress. */
export const metadata: Metadata = serviceMetadata("branding-creative-design");

export default function Page() {
  return <ServicePage slug="branding-creative-design" />;
}
