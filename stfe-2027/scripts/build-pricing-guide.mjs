// Generates public/downloads/STFE-2027-Stall-Pricing-Guide.pdf
// Content is restricted to confirmed brochure information only:
// stall configurations, area, price incl. GST, inclusions, dates, venue, organiser contact.
import PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'public/downloads/STFE-2027-Stall-Pricing-Guide.pdf');
mkdirSync(dirname(out), { recursive: true });

const F = (name) => resolve(root, `node_modules/@ibm/plex-sans/fonts/complete/woff/IBMPlexSans-${name}.woff`);
const logo = resolve(root, 'public/assets/brand/stfe-2027-logo.png');

const NAVY = '#1b2656', ORANGE = '#ec5d24', INK = '#1d2131', INK3 = '#626879', LINE = '#e4ddd2', IVORY = '#fbf7f1', TEAL = '#127c84'; // sampled from the approved logo

const doc = new PDFDocument({
  bufferPages: true,
  size: 'A4',
  margins: { top: 48, bottom: 40, left: 48, right: 48 },
  info: {
    Title: 'STFE 2027 — Stall Pricing & Inclusions Guide',
    Author: 'Smart Vision Event & Promotions',
    Subject: 'Smart Trade Fair & Expo 2027 — exhibition stall pricing (including GST)',
  },
});
doc.pipe(createWriteStream(out));
doc.registerFont('R', F('Regular'));
doc.registerFont('M', F('Medium'));
doc.registerFont('SB', F('SemiBold'));
doc.registerFont('B', F('Bold'));

// Complete IBM Plex Sans files carry the ₹ glyph, so money is plain text.
function money(text, x, y, font, size, color, opts = {}) {
  doc.font(font).fontSize(size).fillColor(color).text(text, x, y, { lineBreak: false, ...opts });
}

const W = doc.page.width, M = 48, CW = W - M * 2;

// Header band
doc.rect(0, 0, W, 6).fill(ORANGE);
let y = 40;
if (existsSync(logo)) {
  doc.image(logo, M, y - 8, { height: 64 });
} else {
  doc.font('B').fontSize(22).fillColor(NAVY).text('STFE 2027', M, y);
  doc.font('SB').fontSize(8).fillColor(INK3).text('SMART TRADE FAIR & EXPO', M, y + 28, { characterSpacing: 1.5 });
}
doc.font('SB').fontSize(8).fillColor(INK3).text('STALL PRICING & INCLUSIONS GUIDE', M, y + 4, { width: CW, align: 'right', characterSpacing: 1.2 });
doc.font('R').fontSize(9).fillColor(INK3).text('15–17 January 2027 · Soor Sadan Auditorium, Agra', M, y + 18, { width: CW, align: 'right' });

y = 112;
doc.moveTo(M, y).lineTo(W - M, y).lineWidth(0.75).strokeColor(LINE).stroke();

y += 18;
doc.font('SB').fontSize(21).fillColor(NAVY).text('Exhibition stalls at STFE 2027', M, y, { width: CW });
y = doc.y + 6;
doc.font('R').fontSize(10.5).fillColor(INK).text('Two stall configurations are available. Both are 9 square metres and both carry the same price. All prices shown include GST — GST is not added again.', M, y, { width: CW, lineGap: 2 });

// Rate line
y = doc.y + 12;
doc.rect(M, y, CW, 44).fill(IVORY);
doc.rect(M, y, 3, 44).fill(ORANGE);
money('₹7,670', M + 18, y + 11, 'B', 18, NAVY);
doc.font('M').fontSize(11).fillColor(INK3).text('per sq. metre', M + 100, y + 17);
doc.font('SB').fontSize(10).fillColor(TEAL).text('Including GST', M, y + 17, { width: CW - 18, align: 'right' });

// Options
y += 58;
const colW = (CW - 16) / 2;
[['OPTION A', '3 × 3 metres'], ['OPTION B', '2 × 4.5 metres']].forEach(([opt, size], i) => {
  const x = M + i * (colW + 16);
  doc.rect(x, y, colW, 146).lineWidth(0.75).strokeColor(LINE).stroke();
  doc.font('SB').fontSize(8).fillColor(ORANGE).text(opt, x + 18, y + 18, { characterSpacing: 1.4 });
  doc.font('SB').fontSize(18).fillColor(NAVY).text(size, x + 18, y + 34);
  doc.font('R').fontSize(10).fillColor(INK3).text('9 sq. metres · Octonorm stall', x + 18, y + 60);
  doc.moveTo(x + 18, y + 84).lineTo(x + colW - 18, y + 84).strokeColor(LINE).stroke();
  money('₹69,030', x + 18, y + 96, 'B', 22, NAVY);
  doc.font('SB').fontSize(9.5).fillColor(TEAL).text('Including GST', x + 18, y + 124);
  money('9 sq. m × ₹7,670 = ₹69,030', x + 110, y + 124.5, 'R', 8.5, INK3);
});

// Inclusions
y += 162;
doc.rect(M, y, CW, 128).fill(NAVY);
doc.font('SB').fontSize(8).fillColor(ORANGE).text('EVERY STALL INCLUDES', M + 20, y + 18, { characterSpacing: 1.4 });
const inc = ['Octonorm Stall', '1 Table and 2 Chairs', '2 Lights and Charging Point', 'Fascia Branding', 'Lunch and Tea Arranged', 'B2B and B2C Audience'];
inc.forEach((t, i) => {
  const cx = M + 20 + (i % 2) * (CW / 2);
  const cy = y + 42 + Math.floor(i / 2) * 26;
  doc.circle(cx + 4, cy + 6, 3).fill(ORANGE);
  doc.font('M').fontSize(11.5).fillColor('#ffffff').text(t, cx + 16, cy);
});

// Event details
y += 146;
doc.font('SB').fontSize(13).fillColor(NAVY).text('Event details', M, y);
y = doc.y + 8;
const rows = [
  ['Event', 'STFE 2027 — Smart Trade Fair & Expo'],
  ['Dates', '15–17 January 2027 (3 days)'],
  ['Venue', 'Soor Sadan Auditorium, Near Nagar Nigam Office, M.G. Road, Sanjay Place, Agra, Uttar Pradesh'],
  ['Organiser', 'Smart Vision Event & Promotions'],
  ['Phone / WhatsApp', '+91 96341 26260'],
  ['Email', 'svepindia@gmail.com'],
  ['Website', 'www.svepindia.com'],
];
rows.forEach(([k, v]) => {
  doc.moveTo(M, y).lineTo(W - M, y).lineWidth(0.5).strokeColor(LINE).stroke();
  doc.font('M').fontSize(9.5).fillColor(INK3).text(k, M, y + 7, { width: 120 });
  doc.font('R').fontSize(10).fillColor(INK).text(v, M + 130, y + 7, { width: CW - 130 });
  y = Math.max(doc.y, y + 18) + 5;
});

// Footer note
y += 10;
doc.font('R').fontSize(8.5).fillColor(INK3).text(
  'Stall availability and allocation are subject to organiser confirmation. An enquiry does not reserve a stall; a stall is confirmed only after written confirmation from the organiser. Information in this guide is taken from the official STFE 2027 exhibitor brochure.',
  M, y, { width: CW, lineGap: 1.5, height: doc.page.height - y - 20 },
);
if (doc.bufferedPageRange().count > 1) { console.error('[pricing-guide] overflowed onto a second page'); process.exitCode = 1; }
doc.rect(0, doc.page.height - 6, W, 6).fill(NAVY);
doc.end();
console.log('[pricing-guide] written', out);
