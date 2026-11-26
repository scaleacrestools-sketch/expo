#!/usr/bin/env bash
# Builds, tests, records and packages the STFE 2027 deliverables.
# Usage: bash scripts/finalize.sh <output-dir>
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="$(realpath -m "${1:-../STFE-2027-DELIVERY/visual-optimised}")"
mkdir -p "$OUT" qa-output/shots

echo "== builds"
npm run build > "$OUT/BUILD-RESULT.txt" 2>&1 && tail -2 "$OUT/BUILD-RESULT.txt"
npm run build:preview 2>&1 | grep -E "postbuild|✗"

echo "== servers"
pkill -f qa-server.mjs || true; sleep 1
(QA_DIST=dist-preview PORT=4321 node scripts/qa-server.mjs > /dev/null 2>&1 &)
(QA_DIST=dist-preview QA_FAIL=1 PORT=4322 node scripts/qa-server.mjs > /dev/null 2>&1 &)
sleep 1

echo "== QA"
node scripts/qa.mjs | grep -E "FAIL|checks passed" || true
cp qa-output/qa-results.json "$OUT/QA-RESULTS.json"

echo "== screenshots"
node scripts/shots.cjs http://localhost:4321/ qa-output/shots "$OUT"

echo "== recordings"
rm -f qa-output/leads.jsonl
node scripts/record-walkthroughs.cjs qa-output/video | grep "→"
ffmpeg -y -loglevel error -i qa-output/video/desktop/*.webm -c:v libx264 -pix_fmt yuv420p -crf 21 -preset medium -movflags +faststart -r 30 "$OUT/STFE-2027-FINAL-DESKTOP-OPTIMISED.mp4"
ffmpeg -y -loglevel error -i qa-output/video/mobile/*.webm -c:v libx264 -pix_fmt yuv420p -crf 21 -preset medium -movflags +faststart -r 30 "$OUT/STFE-2027-FINAL-MOBILE-OPTIMISED.mp4"

echo "== contact sheet + comparison"
node scripts/make-contact-sheet.cjs "$OUT"
node scripts/make-comparison.cjs "$OUT" qa-output/shots

echo "== zip"
cp README.md ASSET-LICENCES.md QA-SUMMARY.md "$OUT/" 2>/dev/null || true
( cd .. && rm -f "$OUT/STFE-2027-VISUAL-OPTIMISED-SOURCE.zip" && zip -qr "$OUT/STFE-2027-VISUAL-OPTIMISED-SOURCE.zip" stfe-2027 \
    -x "stfe-2027/node_modules/*" "stfe-2027/qa-output/*" "stfe-2027/dist-preview/*" "stfe-2027/source-assets/reference/*" "stfe-2027/source-assets/extracted/*" "stfe-2027/source-assets/*.zip" "stfe-2027/source-assets/review/*" )
( cd "$OUT" && zip -q STFE-2027-VISUAL-OPTIMISED-SOURCE.zip QA-RESULTS.json BUILD-RESULT.txt STFE-2027-REFERENCE-COMPARISON.pdf )
ls -la "$OUT"
