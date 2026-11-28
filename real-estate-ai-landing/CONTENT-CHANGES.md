# Content Changes — V3

V3 changes no approved copy. Headings, descriptions, feature names, FAQ, comparison rows, use cases and qualification questions are as approved. The changes below are visual, connect the story, or make claims more accurate.

## Content audit method
Every section was checked for four things:
1. Is the copy the approved text?
2. Is any illustrative number presented as a result?
3. Does every demo screen tell the same buyer story? That story is Rohan Mehta → Skyline Residences, Whitefield → 3 BHK, ₹2 Cr → score 86 → site visit Sat 15 Nov 11 AM → handed to Kavya Rao.
4. Is any integration or feature presented as live?

| # | Location | Before (V2) | After (V3) | Reason |
|---|---|---|---|---|
| V3-1 | Integrations, every card | A yellow "PLANNED" badge on each of 12 cards | One section-level disclosure: "All integrations shown are planned and illustrate intended compatibility; none are live in this preview. Brand names and logos belong to their owners; no partnership or endorsement is implied." Card aria-labels still end in "(planned)". | Brief §5: remove repetitive labels and keep one clear disclosure. The section still never implies a live integration. |
| V3-2 | Integrations, card copy | Long description paragraphs | One-line details, e.g. "Lead-form enquiries", "Portal enquiries", "Native pipeline sync" | Narrower, scannable cards, as in the HUVO reference. |
| V3-3 | Integrations, logos | Letter monograms | Simple Icons brand marks (CC0) for Meta, Google Ads, WhatsApp, HubSpot and Gmail. Neutral Lucide icons for 99acres, Housing.com, Magicbricks, Website Forms, Salesforce, Webhooks & API and ScaleTrack CRM. | No licensed SVG exists for those names, so no logo was drawn or imitated ("Do not invent a fake brand logo"). Salesforce was removed from Simple Icons at the owner's request, so it is not used. |
| V3-4 | Integrations, engine | Small centre mark | "[Product Name] AI engine", with a live caption naming the pair being traced (e.g. "99acres → HubSpot") and "Hover a tool to trace it" | Makes the data flow explicit. |
| V3-5 | Hero dashboard | "Activity" list | "Buyer profile" panel (Configuration, Budget, Purpose, Timeline, Intent score, Next step) that fills in during the call; owner shown as Kavya at the end | Brief §6 asks for buyer profile updates. Uses the shared story. |
| V3-6 | Hero chart | "▲ 846 total" | Changes to "▲ 847 total · +1 now" when the dashboard updates | The chart update is now visible. 846 matches the Performance section. |
| V3-7 | Hero, mobile | Squeezed desktop CRM plus three story cards | One lead card for Rohan that moves through the same 9 stages, with a buyer profile that fills in and a 01–09 progress bar | Mobile-specific composition; same story and numbers. |
| V3-8 | Features, Instant AI Calling visual | "Neha Gupta · Google Ads · 2 BHK" | "Rohan Mehta · Meta Ads · 3 BHK · ₹2 Cr" | Keeps one connected story across sections. |
| V3-9 | Funnel toggle (mobile only) | "AI-assisted workflow" / "Manual workflow" | "AI-assisted" / "Manual" | Prevents two-line wrapping at 390 px. Desktop labels unchanged. |
| V3-10 | Comparison (mobile only) | 3-column scrolling table | "vs Manual Sales Team" / "vs Basic IVR" toggle; each row compares our planned platform with one alternative | Same rows and values; no clipping. Desktop table unchanged. |
| V3-11 | Omnichannel (mobile only) | 2-column chip grid | Vertical timeline of the 7 approved steps; each step shows its channel and, when active, the same detail text as desktop | Mobile-specific flow. |
| V3-12 | Walkthrough modal | "34-second walkthrough with captions" | "78-second walkthrough with captions" | New 10-scene video. |
| V3-13 | Walkthrough video | 9 scenes, 34 s | 10 scenes, 78 s: Introduction, Incoming Enquiry, AI Calling, Buyer Conversation, Lead Qualification, WhatsApp Follow-up, Site Visit Booking, CRM Handover, Performance Dashboard, Book a Demo. New narration (ElevenLabs, licensed stock voice). The handover scene adds an "AI conversation summary". | Brief §11. Every scene uses the shared story; "Demo · sample data" is shown throughout. |

## Walkthrough narration (V3, exact text)
1. Every property enquiry is a buyer waiting for an answer. Here is how one lead becomes a booked site visit, automatically.
2. Rohan Mehta fills in a Meta Ads form for Skyline Residences. He is looking for a three BHK, at around two crore.
3. Within seconds, Aria, your AI voice agent, calls him back, inside your permitted calling hours.
4. Aria holds a natural conversation, in English or Hindi, asking about configuration, location, budget and timeline.
5. Every answer is written to the CRM as a structured record, and Rohan is scored eighty-six. A hot lead.
6. The project brochure follows on WhatsApp, so the conversation keeps moving without anyone lifting a finger.
7. Rohan picks Saturday at eleven for a site visit, and the confirmation goes out instantly.
8. The qualified buyer is handed over to Kavya, your senior sales executive, with the full conversation summary.
9. And every call, outcome and site visit flows into one performance dashboard, so you always know what is working.
10. Bring AI calling, qualification and site visit booking to your sales team. Book a demo today.

---

# Content Changes — V2

All approved headings, descriptions, feature names, FAQ questions and answers, comparison rows, use cases and qualification questions are unchanged. The table lists every meaningful text change, why it was made, and where.

| # | Location | Original (V1) | Revised (V2) | Reason |
|---|---|---|---|---|
| 1 | Hero CTAs | Book a Demo · Hear a Sample Call | Book a Demo · **Watch Product Demo** · Hear a Sample Call | Requested in the V2 brief (§6). "Hear a Sample Call" kept as the supporting voice CTA. |
| 2 | Hero, under dashboard | "Watch the 30-second product walkthrough" (pill) | Removed; replaced by the Watch Product Demo button and a live step caption (e.g. "05 · Qualification complete · score 86") | The video entry point moved up to the primary CTA row; the caption explains the 9-step animation. |
| 3 | Performance chart "Lead outcome distribution" | Qualified 34% · Callback 22% · Not interested 18% · No answer 26% | Qualified 34% · Callback 18% · Not interested 16% · **No answer 32%** | Accuracy: the same dashboard shows a 68% connect rate, so calls not answered must be 32%. Qualified 34% = 846 / 2,480 calls. |
| 4 | Performance table title | Campaign performance | **Top campaigns this week** | The three campaigns total 750 leads, a subset of 2,480 calls. The old title implied the table was the whole account. |
| 5 | Performance footnote | All figures shown are sample demonstration data, not product results. | …adds: "Outcome shares are of all 2,480 calls; the 68% connect rate equals qualified + callback + not interested." | Makes the numbers self-explanatory and consistent. |
| 6 | Performance header | All campaigns · sample workspace | Live feed, e.g. "Live · Rohan M. qualified · score 86 · Skyline Residences" | Brief §12 asks for live demonstration status updates. Uses the shared demo story. |
| 7 | Voice AI language selector | English · Hindi / Hinglish | English · Hinglish · हिन्दी | Brief §14 asks for Hindi, English and Hinglish. Hinglish shown in Roman script, Hindi in Devanagari. |
| 8 | Voice AI transcripts (Hindi) | (Hindi option showed Hinglish text) | New natural Hindi translations of each approved line, e.g. "आप कितने बेडरूम वाला घर देख रहे हैं?" | Needed for the new Hindi option. English lines are unchanged. |
| 9 | Voice AI result | (none) | Per-call qualification result: "In progress · 2 of 10 answers", "Visit requested · Hot lead", "Re-engaged · Warm lead", "Contacted · Pricing requested" | Brief §14 requires a qualification result alongside the call outcome. Approved outcomes unchanged. |
| 10 | Voice AI disclaimer | Simulated conversation with synthetic open-source TTS voices (Flite / eSpeak NG). Not a real customer call. | Simulated conversation voiced with licensed ElevenLabs text-to-speech voices. Not a real customer call. | Audio source changed. |
| 11 | Voice AI speaker label | AI agent speaking / Buyer speaking | Aria (AI agent) speaking / Rohan (buyer) speaking | Speaker identification (brief §14), consistent demo names. |
| 12 | Qualification demo answers | Six exchanges covering two questions each | Ten exchanges, one per approved question, with the buyer's answer and the CRM field it fills | Brief §18 sequence: question → answer → CRM field → progress → score. |
| 13 | Qualification profile | Six fields | The six approved fields plus Location, Property status, Other visits, Decision-makers, Broker | Each of the ten approved questions now has a visible CRM field. The approved six keep visual priority. |
| 14 | Qualification footnote | (none) | "Scoring rules and answers are an illustrative example. Rules are configurable per campaign." | Labels the example score (86) as illustrative. |
| 15 | Location in demos | "North corridor" | "Whitefield" (Whitefield, Bengaluru in the story file) | One consistent fictional location across hero, workflow, qualification and video. |
| 16 | Omnichannel centre card | Step name only | Step name + detail for the same lead, e.g. "Brochure sent · delivered ✓✓", "Sat, 15 Nov · 11:00 AM · reminders queued" | Brief §15: consistent lead and project information through the sequence. |
| 17 | Features card labels | Numbers 01–10 | "Core capability" (AI Calling, Lead Qualification, WhatsApp, Site Visit Scheduling) / "Platform" | Card order changed to emphasise priority features, so sequential numbers would be misleading. Titles and descriptions unchanged. |
| 18 | Feature: 24/7 Automation demo | Clock with four events | Adds "Calling permitted / Outside calling hours", a 10 AM–7 PM window and "Follow-up held until 10 AM" | Reflects the approved copy "according to configured calling hours and communication permissions". |
| 19 | Feature: Lead Scoring demo | Static four leads | Score built from captured answers: budget +25, configuration +20, timeline +20, site visit +21 = 86 | Brief §16: score updates based on captured answers. Matches the score 86 used elsewhere. |
| 20 | Feature: Database Reactivation demo | Inactive → Active | Inactive · 9 months → Call · Tue 10:30 (scheduled contact) | Brief §16: inactive leads become scheduled contacts. |
| 21 | How It Works | (none) | "Step n of 5", "Pause tour / Play tour", "See all five steps in 30 seconds — Watch the product walkthrough" | Pause control and video preview required by brief §7 and §13. |
| 22 | Video modal | "30-second product walkthrough. Silent with captions." | "34-second walkthrough with captions." + Voice-over / Silent selector | New video length and audio versions. |
| 23 | Walkthrough video captions | Eight scene captions (V1) | New narration lines, e.g. "Within seconds, Aria, your AI voice agent, calls them back." and an ending "Book a demo to see it working on your own leads." | Rewritten so captions match the new voice-over word for word; ending CTA required by brief §7. |
| 24 | Mobile CRM screens | Static | Notifications ("AI call completed", "Site visit confirmed", "New lead assigned") and status changes (Qualified → Visit booked, Assigned to Kavya Rao) | Brief §20: appointment notifications and lead status updates. |
| 25 | Use Cases tabs | Text-only tabs | Same labels with an icon per audience | Styling only; labels unchanged. |
| 26 | Trusted By label | 14 px muted text | Same words at 20–22 px display size | Hierarchy only; text unchanged. |

## Reviewed and left unchanged (with reasons)
- **UK/US spelling mix** in approved copy ("enquiries" vs "Synchronize", "prioritize", "centralized"). Not an error and part of approved text; recommend choosing one style before launch.
- **"Site Visit Booking" vs "Site Visit Scheduling"**: both are approved names (use-case/voice tab vs feature card); they describe the same capability from different angles.
- **"Hear AI in Action"** (final CTA) vs **"Hear a Sample Call"** (hero): both approved; both open the same voice demo.
- **Placeholder product name** "[Product Name]": still centralised in `src/config/brand.ts`.
- No unsupported claims were found in V1 copy; planned features keep their "planned" / "supported by design" wording.
