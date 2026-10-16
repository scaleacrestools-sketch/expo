import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Compact editorial hero for inner pages. */
export function PageHero({ eyebrow, title, description, tone = "dark" }: { eyebrow: string; title: React.ReactNode; description?: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <Reveal as="section" className={`${tone === "dark" ? "bg-ink text-offwhite" : "bg-offwhite text-ink"} pb-[clamp(3rem,7vw,6rem)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]`}>
      <div className="container-x mx-auto max-w-[110rem]">
        <SectionHeading as="h1" tone={tone === "dark" ? "dark" : "light"} eyebrow={eyebrow} title={title} description={description} />
      </div>
    </Reveal>
  );
}
