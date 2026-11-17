#!/usr/bin/env bash
# Builds the hero v8 tiles: each clip becomes a 9.68 s ping-pong loop (4.84 s forward, then reversed),
# 400 px wide, VP9 with a keyframe every 5 frames so the renderer can seek exactly.
# Sources: ScaleAcres AI films (Higgsfield library, downloaded, no new generations) and the ScaleAcres
# property ad films (Vimeo). Ad-film shots are cropped clear of their caption and logo bars.
# Usage: SRC=<dir with ai/raw and yt/vm> OUT=<seg dir> ./prep-ai-tiles.sh
set -euo pipefail
: "${SRC:?}" "${OUT:?}"; mkdir -p "$OUT"
while read -r n src st du kind pre; do
  [ -z "$n" ] || [ "${n:0:1}" = "#" ] && continue
  f=$(python3 -c "print(4.84/$du)"); [ "$pre" = "-" ] && pre="null"
  if [ "$kind" = tall ]; then sc="scale=-2:712,crop=400:712"; else sc="scale='if(gt(iw,ih),-2,400)':'if(gt(iw,ih),400,-2)',crop=400:400"; fi
  ffmpeg -v error -y -ss "$st" -t "$du" -i "$SRC/$src" -filter_complex \
    "[0:v]$pre,setpts=$f*PTS,fps=25,trim=end_frame=121,$sc,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[o]" \
    -map "[o]" -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -g 5 -deadline good -cpu-used 4 "$OUT/$n.webm"
  echo "ok $n"
done <<'LIST'
# name           source (Higgsfield id or Vimeo id)   start dur  shape crop
kv-gate-a        ai/raw/0aa95b7f.mp4    0.4  4.84 tall -
kv-gate-b        ai/raw/a714bbf2.mp4    0.4  4.84 tall -
kv-aerial        ai/raw/2c7ffbe0.mp4    0.3  4.84 sq   -
kv-plots         ai/raw/7dc80bcb.mp4    0.5  4.84 sq   -
wh-aerial        ai/raw/40223ecc.mp4    0.0  4.0  tall -
wh-approach      ai/raw/abdc7983.mp4    0.0  4.84 tall -
wh-blueprint     ai/raw/7e8387a0.mp4    0.2  4.84 tall -
wh-night         ai/raw/8ea45a74.mp4    3.0  4.84 sq   -
wh-dock          ai/raw/51ed5122.mp4    2.0  4.84 sq   -
tech-data        ai/raw/82ccf80e.mp4    0.0  4.84 tall -
16f0b7b3         ai/raw/16f0b7b3.mp4    0.0  4.8  tall -
336116a6         ai/raw/336116a6.mp4    0.0  4.8  tall -
3e7af501         ai/raw/3e7af501.mp4    0.0  4.8  tall -
d3edb836         ai/raw/d3edb836.mp4    0.0  4.8  tall -
ad-lw-aerial     yt/vm/1096842100.mp4   51.5 4.8  sq   crop=640:640:220:150
ad-lw-villas     yt/vm/1096842100.mp4   22.0 3.0  sq   crop=640:640:220:150
ad-bh-aerial     yt/vm/1096842029.mp4   0.1  3.7  sq   crop=680:680:200:120
ad-bh-towers     yt/vm/1096842029.mp4   15.2 4.2  sq   crop=680:680:200:120
ad-du-metro      yt/vm/1096841538.mp4   36.4 2.8  sq   crop=680:680:300:120
ad-sg-towers     yt/vm/1096841460.mp4   0.1  3.8  sq   crop=660:660:320:140
LIST
