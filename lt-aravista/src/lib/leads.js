/*
 * Lead capture and ad-click tracking.
 * Ported unchanged from the existing production site: same /save.php
 * endpoint, same storage keys, same payload fields and same thank-you flow.
 */
import axios from 'axios';
import { ROUTES } from '../config/routes';

const SAVE_ENDPOINT = '/save.php';
const SESSION_KEY = 'lt-realty-tracking-params';
const LOCAL_KEY = 'lt-realty-tracking-params-local';
const CLICK_SENT_PREFIX = 'lt_realty_pabbly_click_sent:';

const TRACKING_FIELDS = [
  'source',
  'medium',
  'campaignid',
  'adgroupid',
  'keyword',
  'placement',
  'creative',
  'device',
  'ifsearch',
  'ifcontent',
  'gclid',
  'loc_interest_ms',
  'loc_physical_ms',
  'utm_term',
];

const EMPTY_TRACKING = {
  lpurl: '',
  ...Object.fromEntries(TRACKING_FIELDS.map((f) => [f, ''])),
};

function firstParam(params, ...keys) {
  for (const key of keys) {
    const value = params.get(key);
    if (value !== null && value !== '') return value.trim();
  }
  return '';
}

function resolveQuery(search, hash) {
  const q = search?.startsWith('?') ? search : search ? `?${search}` : '';
  if (q.length > 1) return q;
  if (!hash) return '';
  const idx = hash.indexOf('?');
  return idx === -1 ? '' : hash.slice(idx);
}

function parseTracking(search, hash = '') {
  if (typeof window === 'undefined') return { ...EMPTY_TRACKING };
  const query = resolveQuery(search, hash);
  const params = new URLSearchParams(query.startsWith('?') ? query : query || window.location.search);
  return {
    lpurl:
      query.length > 1
        ? `${window.location.origin}${window.location.pathname}${query}`
        : window.location.href,
    source: firstParam(params, 'source', 'utm_source'),
    medium: firstParam(params, 'medium', 'utm_medium'),
    campaignid: firstParam(params, 'campaignid', 'utm_campaign', 'utm_campaignid'),
    adgroupid: firstParam(params, 'adgroupid', 'utm_content', 'adgroup_id'),
    keyword: firstParam(params, 'keyword', 'utm_term'),
    placement: firstParam(params, 'placement'),
    creative: firstParam(params, 'creative'),
    device: firstParam(params, 'device'),
    ifsearch: firstParam(params, 'ifsearch'),
    ifcontent: firstParam(params, 'ifcontent'),
    gclid: firstParam(params, 'gclid'),
    loc_interest_ms: firstParam(params, 'loc_interest_ms'),
    loc_physical_ms: firstParam(params, 'loc_physical_ms'),
    utm_term: firstParam(params, 'utm_term', 'keyword'),
  };
}

function hasTrackingValues(data) {
  return TRACKING_FIELDS.some((f) => !!data[f]);
}

function readStored() {
  try {
    const v = sessionStorage.getItem(SESSION_KEY);
    if (v) return JSON.parse(v);
  } catch {
    /* storage unavailable */
  }
  try {
    const v = localStorage.getItem(LOCAL_KEY);
    if (v) return JSON.parse(v);
  } catch {
    /* storage unavailable */
  }
  return {};
}

function writeStored(data) {
  const json = JSON.stringify(data);
  try {
    sessionStorage.setItem(SESSION_KEY, json);
  } catch {
    /* storage unavailable */
  }
  try {
    localStorage.setItem(LOCAL_KEY, json);
  } catch {
    /* storage unavailable */
  }
}

/** Capture UTM / Google Ads parameters from the URL into storage. */
export function captureTrackingParams(
  search = typeof window !== 'undefined' ? window.location.search : '',
  hash = typeof window !== 'undefined' ? window.location.hash : '',
) {
  if (typeof window === 'undefined') return;
  const fromUrl = parseTracking(search, hash);
  const stored = { ...EMPTY_TRACKING, ...readStored() };
  const merged = { ...stored, ...fromUrl, lpurl: stored.lpurl || fromUrl.lpurl };
  if (hasTrackingValues(fromUrl) || !stored.lpurl) {
    merged.lpurl = stored.lpurl && !hasTrackingValues(fromUrl) ? stored.lpurl : fromUrl.lpurl;
  }
  writeStored(merged);
}

function getTracking() {
  if (typeof window === 'undefined') return { ...EMPTY_TRACKING };
  const stored = readStored();
  return Object.keys(stored).length > 0
    ? { ...EMPTY_TRACKING, ...stored }
    : parseTracking(window.location.search, window.location.hash);
}

function isAdTraffic(t) {
  return !!(t.gclid || t.campaignid || t.adgroupid || t.keyword || t.source || t.medium);
}

function trackingPayload(t) {
  const out = { lpurl: t.lpurl };
  for (const f of TRACKING_FIELDS) out[f] = t[f] ?? '';
  return out;
}

function nowInIndia(d = new Date()) {
  return {
    date: d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
    time: d.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

async function getIpAddress() {
  const timeout = 1200;
  const primary = axios
    .get('https://api.ipify.org?format=json', { timeout })
    .then((r) => r.data.ip?.trim() || '')
    .catch(() => '');
  const ip = await Promise.race([
    primary,
    new Promise((resolve) => window.setTimeout(() => resolve(''), timeout)),
  ]);
  if (ip) return ip;
  try {
    const { data } = await axios.get('https://api64.ipify.org?format=json', { timeout });
    return data.ip?.trim() || '';
  } catch {
    return '';
  }
}

function toFormBody(obj) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) p.append(k, v ?? '');
  return p.toString();
}

function parseResponse(data) {
  if (data && typeof data === 'object') return data;
  if (typeof data !== 'string' || !data.trim()) return { success: true };
  try {
    return JSON.parse(data);
  } catch {
    const m = data.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return { success: true };
      }
    }
    return { success: true };
  }
}

async function postToSave(payload) {
  const res = await axios.post(SAVE_ENDPOINT, toFormBody(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    timeout: 20000,
    responseType: 'text',
    validateStatus: () => true,
  });
  const body = parseResponse(res.data);
  if (res.status >= 400 || body.success === false) {
    throw Error(
      body.message ||
        (res.status === 404
          ? 'Form server not found. Upload save.php or run npm run dev.'
          : res.status >= 500
            ? 'Server error while saving. Check save.php on the host.'
            : 'Unable to save your enquiry. Please try again.'),
    );
  }
}

function leadPayload(tracking, d) {
  return {
    ...trackingPayload(tracking),
    name: d.name ?? '',
    email: d.email ?? '',
    phone: d.phone ?? '',
    message: d.message ?? '',
    date: d.date,
    time: d.time,
    formattedTime: `${d.date}, ${d.time}`,
    formSource: d.formSource,
    form_name: d.formSource,
    ip_address: d.ip_address,
    ip: d.ip_address,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: (typeof document !== 'undefined' && document.referrer) || '',
    event_type: 'lead',
    data_type: 'lead',
  };
}

function clickPayload(tracking, d) {
  const base = leadPayload(tracking, { ...d, message: '' });
  return {
    ...base,
    event_type: 'click',
    data_type: 'click',
    traffic_source: base.source,
    ad_campaign: base.campaignid,
    ad_group: base.adgroupid,
    search_keyword: base.keyword,
  };
}

function currentPathKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

/** Records one ad-click event per landing URL per session (unchanged behaviour). */
export async function sendClickTracking(extra = {}) {
  const tracking = getTracking();
  if (!isAdTraffic(tracking)) return;
  const key = `${CLICK_SENT_PREFIX}${currentPathKey()}`;
  try {
    if (sessionStorage.getItem(key) === '1') return;
  } catch {
    /* storage unavailable */
  }
  const { date, time } = nowInIndia();
  const payload = {
    ...clickPayload(tracking, {
      date,
      time,
      ip_address: await getIpAddress(),
      formSource: extra.formSource ?? 'Click Tracking',
    }),
    ...extra,
  };
  try {
    await postToSave(payload);
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable */
    }
  } catch (err) {
    console.error('save.php click tracking failed:', err);
  }
}

/** Submits an enquiry to /save.php. Throws on failure. */
export async function submitLead(form) {
  captureTrackingParams();
  const tracking = getTracking();
  const { date, time } = nowInIndia();
  const digits = form.phone.replace(/\D/g, '');
  const phone = digits.length === 10 ? `+91${digits}` : form.phone.trim();
  await postToSave(
    leadPayload(tracking, {
      date,
      time,
      ip_address: await getIpAddress(),
      formSource: form.form_name,
      name: form.name,
      email: form.email,
      phone,
      message: form.message?.trim() ?? '',
    }),
  );
}

export function goToThankYou() {
  window.location.replace(ROUTES.thankYou);
}
