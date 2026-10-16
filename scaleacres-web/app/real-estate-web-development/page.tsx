import type { Metadata } from "next";
import { ServicePage, serviceMetadata } from "@/components/ServicePage";

/** Protected production URL /real-estate-web-development/ — served at the same path as on WordPress. */
export const metadata: Metadata = serviceMetadata("website-design-development");

export default function Page() {
  return <ServicePage slug="website-design-development" />;
}
