import type { NextConfig } from 'next';

// Static export. Images and the hero video are local files under public/
// (/img/*, /vid/*), fetched from the pinned source URLs in
// media-sources.json by scripts/fetch-media.mjs — run it once before
// `next dev` / `next build` (the Netlify build command does this).
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
