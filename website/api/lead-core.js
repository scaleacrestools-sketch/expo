/* Lead handling core — shared by the Netlify function, the Vercel function and the local dev server.
 * Responsibilities: validation, sanitisation, honeypot + rate limiting, duplicate detection,
 * project/source mapping, consent logging, CRM forwarding via an adapter, and a reliable response.
 *
 * Configuration (environment variables — never put these in frontend code):
 *   CRM_WEBHOOK_URL     HTTPS endpoint that receives the mapped lead JSON (e.g. ScaleTrack CRM inbound webhook)
 *   CRM_API_KEY         Secret sent as "Authorization: Bearer <key>" to the webhook
 *   CRM_PROVIDER        Optional label (default "webhook"); "scaletrack" uses the same adapter with its field map
 *   LEAD_STORE_DIR      Local JSONL fallback store (dev server only; default ./leads)
 *   ALLOWED_ORIGINS     Comma-separated origins allowed to POST (default: same origin only)
 *   RATE_LIMIT_MAX      Submissions allowed per IP per 10 minutes (default 8)
 */
const crypto = require('crypto');

const PROJECTS = {
  'Naru & Nami': 'assetz-naru-and-nami',
  'Mizumi Reserve': 'assetz-mizumi-reserve',
  'Muse & Maison': 'assetz-muse-and-maison',
  'Trees & Tandem': 'assetz-trees-and-tandem',
  'Mizu & Ki': 'assetz-mizu-and-ki',
  'Not sure yet': 'unassigned',
};
const BROCHURES = { 'assetz-muse-and-maison': '/assets/downloads/assetz-muse-and-maison-e-brochure.pdf' };
const GUIDE_PATH = '/assets/downloads/bengaluru-premium-homebuyers-guide.pdf';
const TYPES = ['Enquiry', 'Brochure', 'Site Visit', 'Contact', 'NRI', 'Guide'];

// In-memory windows (per warm instance). For multi-instance production, back these with Redis/KV.
const hits = new Map();   // ip -> [timestamps]
const seen = new Map();   // dedupe key -> timestamp

const clean = (v, max = 200) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

function rateLimited(ip, now = Date.now(), max = 8) {
  const windowMs = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  return arr.length > max;
}

function validate(body) {
  const errors = {};
  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const cc = clean(body.countryCode, 8) || '+91';
  const digits = String(body.phone || '').replace(/\D/g, '');
  const type = TYPES.includes(body.type) ? body.type : 'Enquiry';
  const project = clean(body.project, 60);
  if (name.length < 2) errors.name = 'Name is required.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) errors.email = 'A valid email is required.';
  if (cc === '+91' ? !/^[6-9]\d{9}$/.test(digits.slice(-10)) || digits.length < 10 : digits.length < 6 || digits.length > 15) errors.phone = 'A valid mobile number is required.';
  if (project && !Object.prototype.hasOwnProperty.call(PROJECTS, project)) errors.project = 'Unknown project.';
  if (!project) errors.project = 'Project is required.';
  if (!(body.consent === 'on' || body.consent === true || body.consent === 'true')) errors.consent = 'Consent is required.';
  return {
    errors,
    lead: {
      name, email, phone: (cc === 'other' ? '' : cc) + (cc === '+91' ? digits.slice(-10) : digits), countryCode: cc,
      project: project || 'Not sure yet', projectSlug: PROJECTS[project] || 'unassigned',
      type, category: clean(body.category, 40) || type, purpose: clean(body.purpose, 30), preferredTime: clean(body.preferredTime, 40),
      message: clean(body.message, 1000),
      sourcePage: clean(body.sourcePage, 300),
      utm: { source: clean(body.utm_source, 80), medium: clean(body.utm_medium, 80), campaign: clean(body.utm_campaign, 120), content: clean(body.utm_content, 120), term: clean(body.utm_term, 120) },
      consent: { given: true, text: 'I agree to be contacted by Assetz about this enquiry and have read the Privacy Policy.', at: new Date().toISOString() },
      clientSubmittedAt: clean(body.submittedAt, 40),
    },
  };
}

// Map to a CRM payload. Adjust field names here to match ScaleTrack (or any other CRM) once its schema is confirmed.
function toCrm(lead, provider) {
  const base = {
    full_name: lead.name, mobile: lead.phone, email: lead.email,
    project_name: lead.project, project_code: lead.projectSlug,
    enquiry_category: lead.type, enquiry_subtype: lead.category, purpose: lead.purpose, preferred_time: lead.preferredTime, message: lead.message,
    lead_source: 'Website', source_page: lead.sourcePage,
    utm_source: lead.utm.source, utm_medium: lead.utm.medium, utm_campaign: lead.utm.campaign, utm_content: lead.utm.content, utm_term: lead.utm.term,
    consent: lead.consent.given, consent_text: lead.consent.text, consent_at: lead.consent.at,
    submitted_at: lead.receivedAt, lead_id: lead.id, duplicate_of: lead.duplicateOf || null,
  };
  if (provider === 'scaletrack') return { lead: base, source: 'assetz-website' };
  return base;
}

async function forward(lead, env) {
  if (!env.CRM_WEBHOOK_URL) return { delivered: false, reason: 'CRM_WEBHOOK_URL not configured' };
  const res = await fetch(env.CRM_WEBHOOK_URL, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json', 'Idempotency-Key': lead.id }, env.CRM_API_KEY ? { Authorization: `Bearer ${env.CRM_API_KEY}` } : {}),
    body: JSON.stringify(toCrm(lead, env.CRM_PROVIDER || 'webhook')),
    signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
  });
  if (!res.ok) throw new Error(`CRM responded ${res.status}`);
  return { delivered: true };
}

/** Handle one submission. Returns { status, body }. `store` is an optional async fn(lead) for persistence. */
async function handleLead({ body, ip = 'unknown', origin = '', host = '', env = process.env, store }) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (origin && allowed.length && !allowed.includes(origin)) return { status: 403, body: { ok: false, error: 'Origin not allowed.' } };
  if (origin && !allowed.length && host && !origin.endsWith('//' + host)) return { status: 403, body: { ok: false, error: 'Origin not allowed.' } };
  if (!body || typeof body !== 'object') return { status: 400, body: { ok: false, error: 'Invalid request.' } };
  if (body.website) return { status: 200, body: { ok: true, id: 'ignored' } }; // honeypot: pretend success, drop silently
  if (rateLimited(ip, Date.now(), parseInt(env.RATE_LIMIT_MAX || '8', 10))) return { status: 429, body: { ok: false, error: 'Too many submissions. Please try again in a few minutes.' } };

  const { errors, lead } = validate(body);
  if (Object.keys(errors).length) return { status: 422, body: { ok: false, error: 'Please check the highlighted fields.', fields: errors } };

  lead.id = 'L' + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');
  lead.receivedAt = new Date().toISOString();
  lead.ipHash = crypto.createHash('sha256').update(ip + (env.IP_SALT || 'assetz')).digest('hex').slice(0, 16);

  // Duplicate strategy: same phone + project + type within 24h is flagged (still accepted and forwarded with duplicate_of)
  const key = `${lead.phone}|${lead.projectSlug}|${lead.type}`;
  const prev = seen.get(key);
  if (prev && Date.now() - prev.t < 24 * 3600 * 1000) lead.duplicateOf = prev.id;
  seen.set(key, { t: Date.now(), id: lead.id });

  let crm = { delivered: false, reason: 'not attempted' };
  try { crm = await forward(lead, env); } catch (e) { crm = { delivered: false, reason: String(e.message || e) }; }
  lead.crm = crm;
  if (store) { try { await store(lead); } catch (e) { /* storage failure must not lose the lead silently */ console.error('lead store failed', e); } }
  console.log(JSON.stringify({ msg: 'lead', id: lead.id, type: lead.type, project: lead.projectSlug, crm, duplicateOf: lead.duplicateOf || null }));

  // If a CRM is configured but delivery failed and there is no persistent store, report failure so the visitor can retry.
  if (env.CRM_WEBHOOK_URL && !crm.delivered && !store) return { status: 502, body: { ok: false, error: 'We could not record your enquiry. Please try again or call us.' } };

  const out = { ok: true, id: lead.id };
  if (lead.type === 'Guide') out.download = GUIDE_PATH;
  if (lead.type === 'Brochure' && BROCHURES[lead.projectSlug]) out.download = BROCHURES[lead.projectSlug];
  return { status: 200, body: out };
}

module.exports = { handleLead, validate, toCrm, PROJECTS };
