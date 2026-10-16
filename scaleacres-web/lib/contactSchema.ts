import { z } from "zod";
import { services } from "@/content/services";

export const serviceOptions = services.map((s) => ({ value: s.slug, label: s.title }));
const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid work email address.").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(24)
    .regex(/^[+\d][\d\s().-]{6,}$/, "Please enter a valid phone number."),
  company: z.string().trim().min(2, "Please enter your company name.").max(160),
  service: z.enum(serviceSlugs, { message: "Please choose the service you're interested in." }),
  message: z.string().trim().min(20, "Tell us a little more — at least 20 characters.").max(4000),
  consent: z.literal(true, { message: "Please agree so we can respond to your enquiry." }),
  // Spam protection: honeypot must be empty; form must be open ≥ 3s before submit.
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.coerce.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
