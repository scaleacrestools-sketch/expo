#!/usr/bin/env bash
# Assetz hero film — reproducible edit (the "project file" for this video).
# The edit was made with FFmpeg, not a timeline editor, so this script IS the editable source:
# change shot in-points/durations, the grade, crossfade length or encoding settings below and re-run.
# A cuts-only CMX3600 EDL of the same edit (edl/*.edl) can be imported into Premiere Pro, DaVinci Resolve or Avid.
#
# Requirements: ffmpeg + ffprobe (with libx264, libvpx-vp9, libwebp), python3.
# Usage:  bash build-hero.sh            (reads source-footage/, writes masters/ and web/)
set -euo pipefail
cd "$(dirname "$0")"
SRC_D=source-footage/homepagevideosecond.mp4          # 1920x1080 29.97p, Assetz homepage reel
SRC_M=source-footage/residentialandcommercial.mp4     # 1080x1350 29.97p, Assetz residential & commercial reel
mkdir -p work masters web
GRADE="eq=saturation=1.06:gamma=1.02:contrast=1.03,colorbalance=rs=0.02:bs=-0.02,vignette=PI/5,setsar=1"
XF=0.45   # crossfade between shots (seconds)

# ---- Shot lists: "in-point duration" (seconds) — see edit-decision-list.csv for descriptions ----
DESKTOP_SHOTS=("29.75 1.95" "36.25 1.95" "0.05 2.1" "2.2 2.15" "6.65 1.95" "8.65 2.15" "17.25 1.95" "38.25 1.95" "31.75 1.95" "33.75 2.4" "40.25 1.95" "42.25 1.95")
MOBILE_SHOTS=("0.05 2.05" "4.45 2.1" "6.65 1.9" "8.65 2.1" "18.3 1.9" "25.25 2.35" "27.75 1.9" "29.75 1.9" "38.25 1.9" "10.85 1.75" "44.3 2.2")

cut() { # $1 prefix, $2 source, $3 extra filter, rest: shots
  local p=$1 src=$2 vf=$3; shift 3; local i=0
  for seg in "$@"; do set -- $seg
    ffmpeg -y -loglevel error -ss "$1" -t "$2" -i "$src" -vf "fps=30,$vf,$GRADE" -an -c:v libx264 -crf 16 -preset fast "work/${p}$(printf %02d $i).mp4"
    i=$((i+1)); done
}
join() { # $1 prefix, $2 count, $3 output — chain of xfades + 0.5 s fade in/out for a seamless loop
python3 - "$1" "$2" "$3" "$XF" <<'PY'
import subprocess, sys
p, n, out, F = sys.argv[1], int(sys.argv[2]), sys.argv[3], float(sys.argv[4])
d = [float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'work/{p}{i:02d}.mp4']).decode()) for i in range(n)]
inputs = ' '.join(f'-i work/{p}{i:02d}.mp4' for i in range(n)); fc = ''; prev = '[0:v]'; off = 0
for i in range(1, n):
    off += d[i-1] - F; o = f'[x{i}]' if i < n-1 else '[pre]'
    fc += f'{prev}[{i}:v]xfade=transition=fade:duration={F}:offset={off:.3f}{o};'; prev = o
total = off + d[n-1]; fc += f'[pre]fade=t=in:st=0:d=0.5,fade=t=out:st={total-0.5:.3f}:d=0.5[v]'
subprocess.check_call(f'ffmpeg -y -loglevel error {inputs} -filter_complex "{fc}" -map "[v]" -an -c:v libx264 -crf 16 -preset fast {out}', shell=True)
print(out, round(total, 2), 's')
PY
}

cut d "$SRC_D" "scale=1920:1080" "${DESKTOP_SHOTS[@]}"
cut m "$SRC_M" "crop=759:1350:160:0,scale=1080:1920" "${MOBILE_SHOTS[@]}"   # 9:16 centre crop of the 4:5 reel
join d ${#DESKTOP_SHOTS[@]} masters/desktop-master.mp4
join m ${#MOBILE_SHOTS[@]} masters/mobile-master.mp4

# ---- Web encodes (what the website plays) ----
X264="-c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -preset slow -movflags +faststart -an"
ffmpeg -y -loglevel error -i masters/desktop-master.mp4 $X264 -crf 25 web/assetz-hero-desktop.mp4
ffmpeg -y -loglevel error -i masters/mobile-master.mp4  $X264 -crf 26 web/assetz-hero-mobile.mp4
ffmpeg -y -loglevel error -i masters/desktop-master.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an web/assetz-hero-desktop.webm
ffmpeg -y -loglevel error -i masters/mobile-master.mp4  -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 -an web/assetz-hero-mobile.webm
ffmpeg -y -loglevel error -ss 1.2 -i masters/desktop-master.mp4 -frames:v 1 -c:v libwebp -quality 82 web/assetz-hero-poster.webp
ffmpeg -y -loglevel error -ss 1.2 -i masters/mobile-master.mp4  -frames:v 1 -c:v libwebp -quality 82 web/assetz-hero-mobile-poster.webp
ls -la web
echo "Copy web/* to website/assets/video/ and run: node build.js"
