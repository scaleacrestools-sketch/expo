import type { NextConfig } from 'next';

// Static export, deployed on Netlify. Images and video are referenced by
// same-origin /img/* and /vid/* paths that netlify.toml proxies to
// images.unsplash.com and videos.pexels.com; the dev-only rewrites below
// give `next dev` the same behavior.
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(process.env.NODE_ENV !== 'production'
    ? {
        async rewrites() {
          return [
            { source: '/img/:path*', destination: 'https://images.unsplash.com/:path*' },
            { source: '/vid/:path*', destination: 'https://videos.pexels.com/:path*' },
          ];
        },
      }
    : {}),
};

export default nextConfig;
