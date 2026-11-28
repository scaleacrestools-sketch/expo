#!/usr/bin/env node
/**
 * Builds the walkthrough narration track and the scene timings that the video render uses.
 * Source clips: media-src/narration-v3/scene-<1..10>.mp3 (ElevenLabs eleven_v4, voice "Amit Gupta – Confident Sales Advisor").
 * Output: src/render/scene-timings.json, .cache/narration.wav, public/assets/videos/product-walkthrough-v3.vtt
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
  { title: 'Introduction', caption: 'Every property enquiry is a buyer waiting for an answer.' },
  { title: 'Incoming Enquiry', caption: 'Rohan Mehta enquires about Skyline Residences through a Meta Ads form.' },
  { title: 'AI Calling', caption: 'Within seconds, Aria, your AI voice agent, calls him back.' },
  { title: 'Buyer Conversation', caption: 'A natural conversation in English or Hindi about his requirements.' },
  { title: 'Lead Qualification', caption: 'Every answer becomes a structured CRM record. Score 86: a hot lead.' },
  { title: 'WhatsApp Follow-up', caption: 'The project brochure follows on WhatsApp, automatically.' },
  { title: 'Site Visit Booking', caption: 'Rohan picks Saturday at 11 AM and the confirmation goes out instantly.' },
  { title: 'CRM Handover', caption: 'The qualified buyer is handed to Kavya with the full conversation summary.' },
  { title: 'Performance Dashboard', caption: 'Every call, outcome and visit flows into one performance dashboard.' },
  { title: 'Book a Demo', caption: 'Book a demo to see it working on your own leads.' },
];
const TEMPO = 1.0, LEAD = 0.45, TAIL = 0.9, MIN = 6.5;

let t = 0; const timings = []; const parts = [];
scenes.forEach((s, i) => {
  const src = join(root, `media-src/narration-v3/scene-${i + 1}.mp3`);
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
writeFileSync(join(root, 'public/assets/videos/product-walkthrough-v3.vtt'),
  ['WEBVTT', '', ...timings.flatMap((s, i) => [`${i + 1}`, `${ts(s.start)} --> ${ts(s.start + s.len - 0.05)}`, s.caption, ''])].join('\n'));
console.log('total', total, 's;', timings.map((s) => s.len).join(' '));
