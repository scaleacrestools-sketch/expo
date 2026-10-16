/** Visible marker for development placeholder media. Remove once approved assets are in place. */
export function DevBadge({ label = "Dev placeholder — replace with approved asset" }: { label?: string }) {
  return <span className="dev-badge">{label}</span>;
}
