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
