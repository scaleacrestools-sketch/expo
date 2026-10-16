import type { NextConfig } from "next";
import { protectedPages } from "./content/seo/pages";

/**
 * SEO-preservation-first configuration.
 * - trailingSlash mirrors the WordPress URL convention (/about-us/), so no URL changes.
 * - No redirects: every production URL is served at the same path.
 * - Fallback rewrite: any path this app does not implement (blog posts, location pages,
 *   tag archives, uploads) is proxied from the WordPress origin and still returns 200.
 *   Set WORDPRESS_ORIGIN to an origin hostname that keeps serving the current site.
 * - Staging protection is host-based (proxy.ts + app/robots.ts), see lib/env.ts.
 */
const wpOrigin = process.env.WORDPRESS_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    if (!wpOrigin) return { beforeFiles: [], afterFiles: [], fallback: [] };
    return {
      // Protected pages not yet migrated are served unchanged from WordPress.
      beforeFiles: protectedPages
        .filter((p) => p.serveFrom === "wordpress")
        .map((p) => ({ source: p.path === "/" ? "/" : p.path.replace(/\/$/, "") + "/", destination: `${wpOrigin}${p.path}` })),
      afterFiles: [],
      fallback: [
        // Files (uploads, feeds with extensions) keep their exact path.
        { source: "/:file(.*\\.[A-Za-z0-9]{2,5})", destination: `${wpOrigin}/:file` },
        // Pages keep WordPress' trailing slash so WordPress never answers with a 301 back to us.
        { source: "/:path*", destination: `${wpOrigin}/:path*/` },
      ],
    };
  },
  async headers() {
    const base = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ];
    return [
      {
        source: "/:path*",
        headers: base,
      },
    ];
  },
};

export default nextConfig;
