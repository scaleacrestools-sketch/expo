#!/usr/bin/env node
/**
 * Assembles the Voice AI sample calls from individual line recordings.
 *
 * Source clips: media-src/voice/<conversation>-<lang>-<line>.mp3
 *   Generated with ElevenLabs (model eleven_v4) under the account owner's licence:
 *   AI agent voice "Palak M – Clear & Active Customer Care", buyer voice "Neeraj – Warm & Friendly Hindi".
 *   Languages: en (Indian English), hinglish (code-mixed), hi (Hindi).
 *
 * Output:
 *   public/assets/audio/<conversation>-<lang>.mp3   (mono, 48 kbps, loudness-normalised)
 *   src/data/audio-timings.json                     (line start/end times + waveform peaks for the player)
 * Requires: ffmpeg, ffprobe.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const conversations = JSON.parse(readFileSync(join(root, 'src/data/voice-conversations.json'), 'utf8'));
const src = join(root, 'media-src/voice');
const outDir = join(root, 'public/assets/audio');
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'voice-'));
const RATE = 24000, LEAD = 0.25, GAP = 0.55, PEAKS = 96;
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
const dur = (f) => parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const silence = (f, s) => run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `anullsrc=r=${RATE}:cl=mono`, '-t', String(s), '-c:a', 'pcm_s16le', f]);

/** RMS peaks for the player waveform, normalised 0..1. */
function peaks(file, n) {
  const pcm = run('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', '8000', '-f', 's16le', '-']);
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const win = Math.floor(samples.length / n); const out = [];
  for (let i = 0; i < n; i++) { let s = 0; for (let j = i * win; j < (i + 1) * win; j++) s += samples[j] * samples[j]; out.push(Math.sqrt(s / win)); }
  const max = Math.max(...out) || 1;
  return out.map((v) => +(Math.pow(v / max, 0.7)).toFixed(3));
}

const timings = {};
for (const c of conversations) {
  for (const lang of ['en', 'hinglish', 'hi']) {
    const parts = []; const segments = []; let t = LEAD;
    const lead = join(tmp, 'lead.wav'); silence(lead, LEAD); parts.push(lead);
    const gap = join(tmp, 'gap.wav'); silence(gap, GAP);
    c.lines.forEach((line, i) => {
      const clip = join(src, `${c.id}-${lang}-${i}.mp3`);
      if (!existsSync(clip)) throw new Error(`Missing source clip ${clip}`);
      const wav = join(tmp, `${c.id}-${lang}-${i}.wav`);
      // Trim leading/trailing silence so the transcript highlight lines up with speech.
      run('ffmpeg', ['-y', '-v', 'error', '-i', clip, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse',
        '-ar', String(RATE), '-ac', '1', '-c:a', 'pcm_s16le', wav]);
      const d = dur(wav);
      segments.push({ start: +t.toFixed(2), end: +(t + d).toFixed(2) });
      t += d; parts.push(wav);
      if (i < c.lines.length - 1) { parts.push(gap); t += GAP; }
    });
    const tail = join(tmp, 'tail.wav'); silence(tail, 0.4); parts.push(tail);
    const list = join(tmp, 'list.txt');
    writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
    const joined = join(tmp, `${c.id}-${lang}.wav`);
    run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-af', 'loudnorm=I=-17:TP=-1.5:LRA=8', '-ar', String(RATE), joined]);
    const mp3 = join(outDir, `${c.id}-${lang}.mp3`);
    run('ffmpeg', ['-y', '-v', 'error', '-i', joined, '-codec:a', 'libmp3lame', '-b:a', '48k', '-ac', '1', mp3]);
    timings[`${c.id}-${lang}`] = { src: `/assets/audio/${c.id}-${lang}.mp3`, duration: +dur(mp3).toFixed(2), segments, peaks: peaks(joined, PEAKS) };
    console.log('built', `${c.id}-${lang}.mp3`, timings[`${c.id}-${lang}`].duration + 's');
  }
}
writeFileSync(join(root, 'src/data/audio-timings.json'), JSON.stringify(timings));
rmSync(tmp, { recursive: true, force: true });
console.log('wrote src/data/audio-timings.json');
