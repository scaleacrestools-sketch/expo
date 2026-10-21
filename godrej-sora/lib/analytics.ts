'use client';
/** GA4 + Meta Pixel event helpers. No-ops when the IDs are not configured. */
declare global {
  interface Window { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', event, params);
    if (event === 'lead_submitted') window.fbq?.('track', 'Lead', params);
    else window.fbq?.('trackCustom', event, params);
  } catch {}
}

export interface Attribution {
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string;
  gclid?: string; fbclid?: string; referrer?: string; landing?: string;
}

const KEY = 'sora.attribution';
/** Capture UTM/click IDs on first landing and persist for the session so a late form submission keeps its origin. */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) return JSON.parse(stored);
    const p = new URLSearchParams(window.location.search);
    const a: Attribution = { referrer: document.referrer || undefined, landing: window.location.pathname + window.location.search };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const) {
      const v = p.get(k); if (v) a[k] = v;
    }
    sessionStorage.setItem(KEY, JSON.stringify(a));
    return a;
  } catch { return {}; }
}
