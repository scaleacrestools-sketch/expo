export function DemoTag({ label = 'Demo data', className = '' }: { label?: string; className?: string }) {
  return <span className={`demo-tag ${className}`} title="Illustrative sample data, not real product results">{label}</span>;
}
