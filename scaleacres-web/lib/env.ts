/**
 * Indexing is decided by hostname, not by an environment flag:
 *  - Requests to a production host are indexable (no noindex header, normal robots.txt).
 *  - Every other host (Netlify previews, *.netlify.app, localhost, staging domains)
 *    gets `X-Robots-Tag: noindex, nofollow` and a robots.txt that disallows everything.
 * A forgotten env var therefore cannot noindex production, and a new preview URL is
 * protected by default.
 */
export const PRODUCTION_HOSTS = (process.env.PRODUCTION_HOSTS ?? "scaleacres.com,www.scaleacres.com")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

export function isProductionHost(host: string | null | undefined) {
  if (!host) return false;
  return PRODUCTION_HOSTS.includes(host.split(":")[0].toLowerCase());
}
