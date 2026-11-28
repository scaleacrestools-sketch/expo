#!/usr/bin/env node
/**
 * Builds the synthetic sample-call audio for the Voice AI section.
 * Engines (both open source, installed locally, no network):
 *   English  -> Flite via FFmpeg's `flite` filter (voices: slt = AI agent, rms = buyer)
 *   Hinglish -> eSpeak NG Hindi voice (hi+f3 = AI agent, hi+m3 = buyer)
 * Output: public/assets/audio/<id>-<lang>.mp3 and src/data/audio-timings.json
 * Requires: ffmpeg (with libflite), ffprobe, espeak-ng.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const conversations = JSON.parse(readFileSync(join(root, 'src/data/voice-conversations.json'), 'utf8'));
const outDir = join(root, 'public/assets/audio');
mkdirSync(outDir, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'tts-'));
const GAP = 0.45;
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
const dur = (f) => parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

function synth(line, lang, file) {
  const raw = file.replace('.wav', '.raw.wav');
  if (lang === 'en') {
    const voice = line.speaker === 'ai' ? 'slt' : 'rms';
    const txt = join(tmp, 'line.txt');
    writeFileSync(txt, line.enTts);
    run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `flite=textfile=${txt}:voice=${voice}`, raw]);
  } else {
    const voice = line.speaker === 'ai' ? 'hi+f3' : 'hi+m3';
    run('espeak-ng', ['-v', voice, '-s', '150', '-p', line.speaker === 'ai' ? '58' : '40', '-w', raw, line.hiTts]);
  }
  // Normalise: 24 kHz mono, gentle EQ, consistent loudness.
  const pan = line.speaker === 'ai' ? '' : ',atempo=1.0';
  run('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-af', `highpass=f=90,lowpass=f=7600,loudnorm=I=-18:TP=-2:LRA=7${pan}`, '-ar', '24000', '-ac', '1', file]);
}

const timings = {};
for (const c of conversations) {
  for (const lang of ['en', 'hi']) {
    const parts = []; const segments = []; let t = 0.3;
    const lead = join(tmp, 'lead.wav');
    run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', '0.3', lead]);
    parts.push(lead);
    c.lines.forEach((line, i) => {
      const f = join(tmp, `${c.id}-${lang}-${i}.wav`);
      synth(line, lang, f);
      const d = dur(f);
      segments.push({ start: +t.toFixed(2), end: +(t + d).toFixed(2) });
      t += d;
      parts.push(f);
      const gap = join(tmp, `gap.wav`);
      run('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(GAP), gap]);
      parts.push(gap); t += GAP;
    });
    const list = join(tmp, 'list.txt');
    writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
    const wav = join(tmp, `${c.id}-${lang}.wav`);
    run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', wav]);
    const mp3 = join(outDir, `${c.id}-${lang}.mp3`);
    run('ffmpeg', ['-y', '-v', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '64k', mp3]);
    timings[`${c.id}-${lang}`] = { src: `/assets/audio/${c.id}-${lang}.mp3`, duration: +dur(mp3).toFixed(2), segments };
    console.log('built', `${c.id}-${lang}.mp3`, timings[`${c.id}-${lang}`].duration + 's');
  }
}
writeFileSync(join(root, 'src/data/audio-timings.json'), JSON.stringify(timings, null, 2));
rmSync(tmp, { recursive: true, force: true });
console.log('wrote src/data/audio-timings.json');
