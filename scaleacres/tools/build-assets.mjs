/**
 * ScaleAcres — branding mockup asset generator.
 *
 * Every visual on the homepage is an original, vector-drawn placeholder built
 * strictly from the ScaleAcres colour system (#012258 / #FFFFFF / #F5F4F3).
 * They stand in for real project artwork and photography; replace the files in
 * assets/img with genuine exports (WebP/AVIF for photography) before publishing.
 *
 * Run:  node tools/build-assets.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets/img');
mkdirSync(OUT, { recursive: true });

const NAVY = '#012258';
const WHITE = '#FFFFFF';
const OFF = '#F5F4F3';

/** navy at a given alpha, written as a solid-ish hex-free rgba for CSS-free SVG */
const n = (a = 1) => (a === 1 ? NAVY : `rgba(1,34,88,${a})`);

const svg = (w, h, body, { bg = OFF } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" fill="none">` +
  `<rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;

/** horizontal "text" bars — stands in for copy without inventing wording */
const bars = (x, y, widths, { h = 10, gap = 16, fill = n(0.16), r = 2 } = {}) =>
  widths
    .map((w, i) => `<rect x="${x}" y="${y + i * (h + gap)}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`)
    .join('');

/** The ScaleAcres project mark: a surveyed acre + an ascending roofline. */
const mark = (cx, cy, s, color = NAVY, sw = 2.2) => `
  <g transform="translate(${cx} ${cy}) scale(${s / 100})" stroke="${color}" stroke-width="${(sw * 100) / s}"
     stroke-linecap="square" stroke-linejoin="miter" fill="none">
    <circle cx="0" cy="0" r="46"/>
    <path d="M-30 22 L0 -24 L30 22"/>
    <path d="M-30 22 L30 22"/>
    <path d="M-16 22 L-16 2 M16 22 L16 2"/>
  </g>`;

/** an abstract architectural elevation — used where real project photography belongs */
const architecture = (x, y, w, h, seed = 0) => {
  const rnd = (i, m) => {
    const v = Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453;
    return Math.abs(v - Math.floor(v)) * m;
  };
  const id = `arch${seed}`;
  let g = `<g clip-path="url(#${id})">`;
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${n(0.04)}"/>`;

  // horizon datum
  const horizon = y + h * 0.86;
  let cx = x - w * 0.04;
  let i = 0;
  while (cx < x + w) {
    const mw = w * (0.1 + rnd(i, 0.14));
    const mh = h * (0.3 + rnd(i + 20, 0.5));
    const my = horizon - mh;
    const tone = 0.08 + ((i + seed) % 4) * 0.055;
    g += `<rect x="${cx}" y="${my}" width="${mw}" height="${mh}" fill="${n(tone)}"/>`;
    // setback crown
    if (rnd(i + 40, 1) > 0.45) {
      const sw2 = mw * (0.42 + rnd(i + 60, 0.3));
      g += `<rect x="${cx + (mw - sw2) / 2}" y="${my - h * 0.09}" width="${sw2}" height="${h * 0.09}" fill="${n(tone + 0.05)}"/>`;
    }
    // vertical mullions + floor datums
    const bays = Math.max(3, Math.round(mw / (w * 0.026)));
    for (let b = 1; b < bays; b++) {
      g += `<rect x="${cx + (mw / bays) * b}" y="${my}" width="1" height="${mh}" fill="${n(0.13)}"/>`;
    }
    const floors = Math.max(4, Math.round(mh / (h * 0.05)));
    for (let f = 1; f < floors; f++) {
      g += `<rect x="${cx}" y="${my + (mh / floors) * f}" width="${mw}" height="1" fill="${n(0.12)}"/>`;
    }
    g += `<rect x="${cx}" y="${my}" width="${mw}" height="2" fill="${n(tone + 0.12)}"/>`;
    cx += mw + w * 0.006;
    i++;
  }

  // ground plane + foreground datum
  g += `<rect x="${x}" y="${horizon}" width="${w}" height="${y + h - horizon}" fill="${n(0.09)}"/>`;
  g += `<rect x="${x}" y="${horizon}" width="${w}" height="2" fill="${n(0.22)}"/>`;
  g += `<rect x="${x}" y="${horizon + (y + h - horizon) * 0.5}" width="${w}" height="1" fill="${n(0.14)}"/>`;
  g += `</g><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>`;
  return g;
};

const frame = (x, y, w, h, { fill = WHITE, stroke = n(0.14), sw = 1.5, r = 0 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const files = {};

/* ---------------------------------------------------------------- 01 logo */
files['logo-presentation.svg'] = svg(
  900,
  1120,
  `${frame(60, 60, 780, 1000, { fill: WHITE })}
   ${mark(450, 470, 300)}
   <rect x="300" y="700" width="300" height="1.5" fill="${n(0.16)}"/>
   ${bars(300, 748, [300, 208, 152], { h: 12, gap: 20, fill: n(0.14) })}
   ${bars(300, 900, [96], { h: 8, fill: n(0.3) })}`
);

files['logo-construction.svg'] = svg(
  1000,
  1000,
  `${frame(0, 0, 1000, 1000, { fill: WHITE, stroke: 'none' })}
   <g stroke="${n(0.1)}" stroke-width="1">
     ${Array.from({ length: 11 }, (_, i) => `<path d="M${100 + i * 80} 100 L${100 + i * 80} 900"/>`).join('')}
     ${Array.from({ length: 11 }, (_, i) => `<path d="M100 ${100 + i * 80} L900 ${100 + i * 80}"/>`).join('')}
   </g>
   <g stroke="${n(0.22)}" stroke-width="1" stroke-dasharray="6 6">
     <circle cx="500" cy="500" r="320"/><circle cx="500" cy="500" r="200"/>
     <path d="M180 500 L820 500"/><path d="M500 180 L500 820"/>
   </g>
   ${mark(500, 500, 480, NAVY, 3)}
   <g fill="${n(0.4)}">
     <rect x="100" y="60" width="24" height="2"/><rect x="856" y="60" width="24" height="2"/>
   </g>`
);

/* ------------------------------------------------------------ 02 brochure */
files['brochure.svg'] = svg(
  1400,
  980,
  `<rect x="150" y="200" width="1100" height="600" fill="${n(0.07)}"/>
   ${frame(140, 170, 550, 620, { fill: NAVY, stroke: 'none' })}
   ${mark(415, 350, 150, WHITE, 2.4)}
   <g fill="rgba(255,255,255,0.28)">
     <rect x="270" y="500" width="290" height="12" rx="2"/>
     <rect x="270" y="532" width="200" height="12" rx="2"/>
   </g>
   <rect x="270" y="596" width="120" height="1.5" fill="rgba(255,255,255,0.4)"/>
   <rect x="270" y="640" width="72" height="8" rx="2" fill="rgba(255,255,255,0.55)"/>
   ${frame(690, 170, 570, 620, { fill: WHITE })}
   ${architecture(730, 210, 490, 260, 1)}
   ${bars(730, 512, [420, 468, 330], { h: 11, gap: 18 })}
   <rect x="730" y="640" width="490" height="1.5" fill="${n(0.1)}"/>
   <g fill="${n(0.28)}">
     <rect x="730" y="676" width="80" height="8" rx="2"/>
     <rect x="850" y="676" width="110" height="8" rx="2"/>
     <rect x="1000" y="676" width="66" height="8" rx="2"/>
   </g>`
);

/* ------------------------------------------------------------ 03 hoarding */
files['hoarding.svg'] = svg(
  1600,
  1140,
  `<rect x="0" y="880" width="1600" height="260" fill="${n(0.06)}"/>
   <rect x="0" y="880" width="1600" height="2" fill="${n(0.18)}"/>
   <rect x="360" y="560" width="26" height="320" fill="${n(0.3)}"/>
   <rect x="1214" y="560" width="26" height="320" fill="${n(0.3)}"/>
   ${frame(180, 140, 1240, 420, { fill: NAVY, stroke: 'none' })}
   <rect x="180" y="140" width="1240" height="420" stroke="${n(0.25)}" stroke-width="2"/>
   ${mark(360, 350, 190, WHITE, 2.6)}
   <g fill="rgba(255,255,255,0.86)">
     <rect x="540" y="246" width="620" height="26" rx="3"/>
     <rect x="540" y="294" width="470" height="26" rx="3"/>
   </g>
   <g fill="rgba(255,255,255,0.34)">
     <rect x="540" y="366" width="380" height="12" rx="2"/>
   </g>
   <rect x="540" y="422" width="168" height="44" fill="${WHITE}"/>
   <rect x="576" y="442" width="96" height="7" rx="2" fill="${NAVY}"/>
   <g stroke="${n(0.14)}" stroke-width="1.5">
     <path d="M120 880 L120 810"/><path d="M1480 880 L1480 810"/>
   </g>`
);

/* ------------------------------------------------------- 04 social campaign */
files['social-campaign.svg'] = svg(
  1000,
  1000,
  `${(() => {
    const tiles = [
      [40, 40, NAVY],
      [350, 40, WHITE],
      [660, 40, NAVY],
      [40, 350, WHITE],
      [350, 350, NAVY],
      [660, 350, WHITE],
      [40, 660, NAVY],
      [350, 660, WHITE],
      [660, 660, NAVY],
    ];
    return tiles
      .map(([x, y, bg], i) => {
        const fg = bg === NAVY ? 'rgba(255,255,255,' : 'rgba(1,34,88,';
        const inner =
          i % 3 === 0
            ? mark(x + 150, y + 130, 110, bg === NAVY ? WHITE : NAVY, 2.4)
            : i % 3 === 1
              ? architecture(x + 30, y + 30, 240, 160, i)
              : `<circle cx="${x + 150}" cy="${y + 130}" r="66" stroke="${fg}0.35)" stroke-width="2"/>
                 <path d="M${x + 132} ${y + 104} L${x + 182} ${y + 130} L${x + 132} ${y + 156} Z" fill="${fg}0.55)"/>`;
        return `${frame(x, y, 300, 300, { fill: bg, stroke: bg === NAVY ? 'none' : n(0.12) })}${inner}
          <g fill="${fg}${bg === NAVY ? '0.4' : '0.2'})">
            <rect x="${x + 30}" y="${y + 224}" width="180" height="10" rx="2"/>
            <rect x="${x + 30}" y="${y + 250}" width="112" height="10" rx="2"/>
          </g>`;
      })
      .join('');
  })()}`,
  { bg: OFF }
);

/* -------------------------------------------------------------- 05 website */
files['website.svg'] = svg(
  1600,
  1000,
  `${frame(60, 60, 1480, 880, { fill: WHITE })}
   <rect x="60" y="60" width="1480" height="56" fill="${OFF}"/>
   <rect x="60" y="116" width="1480" height="1.5" fill="${n(0.1)}"/>
   <g fill="${n(0.22)}"><circle cx="100" cy="88" r="6"/><circle cx="124" cy="88" r="6"/><circle cx="148" cy="88" r="6"/></g>
   <rect x="190" y="76" width="420" height="24" rx="12" fill="${n(0.07)}"/>
   ${mark(140, 180, 44)}
   <g fill="${n(0.2)}">
     <rect x="900" y="174" width="70" height="9" rx="2"/><rect x="1000" y="174" width="70" height="9" rx="2"/>
     <rect x="1100" y="174" width="70" height="9" rx="2"/>
   </g>
   <rect x="1220" y="160" width="130" height="38" fill="${NAVY}"/>
   ${bars(110, 268, [760, 900, 520], { h: 30, gap: 22, fill: n(0.82) })}
   ${bars(110, 428, [560, 470], { h: 11, gap: 16 })}
   <rect x="110" y="500" width="180" height="48" fill="${NAVY}"/>
   <rect x="310" y="500" width="180" height="48" stroke="${n(0.28)}" stroke-width="1.5"/>
   ${architecture(110, 600, 1380, 280, 3)}`
);

/* --------------------------------------------------------------- 06 mobile */
files['mobile-campaign.svg'] = svg(
  620,
  1180,
  `<rect x="70" y="50" width="480" height="1080" rx="56" fill="${NAVY}"/>
   <rect x="84" y="64" width="452" height="1052" rx="46" fill="${WHITE}"/>
   <rect x="248" y="86" width="124" height="20" rx="10" fill="${n(0.12)}"/>
   ${architecture(84, 130, 452, 420, 2)}
   <rect x="84" y="130" width="452" height="420" fill="${n(0.35)}"/>
   ${mark(310, 320, 150, WHITE, 2.4)}
   ${bars(128, 610, [364, 300, 232], { h: 18, gap: 18, fill: n(0.78) })}
   ${bars(128, 730, [330, 268], { h: 10, gap: 16 })}
   <rect x="128" y="812" width="364" height="56" fill="${NAVY}"/>
   <rect x="252" y="836" width="116" height="9" rx="2" fill="${WHITE}"/>
   <g>
     ${frame(128, 908, 172, 150, { fill: OFF, stroke: n(0.1) })}
     ${frame(320, 908, 172, 150, { fill: OFF, stroke: n(0.1) })}
     ${mark(214, 968, 60, NAVY, 2.6)}${mark(406, 968, 60, NAVY, 2.6)}
   </g>
   <rect x="256" y="1090" width="108" height="6" rx="3" fill="${n(0.2)}"/>`
);

/* ---------------------------------------------------- 07 brand guidelines */
files['brand-guidelines.svg'] = svg(
  1400,
  1000,
  `${frame(60, 60, 1280, 880, { fill: WHITE })}
   <rect x="60" y="60" width="1280" height="1.5" fill="${n(0.12)}"/>
   <g fill="${n(0.35)}"><rect x="110" y="118" width="128" height="8" rx="2"/><rect x="1210" y="118" width="30" height="8" rx="2"/></g>
   <rect x="110" y="170" width="1180" height="1.5" fill="${n(0.1)}"/>
   ${frame(110, 220, 520, 380, { fill: OFF, stroke: n(0.1) })}
   ${mark(370, 410, 220)}
   <g stroke="${n(0.25)}" stroke-width="1" stroke-dasharray="5 5">
     <rect x="230" y="290" width="280" height="240"/>
   </g>
   ${bars(690, 232, [420, 360], { h: 22, gap: 16, fill: n(0.7) })}
   ${bars(690, 322, [600, 560, 470], { h: 10, gap: 15 })}
   <g>
     <rect x="690" y="440" width="150" height="150" fill="${NAVY}"/>
     <rect x="860" y="440" width="150" height="150" fill="${OFF}" stroke="${n(0.12)}"/>
     <rect x="1030" y="440" width="150" height="150" fill="${WHITE}" stroke="${n(0.12)}"/>
     <g fill="${n(0.4)}">
       <rect x="690" y="608" width="90" height="7" rx="2"/><rect x="860" y="608" width="90" height="7" rx="2"/>
       <rect x="1030" y="608" width="90" height="7" rx="2"/>
     </g>
   </g>
   <rect x="110" y="660" width="1180" height="1.5" fill="${n(0.1)}"/>
   <text x="110" y="810" font-family="Georgia,serif" font-size="150" fill="${NAVY}" font-weight="400">Aa</text>
   ${bars(430, 700, [420, 500, 360, 460], { h: 12, gap: 22 })}
   ${bars(980, 700, [300, 240], { h: 12, gap: 22 })}`
);

/* --------------------------------------------------------------- 08 palette */
files['palette.svg'] = svg(
  1400,
  800,
  `${frame(0, 0, 1400, 800, { fill: WHITE, stroke: 'none' })}
   <rect x="80" y="80" width="380" height="560" fill="${NAVY}"/>
   <rect x="500" y="80" width="380" height="560" fill="${OFF}" stroke="${n(0.12)}"/>
   <rect x="920" y="80" width="380" height="560" fill="${WHITE}" stroke="${n(0.12)}"/>
   <g fill="${n(0.45)}" font-family="ui-monospace,monospace" font-size="20" letter-spacing="2">
     <text x="80" y="700">#012258</text><text x="500" y="700">#F5F4F3</text><text x="920" y="700">#FFFFFF</text>
   </g>
   <g fill="rgba(255,255,255,0.5)"><rect x="120" y="560" width="120" height="6" rx="2"/></g>`
);

/* ------------------------------------------------------------ 09 typography */
files['typography.svg'] = svg(
  1400,
  800,
  `${frame(0, 0, 1400, 800, { fill: OFF, stroke: 'none' })}
   <text x="80" y="440" font-family="Manrope,Inter,Helvetica,Arial,sans-serif" font-size="360" font-weight="700" fill="${NAVY}">Aa</text>
   <rect x="640" y="120" width="1.5" height="560" fill="${n(0.12)}"/>
   ${bars(700, 150, [560, 620, 470], { h: 26, gap: 22, fill: n(0.72) })}
   ${bars(700, 330, [600, 560, 620, 480], { h: 10, gap: 16 })}
   <g fill="${n(0.3)}" font-family="ui-monospace,monospace" font-size="18" letter-spacing="3">
     <text x="700" y="600">DISPLAY / TITLE / BODY / LABEL</text>
   </g>
   <rect x="80" y="520" width="480" height="1.5" fill="${n(0.14)}"/>
   ${bars(80, 560, [300, 380], { h: 9, gap: 14 })}`
);

/* -------------------------------------------------------------- 10 signage */
files['signage.svg'] = svg(
  1200,
  900,
  `<rect x="0" y="720" width="1200" height="180" fill="${n(0.06)}"/>
   <rect x="0" y="720" width="1200" height="2" fill="${n(0.16)}"/>
   <rect x="576" y="300" width="48" height="420" fill="${n(0.28)}"/>
   ${frame(180, 130, 840, 200, { fill: NAVY, stroke: 'none' })}
   ${mark(290, 230, 110, WHITE, 2.4)}
   <g fill="rgba(255,255,255,0.8)"><rect x="400" y="190" width="380" height="18" rx="2"/><rect x="400" y="228" width="260" height="18" rx="2"/></g>
   <path d="M880 216 L930 216 M912 200 L930 216 L912 232" stroke="${WHITE}" stroke-width="3" fill="none"/>
   ${frame(240, 380, 720, 90, { fill: WHITE, stroke: n(0.12) })}
   <g fill="${n(0.35)}"><rect x="290" y="418" width="220" height="14" rx="2"/></g>
   <path d="M840 425 L890 425 M872 409 L890 425 L872 441" stroke="${NAVY}" stroke-width="3" fill="none"/>
   ${frame(240, 500, 720, 90, { fill: OFF, stroke: n(0.12) })}
   <g fill="${n(0.3)}"><rect x="290" y="538" width="300" height="14" rx="2"/></g>
   <path d="M840 545 L890 545 M858 529 L840 545 L858 561" stroke="${NAVY}" stroke-width="3" fill="none"/>`
);

/* -------------------------------------------------------- 11 sales gallery */
files['sales-gallery.svg'] = svg(
  1600,
  1000,
  `${frame(0, 0, 1600, 1000, { fill: WHITE, stroke: 'none' })}
   <g stroke="${n(0.1)}" stroke-width="1.5">
     <path d="M0 120 L1600 120"/><path d="M0 200 L1600 200"/>
     <path d="M260 200 L260 760"/><path d="M1340 200 L1340 760"/>
   </g>
   <rect x="0" y="760" width="1600" height="240" fill="${n(0.05)}"/>
   <rect x="0" y="760" width="1600" height="2" fill="${n(0.14)}"/>
   ${frame(300, 250, 1000, 420, { fill: NAVY, stroke: 'none' })}
   ${mark(560, 460, 220, WHITE, 2.4)}
   <g fill="rgba(255,255,255,0.32)">
     <rect x="740" y="400" width="380" height="20" rx="2"/><rect x="740" y="436" width="290" height="20" rx="2"/>
     <rect x="740" y="500" width="200" height="10" rx="2"/>
   </g>
   ${frame(420, 760, 760, 140, { fill: WHITE, stroke: n(0.12) })}
   <rect x="420" y="760" width="760" height="6" fill="${NAVY}"/>
   <g fill="${n(0.16)}"><rect x="470" y="812" width="240" height="12" rx="2"/><rect x="470" y="844" width="160" height="12" rx="2"/></g>
   <g stroke="${n(0.2)}" stroke-width="1.5"><path d="M960 800 L1120 800 M960 840 L1080 840"/></g>`
);

/* ------------------------------------------------------- 12 architecture */
for (const [name, w, h, seed] of [
  ['architecture-wide.svg', 1600, 1000, 4],
  ['architecture-tall.svg', 900, 1200, 5],
]) {
  files[name] = svg(w, h, `${architecture(0, 0, w, h, seed)}
     <g stroke="${n(0.14)}" stroke-width="1.5">
       <path d="M0 ${h * 0.24} L${w} ${h * 0.24}"/><path d="M${w * 0.18} 0 L${w * 0.18} ${h}"/>
     </g>`);
}

/* ------------------------------------------------------- 13 campaign film */
for (let i = 1; i <= 4; i++) {
  files[`campaign-film-0${i}.svg`] = svg(
    1600,
    900,
    `${architecture(0, 0, 1600, 900, i + 6)}
     <rect width="1600" height="900" fill="${n(i % 2 ? 0.42 : 0.55)}"/>
     <rect x="0" y="0" width="1600" height="60" fill="${NAVY}"/>
     <rect x="0" y="840" width="1600" height="60" fill="${NAVY}"/>
     ${mark(800, 430, 220, WHITE, 2)}
     <g fill="rgba(255,255,255,0.5)">
       <rect x="640" y="600" width="320" height="10" rx="2"/><rect x="700" y="628" width="200" height="10" rx="2"/>
     </g>`
  );
}

/* ------------------------------------------------------ 14 channel partner */
files['channel-partner.svg'] = svg(
  1400,
  1000,
  `${frame(120, 140, 700, 760, { fill: NAVY, stroke: 'none' })}
   ${mark(470, 400, 180, WHITE, 2.4)}
   <g fill="rgba(255,255,255,0.3)"><rect x="200" y="600" width="380" height="14" rx="2"/><rect x="200" y="632" width="260" height="14" rx="2"/></g>
   ${frame(560, 300, 480, 340, { fill: WHITE, stroke: n(0.12) })}
   ${bars(610, 350, [300, 380, 240], { h: 12, gap: 18 })}
   <rect x="610" y="530" width="140" height="42" fill="${NAVY}"/>
   ${frame(700, 660, 560, 260, { fill: OFF, stroke: n(0.12) })}
   ${bars(750, 706, [340, 420, 280], { h: 11, gap: 16 })}
   ${mark(1180, 760, 70)}`
);

/* -------------------------------------------------------- 15 stationery */
files['stationery.svg'] = svg(
  1400,
  1000,
  `${frame(140, 180, 620, 800, { fill: WHITE })}
   ${mark(300, 320, 90)}
   ${bars(210, 460, [420, 480, 360, 440], { h: 10, gap: 18 })}
   <rect x="210" y="820" width="220" height="1.5" fill="${n(0.14)}"/>
   ${frame(700, 300, 520, 300, { fill: NAVY, stroke: 'none' })}
   ${mark(960, 430, 130, WHITE, 2.4)}
   ${frame(760, 640, 520, 300, { fill: WHITE, stroke: n(0.12) })}
   <g fill="${n(0.2)}"><rect x="820" y="760" width="220" height="12" rx="2"/><rect x="820" y="790" width="150" height="12" rx="2"/></g>
   ${mark(1180, 780, 70)}`
);

/* ---------------------------------------------- 16 editorial photo slots */
/* Four distinct compositions standing in for genuine ScaleAcres photography.
   Replace each with a compressed WebP/AVIF photograph before publishing.     */

/* Team collaboration — overhead view of a working table */
files['studio-01.svg'] = svg(
  1200,
  900,
  `<rect width="1200" height="900" fill="${n(0.05)}"/>
   <rect x="90" y="120" width="1020" height="660" fill="${n(0.1)}"/>
   <rect x="90" y="120" width="1020" height="660" stroke="${n(0.16)}" stroke-width="2"/>
   <g transform="rotate(-4 330 380)">${frame(210, 250, 240, 300, { fill: WHITE, stroke: n(0.14) })}
     ${mark(330, 340, 90)}${bars(250, 420, [160, 120, 96], { h: 8, gap: 14 })}</g>
   <g transform="rotate(3 640 330)">${frame(510, 210, 260, 200, { fill: NAVY, stroke: 'none' })}
     ${mark(640, 300, 96, WHITE, 2.4)}</g>
   <g transform="rotate(-2 900 380)">${frame(800, 240, 230, 290, { fill: OFF, stroke: n(0.14) })}
     ${bars(830, 290, [160, 130, 170, 110], { h: 9, gap: 18 })}</g>
   ${frame(300, 590, 380, 130, { fill: WHITE, stroke: n(0.14) })}
   <rect x="300" y="590" width="380" height="8" fill="${n(0.3)}"/>
   ${bars(336, 636, [240, 170], { h: 9, gap: 16 })}
   <g stroke="${n(0.2)}" stroke-width="2" fill="none">
     <circle cx="790" cy="640" r="34"/><circle cx="880" cy="672" r="26"/>
   </g>
   <rect x="960" y="600" width="120" height="150" fill="${n(0.14)}"/>`
);

/* Design development — a studio wall of pinned work */
files['studio-02.svg'] = svg(
  900,
  1200,
  `<rect width="900" height="1200" fill="${n(0.04)}"/>
   <rect x="0" y="0" width="900" height="900" fill="${n(0.07)}"/>
   ${(() => {
     let o = '';
     const cols = 3, rows = 3;
     for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
       const x = 90 + c * 250, y = 110 + r * 250;
       const dark = (r + c) % 3 === 0;
       o += frame(x, y, 200, 200, { fill: dark ? NAVY : WHITE, stroke: dark ? 'none' : n(0.14) });
       o += (r + c) % 2 === 0
         ? mark(x + 100, y + 88, 74, dark ? WHITE : NAVY, 2.6)
         : `<rect x="${x + 30}" y="${y + 40}" width="140" height="80" fill="${dark ? 'rgba(255,255,255,0.2)' : n(0.1)}"/>`;
       o += bars(x + 30, y + 142, [120, 84], { h: 7, gap: 12, fill: dark ? 'rgba(255,255,255,0.3)' : n(0.16) });
     }
     return o;
   })()}
   <rect x="0" y="900" width="900" height="4" fill="${n(0.2)}"/>
   <rect x="0" y="904" width="900" height="296" fill="${n(0.11)}"/>
   ${frame(120, 960, 300, 190, { fill: WHITE, stroke: n(0.14) })}
   ${bars(160, 1000, [200, 150, 180], { h: 9, gap: 16 })}
   ${frame(480, 1000, 300, 150, { fill: NAVY, stroke: 'none' })}
   ${mark(630, 1074, 90, WHITE, 2.4)}`
);

/* Client meeting — a room in perspective with a presentation wall */
files['studio-03.svg'] = svg(
  1200,
  900,
  `<rect width="1200" height="900" fill="${n(0.05)}"/>
   <g stroke="${n(0.12)}" stroke-width="1.5">
     <path d="M0 90 L1200 90"/><path d="M0 160 L1200 160"/>
     <path d="M180 160 L180 640"/><path d="M1020 160 L1020 640"/>
   </g>
   ${frame(300, 210, 600, 330, { fill: NAVY, stroke: 'none' })}
   ${mark(450, 375, 160, WHITE, 2.4)}
   <g fill="rgba(255,255,255,0.3)">
     <rect x="580" y="330" width="240" height="18" rx="2"/><rect x="580" y="362" width="170" height="18" rx="2"/>
     <rect x="580" y="416" width="120" height="9" rx="2"/>
   </g>
   <rect x="0" y="640" width="1200" height="260" fill="${n(0.09)}"/>
   <path d="M180 700 L1020 700 L1160 880 L40 880 Z" fill="${n(0.14)}"/>
   <path d="M180 700 L1020 700 L1160 880 L40 880 Z" stroke="${n(0.24)}" stroke-width="2" fill="none"/>
   ${frame(430, 736, 150, 100, { fill: WHITE, stroke: n(0.16) })}
   ${frame(640, 736, 150, 100, { fill: OFF, stroke: n(0.16) })}
   ${mark(505, 786, 54)}${mark(715, 786, 54)}
   <g fill="${n(0.2)}"><rect x="60" y="742" width="110" height="140"/><rect x="1030" y="742" width="110" height="140"/></g>`
);

/* Project-site visit — skyline behind a site rail */
files['studio-04.svg'] = svg(
  900,
  900,
  `${architecture(0, 0, 900, 900, 12)}
   <rect width="900" height="900" fill="${n(0.05)}"/>
   <g stroke="${n(0.3)}" stroke-width="6" stroke-linecap="square">
     <path d="M0 620 L900 590"/><path d="M0 720 L900 690"/>
   </g>
   <g stroke="${n(0.34)}" stroke-width="8">
     <path d="M140 900 L140 600"/><path d="M470 900 L470 590"/><path d="M800 900 L800 580"/>
   </g>
   ${frame(300, 250, 300, 230, { fill: WHITE, stroke: n(0.16) })}
   ${mark(450, 330, 110)}
   ${bars(340, 400, [200, 140], { h: 9, gap: 16 })}
   <rect x="0" y="860" width="900" height="40" fill="${n(0.16)}"/>`
);

/* -------------------------------------------------------- 17 client slots */
/* Neutral, unbranded logo slots — no invented company names or marks. */
for (let i = 1; i <= 10; i++) {
  const variants = [
    `<circle cx="90" cy="60" r="26" stroke="${NAVY}" stroke-width="2.5"/><rect x="132" y="46" width="118" height="12" rx="2" fill="${NAVY}"/><rect x="132" y="68" width="78" height="8" rx="2" fill="${n(0.45)}"/>`,
    `<path d="M64 86 L92 34 L120 86 Z" stroke="${NAVY}" stroke-width="2.5" fill="none"/><rect x="140" y="48" width="130" height="12" rx="2" fill="${NAVY}"/><rect x="140" y="70" width="86" height="8" rx="2" fill="${n(0.45)}"/>`,
    `<rect x="64" y="36" width="52" height="52" stroke="${NAVY}" stroke-width="2.5"/><path d="M64 62 L116 62 M90 36 L90 88" stroke="${NAVY}" stroke-width="2.5"/><rect x="136" y="52" width="124" height="14" rx="2" fill="${NAVY}"/>`,
    `<circle cx="88" cy="62" r="28" stroke="${NAVY}" stroke-width="2.5"/><circle cx="112" cy="62" r="28" stroke="${n(0.4)}" stroke-width="2.5"/><rect x="156" y="54" width="112" height="14" rx="2" fill="${NAVY}"/>`,
    `<path d="M66 88 L66 40 L106 40 L106 64 L66 64" stroke="${NAVY}" stroke-width="2.5" fill="none"/><rect x="128" y="46" width="140" height="12" rx="2" fill="${NAVY}"/><rect x="128" y="68" width="92" height="8" rx="2" fill="${n(0.45)}"/>`,
  ];
  files[`client-slot-${String(i).padStart(2, '0')}.svg`] = svg(
    320,
    124,
    variants[(i - 1) % variants.length],
    { bg: 'none' }
  );
}

/* ------------------------------------------------------------- 18 favicon */
files['favicon.svg'] = svg(64, 64, `<rect width="64" height="64" fill="${NAVY}"/>${mark(32, 33, 44, WHITE, 3.2)}`, { bg: NAVY });

let count = 0;
for (const [name, content] of Object.entries(files)) {
  writeFileSync(resolve(OUT, name), content + '\n');
  count++;
}
console.log(`wrote ${count} svg assets to assets/img`);
