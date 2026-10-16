import Link from "next/link";
import type { ComponentProps } from "react";
import { Arrow } from "./Arrow";

type Variant = "solid" | "outline" | "ghost" | "blue" | "offwhite";
type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

const base =
  "group/btn relative inline-flex items-center gap-3 rounded-full font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-300 ease-out-expo focus-visible:outline-blue motion-safe:active:scale-[0.98] select-none";
const sizes = { md: "px-6 py-3.5 text-[0.75rem]", lg: "px-8 py-5 text-[0.8125rem]" };
const variants: Record<Variant, string> = {
  solid: "bg-offwhite text-ink hover:bg-blue hover:text-on-accent",
  blue: "bg-blue text-on-accent hover:bg-offwhite hover:text-ink",
  offwhite: "bg-ink text-offwhite hover:bg-blue hover:text-on-accent",
  outline: "border border-current text-current hover:bg-current/0 hover:border-blue hover:text-blue",
  ghost: "px-0 py-0 rounded-none text-current hover:text-blue",
};

export function ArrowLink({ variant = "solid", size = "md", className = "", children, ...rest }: Props) {
  const isExternal = typeof rest.href === "string" && /^https?:\/\//.test(rest.href);
  return (
    <Link
      {...rest}
      className={`${base} ${variant === "ghost" ? "" : sizes[size]} ${variants[variant]} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <span className="relative inline-grid h-[1em] w-[1em] overflow-hidden">
        <Arrow className="col-start-1 row-start-1 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-[120%] group-hover/btn:-translate-y-[120%]" />
        <Arrow className="col-start-1 row-start-1 -translate-x-[120%] translate-y-[120%] transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
      </span>
    </Link>
  );
}
