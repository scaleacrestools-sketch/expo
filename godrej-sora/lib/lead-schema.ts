import { z } from 'zod';
import { budgets, leadMagnets, timelines, visitSlots } from '@/content/leads';

/** Indian mobile: optional +91/91/0 prefix, then 10 digits starting 6–9. */
export const indianMobile = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;
export const normalisePhone = (v: string) => {
  const d = v.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d.startsWith('0') && d.length === 11 ? `91${d.slice(1)}` : d;
};

const optionalStr = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

export const leadSchema = z.object({
  magnet: z.enum(Object.keys(leadMagnets) as [keyof typeof leadMagnets, ...Array<keyof typeof leadMagnets>]),
  source: z.string().trim().max(80),
  name: z.string().trim().min(2, 'Please enter your full name').max(80),
  phone: z.string().trim().regex(indianMobile, 'Enter a valid 10-digit Indian mobile number'),
  email: z.union([z.string().trim().email('Enter a valid email').max(120), z.literal('')]).optional(),
  configuration: z.enum(['3 BHK', '4 BHK', 'Undecided']).optional().or(z.literal('')),
  budget: z.enum(budgets).optional().or(z.literal('')),
  timeline: z.enum(timelines).optional().or(z.literal('')),
  visitDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'), z.literal('')]).optional(),
  visitSlot: z.enum(visitSlots).optional().or(z.literal('')),
  message: optionalStr(1000),
  consent: z.literal(true, { error: 'Please confirm you are happy to be contacted' }),
  attribution: z.record(z.string(), z.string()).optional(),
  // anti-spam
  website: z.string().optional(), // honeypot – server silently drops when filled
  startedAt: z.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
