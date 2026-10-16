#!/usr/bin/env bash
# Assemble the ScaleAcres hero showreel from the six Higgsfield clips and export web files.
#
# Usage:
#   scripts/build-showreel.sh <clips-dir>
#
# <clips-dir> must contain the downloaded clips named:
#   01-architecture-16x9.mp4 … 06-finale-16x9.mp4   (landscape)
#   01-architecture-9x16.mp4 … 06-finale-9x16.mp4   (portrait)
# Optional: logo.png (transparent, official artwork) is composited over the finale.
#
# Outputs (written to public/):
#   videos/showreel.mp4 / .webm                 1920×1080, muted, loop-friendly, ~4–6 MB
#   videos/showreel-portrait.mp4 / .webm        1080×1920
#   images/hero-poster.jpg / hero-poster-mobile.jpg
#   ../showreel-master-16x9.mp4 / -9x16.mp4     high-quality masters (not deployed)
set -euo pipefail
CLIPS="${1:?clips dir required}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_V="$ROOT/public/videos"; OUT_I="$ROOT/public/images"; mkdir -p "$OUT_V" "$OUT_I"
NAMES=(01-architecture 02-brand 03-web 04-performance 05-video 06-finale)
SEG=3.0     # seconds used from each clip → 6 × 3 s = 18 s master
XF=0.5      # crossfade between shots

build() {
  local ar="$1" w="$2" h="$3" master="$4"
  local inputs=() filter="" prev="" offset=0
  for i in "${!NAMES[@]}"; do
    inputs+=(-i "$CLIPS/${NAMES[$i]}-$ar.mp4")
    # Trim, scale/crop to exact frame, normalise fps, gentle black/blue grade
    filter+="[$i:v]trim=0:$SEG,setpts=PTS-STARTPTS,scale=$w:$h:force_original_aspect_ratio=increase,crop=$w:$h,fps=30,eq=contrast=1.06:saturation=0.92,colorbalance=bs=0.05:bm=0.03,format=yuv420p[v$i];"
  done
  prev="v0"
  for i in $(seq 1 $((${#NAMES[@]} - 1))); do
    offset=$(awk "BEGIN{print $i*($SEG-$XF)}")
    filter+="[$prev][v$i]xfade=transition=fade:duration=$XF:offset=$offset[x$i];"
    prev="x$i"
  done
  if [[ -f "$CLIPS/logo.png" ]]; then
    local start; start=$(awk "BEGIN{print 5*($SEG-$XF)+0.6}")
    filter+="[$((${#NAMES[@]}))]scale=iw*min($w*0.42/iw\,$h*0.2/ih):-1[logo];[$prev][logo]overlay=(W-w)/2:(H-h)/2:enable='gte(t,$start)':format=auto[final]"
    inputs+=(-loop 1 -i "$CLIPS/logo.png")
  else
    filter+="[$prev]null[final]"
  fi
  ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$filter" -map "[final]" -an \
    -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -movflags +faststart "$master"
  echo "master → $master"
}

build 16x9 1920 1080 "$ROOT/showreel-master-16x9.mp4"
build 9x16 1080 1920 "$ROOT/showreel-master-9x16.mp4"

web() {
  local src="$1" name="$2" w="$3" h="$4"
  ffmpeg -y -loglevel error -i "$src" -vf "scale=$w:$h" -an -c:v libx264 -preset slow -crf 27 -maxrate 3M -bufsize 6M -pix_fmt yuv420p -movflags +faststart "$OUT_V/$name.mp4"
  ffmpeg -y -loglevel error -i "$src" -vf "scale=$w:$h" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$OUT_V/$name.webm"
}
web "$ROOT/showreel-master-16x9.mp4" showreel 1920 1080
web "$ROOT/showreel-master-9x16.mp4" showreel-portrait 1080 1920

ffmpeg -y -loglevel error -ss 0.2 -i "$ROOT/showreel-master-16x9.mp4" -frames:v 1 -q:v 3 "$OUT_I/hero-poster.jpg"
ffmpeg -y -loglevel error -ss 0.2 -i "$ROOT/showreel-master-9x16.mp4" -frames:v 1 -q:v 3 "$OUT_I/hero-poster-mobile.jpg"
ls -lh "$OUT_V"/showreel* "$OUT_I"/hero-poster*
echo "Done. Set heroMedia.placeholder = false in app/page.tsx."
