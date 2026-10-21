import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { assets, kindLabel, type AssetMeta } from '@/content/assets';

export interface ResolvedAsset extends AssetMeta {
  /** public URL if the file exists, otherwise null → placeholder renders */
  src: string | null;
  width?: number;
  height?: number;
  kindLabel: string;
}

const EXT = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'svg'];
const ROOT = path.join(process.cwd(), 'public', 'images', 'godrej-sora');

const cache = new Map<string, ResolvedAsset>();

function readDimensions(file: string): { width?: number; height?: number } {
  try {
    const sidecar = file.replace(/\.[a-z]+$/, '.json');
    if (fs.existsSync(sidecar)) {
      const j = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      return { width: j.width, height: j.height };
    }
  } catch {}
  return {};
}

export function resolveAsset(id: string): ResolvedAsset {
  const hit = cache.get(id);
  if (hit) return hit;
  const meta = assets[id];
  if (!meta) throw new Error(`Unknown asset id "${id}" — add it to content/assets.ts`);
  let src: string | null = null;
  let dims: { width?: number; height?: number } = {};
  for (const ext of EXT) {
    const file = path.join(ROOT, `${id}.${ext}`);
    if (fs.existsSync(file)) {
      src = `/images/godrej-sora/${id}.${ext}`;
      dims = readDimensions(file);
      break;
    }
  }
  const resolved: ResolvedAsset = { ...meta, src, ...dims, kindLabel: kindLabel[meta.kind] };
  cache.set(id, resolved);
  return resolved;
}

export const resolveAssets = (ids: string[]) => ids.map(resolveAsset);
