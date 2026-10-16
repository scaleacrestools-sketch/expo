import type { Metadata } from "next";
import { services } from "@/content/services";
import { ServicePage, serviceMetadata } from "@/components/ServicePage";

type Params = { params: Promise<{ slug: string }> };
const newServices = services.filter((s) => !s.legacy);

export function generateStaticParams() {
  return newServices.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return serviceMetadata((await params).slug);
}

export default async function Page({ params }: Params) {
  return <ServicePage slug={(await params).slug} />;
}
