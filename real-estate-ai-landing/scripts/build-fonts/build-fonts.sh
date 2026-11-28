#!/usr/bin/env bash
# Rebuilds the two self-hosted Inter subsets (Latin + ₹ + typographic punctuation).
# Requires: pip install fonttools brotli ; npm i inter-ui@4 (source font, OFL licence).
set -euo pipefail
SRC=${1:-node_modules/inter-ui/variable/InterVariable.woff2}
OUT=${2:-public/assets/fonts}
U="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2009,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+20AC,U+20B9,U+2122,U+2190-2193,U+2212,U+2215,U+00B7"
FEAT="kern,liga,calt,ccmp,locl,mark,mkmk,tnum,cv11,ss01,case"
fonttools varLib.instancer "$SRC" wght=400:700 opsz=drop -o /tmp/inter-text.ttf
pyftsubset /tmp/inter-text.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file="$OUT/inter-text-v2.woff2"
fonttools varLib.instancer "$SRC" wght=500:600 opsz=32 -o /tmp/inter-display.ttf
pyftsubset /tmp/inter-display.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file="$OUT/inter-display-v2.woff2"
