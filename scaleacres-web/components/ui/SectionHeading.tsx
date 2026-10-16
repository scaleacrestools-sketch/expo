import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light" | "blue";
  className?: string;
  children?: ReactNode;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "dark", className = "", children, as = "h2" }: Props) {
  const Tag = as;
  const eyebrowTone = tone === "dark" ? "text-blue" : tone === "blue" ? "text-ink/80" : "text-blue-deep";
  const descTone = tone === "dark" ? "text-grey-soft" : tone === "blue" ? "text-ink/80" : "text-ink/70";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      <p className={`eyebrow ${eyebrowTone} ${align === "center" ? "justify-center" : ""}`} data-reveal>
        {eyebrow}
      </p>
      <Tag className={`${as === "h1" ? "h1" : "h2"} mt-6 text-balance`} data-split-reveal>
        {title}
      </Tag>
      {description ? (
        <p className={`lead mt-7 max-w-[42ch] ${descTone} ${align === "center" ? "mx-auto" : ""}`} data-reveal>
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
