import type { Metadata } from "next";
import { services } from "@/content/services";
import { serviceMetadata } from "@/components/ServicePage";
import { ServiceDetail } from "@/components/site/pages/Own";

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
  return <ServiceDetail slug={(await params).slug} />;
}
