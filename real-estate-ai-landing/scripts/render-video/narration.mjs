#!/usr/bin/env node
/**
 * Builds the walkthrough narration track and the scene timings that the video render uses.
 * Source clips: media-src/narration/scene-<1..9>.mp3 (ElevenLabs eleven_v4, voice "Amit Gupta – Confident Sales Advisor").
 * Output: src/render/scene-timings.json, .cache/narration.wav, public/assets/videos/product-walkthrough.vtt
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = (a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a]);
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const cache = join(root, '.cache'); mkdirSync(cache, { recursive: true });

export const scenes = [
  { title: 'Incoming Lead', caption: 'A buyer enquires about Skyline Residences through a Meta Ads form.' },
  { title: 'AI Calling', caption: 'Within seconds, Aria, your AI voice agent, calls them back.' },
  { title: 'Buyer Conversation', caption: 'Aria asks about configuration, budget, location and timeline.' },
  { title: 'Lead Qualification', caption: 'Every answer becomes a structured CRM record with a lead score.' },
  { title: 'WhatsApp Follow-up', caption: 'The project brochure follows on WhatsApp, automatically.' },
  { title: 'Site Visit Booking', caption: 'Rohan picks an available site visit slot for Saturday.' },
  { title: 'Sales Team Handover', caption: 'The qualified buyer is handed over to your sales team.' },
  { title: 'Performance Dashboard', caption: 'And every outcome appears in your performance dashboard.' },
  { title: 'Book a Demo', caption: 'Book a demo to see it working on your own leads.' },
];
const TEMPO = 1.06, LEAD = 0.2, TAIL = 0.32, MIN = 3.2;

let t = 0; const timings = []; const parts = [];
scenes.forEach((s, i) => {
  const src = join(root, `media-src/narration/scene-${i + 1}.mp3`);
  const out = join(cache, `narr-${i + 1}.wav`);
  run(['-i', src, '-af', `silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=${TEMPO}`, '-ar', '48000', '-ac', '1', out]);
  const d = dur(out);
  const len = +Math.max(MIN, LEAD + d + TAIL).toFixed(2);
  timings.push({ ...s, start: +t.toFixed(2), len, speechStart: +(t + LEAD).toFixed(2), speechEnd: +(t + LEAD + d).toFixed(2) });
  parts.push({ file: out, at: t + LEAD });
  t += len;
});
const total = +t.toFixed(2);
// Mix narration clips at their scene offsets into one track.
const inputs = parts.flatMap((p) => ['-i', p.file]);
const filters = parts.map((p, i) => `[${i}]adelay=${Math.round(p.at * 1000)}|${Math.round(p.at * 1000)}[a${i}]`).join(';');
const mix = parts.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${parts.length}:normalize=0,loudnorm=I=-16:TP=-1.5,apad=whole_dur=${total}`;
run([...inputs, '-filter_complex', `${filters};${mix}`, '-t', String(total), '-ar', '48000', join(cache, 'narration.wav')]);
writeFileSync(join(root, 'src/render/scene-timings.json'), JSON.stringify({ total, scenes: timings }, null, 2));
const ts = (s) => { const m = Math.floor(s / 60); const sec = s - m * 60; return `00:${String(m).padStart(2, '0')}:${sec.toFixed(3).padStart(6, '0')}`; };
writeFileSync(join(root, 'public/assets/videos/product-walkthrough.vtt'),
  ['WEBVTT', '', ...timings.flatMap((s, i) => [`${i + 1}`, `${ts(s.start)} --> ${ts(s.start + s.len - 0.05)}`, s.caption, ''])].join('\n'));
console.log('total', total, 's;', timings.map((s) => s.len).join(' '));
