import type { Project } from "@/content/projects";

/**
 * Art-directed typographic cover used until a project's approved visuals are supplied.
 * It never imitates client artwork: it shows the project name, location and category,
 * plus a visible "visuals pending" label.
 */
export function ProjectCover({ project: p, size = "md" }: { project: Project; size?: "md" | "lg" }) {
  const tone = {
    ink: "bg-ink text-white",
    blue: "bg-blue text-on-accent",
    white: "bg-offwhite text-ink",
  }[p.tone];
  const rule = p.tone === "ink" ? "border-white/15" : "border-ink/15";
  const words = p.title.split(" ");
  // Size the name to the cover's own width so the longest word always fits.
  const longest = Math.max(...words.map((w) => w.length));
  const cap = size === "lg" ? 22 : 30; // cqw ceiling for short names
  const fontSize = `min(${cap}cqw, ${(92 / (longest * 0.66)).toFixed(2)}cqw)`;
  return (
    <div className={`@container relative flex h-full w-full flex-col justify-between overflow-hidden p-6 md:p-10 ${tone}`}>
      {/* Architectural grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "clamp(48px, 8vw, 120px) clamp(48px, 8vw, 120px)",
        }}
      />
      <div className={`relative flex items-start justify-between gap-4 border-b pb-4 ${rule}`}>
        <span className="label">{p.category}</span>
        {p.location ? <span className="label opacity-70">{p.location}</span> : null}
      </div>
      <p
        aria-hidden="true"
        className="relative font-black uppercase leading-[0.86] tracking-[-0.045em] transition-transform duration-[1200ms] ease-out-expo group-hover:-translate-y-2"
        style={{ fontSize }}
      >
        {words.map((w, i) => (
          <span key={i} className={`block ${i % 2 === 1 ? "outline-text" : ""}`}>{w}</span>
        ))}
      </p>
      <div className={`relative flex items-end justify-between gap-4 border-t pt-4 ${rule}`}>
        <span className="label opacity-70">{p.client}</span>
        <span className={`rounded-full border px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${rule}`}>Project visuals pending</span>
      </div>
    </div>
  );
}
