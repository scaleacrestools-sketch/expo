import type { Metadata } from "next";
import { ServicePage, serviceMetadata } from "@/components/ServicePage";

/** Protected production URL /real-estate-ppc-service/ — served at the same path as on WordPress. */
export const metadata: Metadata = serviceMetadata("performance-marketing");

export default function Page() {
  return <ServicePage slug="performance-marketing" />;
}
