import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { LeadInput } from './lead-schema';

export interface LeadRecord extends Omit<LeadInput, 'website' | 'startedAt' | 'consent'> {
  id: string;
  phoneNormalised: string;
  createdAt: string;
  ip: string;
  userAgent: string;
  consent: { marketing: true; text: string; at: string };
  duplicateOf?: string;
}

/* ---- rate limiting (per IP, in-memory; swap for Redis/Upstash in multi-instance deployments) ---- */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string) {
  const limit = Number(process.env.LEAD_RATE_LIMIT_PER_10MIN || 5);
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (arr.length >= limit) return true;
  arr.push(now); hits.set(ip, arr);
  return false;
}

/* ---- duplicate detection (phone + magnet within window) ---- */
const recent = new Map<string, { id: string; at: number }>();
export function duplicateKey(phone: string, magnet: string) {
  return createHash('sha256').update(`${phone}:${magnet}`).digest('hex');
}
export function findDuplicate(key: string) {
  const windowMs = Number(process.env.LEAD_DUPLICATE_WINDOW_HOURS || 24) * 3_600_000;
  const r = recent.get(key);
  return r && Date.now() - r.at < windowMs ? r.id : undefined;
}
export function remember(key: string, id: string) { recent.set(key, { id, at: Date.now() }); }

/* ---- delivery targets ---- */
async function toWebhook(lead: LeadRecord) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(process.env.CRM_WEBHOOK_SECRET ? { 'x-webhook-secret': process.env.CRM_WEBHOOK_SECRET } : {}) },
    body: JSON.stringify({ project: 'godrej-sora', lead }),
  });
  if (!res.ok) throw new Error(`CRM webhook ${res.status}`);
  return true;
}

async function toSupabase(lead: LeadRecord) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  const table = process.env.SUPABASE_LEADS_TABLE || 'leads';
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: 'POST',
    headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json', prefer: 'return=minimal' },
    body: JSON.stringify({ id: lead.id, created_at: lead.createdAt, magnet: lead.magnet, source: lead.source, name: lead.name, phone: lead.phoneNormalised, email: lead.email || null, configuration: lead.configuration || null, budget: lead.budget || null, timeline: lead.timeline || null, visit_date: lead.visitDate || null, visit_slot: lead.visitSlot || null, message: lead.message || null, attribution: lead.attribution || {}, consent: lead.consent, duplicate_of: lead.duplicateOf || null, ip: lead.ip, user_agent: lead.userAgent }),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return true;
}

async function toEmail(lead: LeadRecord) {
  const to = process.env.LEAD_NOTIFY_EMAIL, key = process.env.RESEND_API_KEY;
  if (!to || !key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: 'Godrej Sora Leads <leads@notifications.local>', to: [to], subject: `New ${lead.magnet} lead — ${lead.name}`, text: JSON.stringify(lead, null, 2) }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return true;
}

function toFile(lead: LeadRecord) {
  const file = process.env.LEADS_FILE_PATH || path.join(process.cwd(), '.data', 'leads.ndjson');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(lead) + '\n');
  return true;
}

/** Deliver to every configured target; always keep a local copy when nothing external is configured. */
export async function deliver(lead: LeadRecord) {
  const results = await Promise.allSettled([toWebhook(lead), toSupabase(lead), toEmail(lead)]);
  const delivered = results.some((r) => r.status === 'fulfilled' && r.value === true);
  const errors = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map((r) => String(r.reason));
  if (!delivered || process.env.NODE_ENV !== 'production') {
    try { toFile(lead); } catch (e) { errors.push(String(e)); }
  }
  return { delivered: delivered || errors.length === 0, errors };
}
