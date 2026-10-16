# ScaleAcres® website (Next.js)

Premium homepage and supporting pages for ScaleAcres — Independent Creative, Digital & Growth Agency.

- **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 (design tokens in `app/globals.css`) · GSAP + ScrollTrigger (scoped, cleaned up, reduced-motion aware).
- **Content lives in `content/`** — services, clients, projects, studio videos, process, case studies, insights and verified company facts are typed data; sections render from them.
- **Design system:** Outfit (via `next/font`), Deep Charcoal `#11151A`, Warm Ivory `#F6F3EA`, Expressive Coral `#F15A3C`, Warm Stone `#CAC3B6`, Soft Grey `#9DA2A6`.

```bash
npm install
cp .env.example .env.local   # configure contact delivery
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Contact form
`app/api/contact/route.ts` validates with Zod, rate-limits, checks a honeypot + timing gate, and delivers via Resend (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`) and/or a JSON webhook (`CONTACT_WEBHOOK_URL`). It **only reports success after a channel accepts the message**; with nothing configured it returns 503 and tells the visitor to email directly.

## Before launch
- `docs/asset-checklist.md` — every dev placeholder and where the real asset is.
- `docs/seo-migration.md` — URL inventory, 301 map (`lib/redirects.ts`), preserved blog/location pages, launch checklist.
- Confirm Ecommerce and Custom Software service scope with the delivery team.
