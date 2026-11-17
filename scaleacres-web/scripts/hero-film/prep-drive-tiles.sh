#!/usr/bin/env bash
# Hero v8 tiles from the "Builders AI Videos" Drive folder. Each reel is cropped to the band between its
# logo bar and its captions (4:5 "pt" tiles; 16:9 films give square tiles), then made into a 9.68 s
# ping-pong loop like prep-ai-tiles.sh. "SkyByte Developers 1 min" is a logo reveal and is not used.
# Usage: SRC=<dir with the downloaded Drive mp4s> OUT=<seg dir> ./prep-drive-tiles.sh
set -euo pipefail
: "${SRC:?}" "${OUT:?}"; mkdir -p "$OUT"
while read -r n src st du kind crop; do
  [ -z "$n" ] || [ "${n:0:1}" = "#" ] && continue
  f=$(python3 -c "print(4.84/$du)"); if [ "$kind" = pt ]; then sc="scale=400:500"; else sc="scale=400:400"; fi
  ffmpeg -v error -y -ss "$st" -t "$du" -i "$SRC/$src.mp4" -filter_complex \
    "[0:v]$crop,setpts=$f*PTS,fps=25,trim=end_frame=121,$sc,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[o]" \
    -map "[o]" -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -g 5 -deadline good -cpu-used 4 "$OUT/$n.webm"
  echo "ok $n"
done <<'LIST'
# name           Drive file (downloaded as)  start dur shape crop
d-auriga-tower   auriga9-reel      9.3  2.7 pt crop=720:900:180:260
d-auriga-night   auriga9-reel      38.2 2.6 pt crop=720:900:180:260
d-dtc-garden     dtc-sojon-ai      2.8  2.8 pt crop=720:900:180:260
d-dtc-podium     dtc-sojon-ai      5.8  2.6 pt crop=720:900:180:260
d-dtc-metro      dtc-sojon-ai      8.6  3.0 pt crop=720:900:180:260
d-dtc-towers     dtc-sojon-ai      34.4 4.8 pt crop=720:900:180:260
d-kanvas-plots   kanvas-ad-reel    12.7 3.3 pt crop=720:900:180:320
d-pravya-drive   pravya-fd2        47.4 3.7 pt crop=720:900:180:260
d-sb-beach       seabreeze-reel    4.9  4.6 pt crop=720:900:180:260
d-sb-lagoon      seabreeze-reel    12.8 4.4 pt crop=720:900:180:260
d-sb-villas      seabreeze-reel    38.6 3.1 pt crop=720:900:180:260
d-sbai-plots     skybyte-ai-reel2  7.6  3.5 pt crop=720:900:180:300
d-sbai-villas    skybyte-ai-reel2  48.2 3.5 pt crop=720:900:180:300
d-sbr-holo       skybyte-reel1     3.2  2.6 pt crop=720:900:180:300
d-sbr-street     skybyte-reel1     12.1 3.8 pt crop=720:900:180:300
d-jbbr-wh-a      jbbr-ai-text      11.0 4.8 pt crop=720:900:180:300
d-jbbr-wh-b      jbbr-ai-text      30.0 4.0 pt crop=720:900:180:300
d-sbad-highway   skybyte-ad        15.8 3.5 sq crop=760:760:380:60
d-kry-plot       jbbr-krystal-ai   16.6 3.0 sq crop=800:800:560:80
d-kry-night      jbbr-krystal-ai   20.8 3.5 sq crop=800:800:560:80
LIST
