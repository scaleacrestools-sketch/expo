/** Small "Artistic impression" caption kept visible on renders that get cropped by object-cover. */
export default function ArtisticLabel({ className = 'right-3 bottom-3', text = 'Artistic impression' }) {
  return (
    <span
      className={`pointer-events-none absolute z-[1] rounded-full bg-black/35 px-2.5 py-1 font-sans text-[10px] tracking-[0.16em] text-white/85 uppercase backdrop-blur-sm ${className}`}
    >
      {text}
    </span>
  );
}
