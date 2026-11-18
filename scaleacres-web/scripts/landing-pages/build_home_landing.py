"""Builds design/home-v8/home-landing.html: the homepage as a landing page.
Every homepage section is kept exactly as it is; the footer is removed, and a lead magnet is added
after each section (the three existing ones are kept, seven new ones are added).

    python3 -I scripts/landing-pages/build_home_landing.py
"""
import pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2] / "design" / "home-v8"
s = (ROOT / "index.html").read_text()
ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
ROLE = '<select name="role" required><option value="" disabled selected>You are a</option><option>Developer</option><option>Channel partner / broker</option><option>Real estate brand</option><option>Other</option></select>'

def field(name, ph, kind="text", full=False):
    cls = ' class="full"' if full else ""
    t = ' type="tel" inputmode="tel" autocomplete="tel"' if kind == "tel" else (' autocomplete="name"' if name == "fullName" else "")
    return f'<label{cls}><span>{ph}</span><input name="{name}"{t} required placeholder="{ph}"></label>'

def band(variant, fid, tag, h3, p, extra, btn):
    return f'''<section class="lmb {variant}" aria-label="{tag}"><div class="wrap"><div class="card rv">
  <div><span class="tag">{tag}</span><h3>{h3}</h3><p>{p}</p></div>
  <form class="lm-form" id="{fid}" novalidate aria-label="{tag}">
    {field("fullName", "Your name")}{field("phone", "Phone or WhatsApp", "tel")}{extra}
    <button type="submit">{btn} {ARROW}</button>
    <p class="note" role="status" aria-live="polite"></p>
  </form>
</div></div></section>

'''

NEW = {
  "<!-- 03 services:": band("slim", "lmCall", "Free strategy call",
      'Talk to a strategist <span class="serif">this week.</span>',
      "A 30-minute call on your project: positioning, buyer profile and where your first leads should come from.",
      f'<label><span>You are a</span>{ROLE}</label>', "Book my free call"),
  "<!-- 05 client work showcase:": band("wh", "lmOutdoor", "Free outdoor concept",
      'See your project <span class="serif">on a hoarding.</span>',
      "Our studio designs one hoarding or site-branding concept for your project, the kind of idea that stops traffic.",
      field("project", "Project name and city", full=True), "Get my hoarding concept"),
  "<!-- 06 how we work:": band("slim", "lmPortfolio", "Full portfolio",
      'Get the full portfolio <span class="serif">on WhatsApp.</span>',
      "Launch campaigns, ad films, brand identities and websites for 250+ real estate projects.",
      f'<label><span>You are a</span>{ROLE}</label>', "Send me the portfolio"),
  "<!-- 07b channel partners -->": band("", "lmCompetitor", "Free competitor ad report",
      'See what your competitors <span class="serif">are running.</span>',
      "We review the Meta and Google ads that developers in your micro-market are running, and show you where the gap is.",
      field("project", "Your micro-market or city", full=True), "Get my competitor report"),
  "<!-- 07c projects wall -->": band("wh", "lmPartner", "For channel partners",
      'More leads for <span class="serif">every project you sell.</span>',
      "A free lead-generation plan for brokers and channel partners: projects to push, ad budget per project and expected cost per lead.",
      field("project", "Company name and city", full=True), "Get my lead plan"),
  "<!-- 08 studio cards -->": band("slim", "lmWebsite", "Free website review",
      'Is your project website <span class="serif">losing leads?</span>',
      "We review speed, layout and enquiry flow, and send the three fixes that will bring in more enquiries.",
      field("project", "Website link"), "Review my website"),
}
for marker, html in NEW.items():
    assert marker in s, marker
    s = s.replace(marker, f"<!-- lead magnet (landing page) -->\n{html}{marker}", 1)

# one call-to-action button inside every section, pointing at the lead magnet that follows it
CTAS = [
  ("<!-- 02 statement -->", "lmCall", "Book a free strategy call", ""),
  ("<!-- 03 services:", "lmCreative", "Get a free creative concept", ""),
  ("<!-- 04 ideas banner -->", "lmOutdoor", "Get a free hoarding concept", "light"),
  ("<!-- 05 client work showcase:", "lmPortfolio", "Get the full portfolio", ""),
  ("<!-- 06 how we work:", "lmPlan", "Get my free 90-day plan", ""),
  ("<!-- 07 clients -->", "lmCompetitor", "Get a free competitor report", ""),
  ("<!-- 07b channel partners -->", "lmPartner", "Get a free channel-partner plan", ""),
  ("<!-- 07c projects wall -->", "lmWebsite", "Get a free website review", ""),
  ("<!-- 08 studio cards -->", "auditForm", "Get my free marketing audit", ""),
  ("<!-- 10 FAQ -->", "lmFinal", "Get a call back", ""),
]
for marker, target, label, tone in CTAS:
    i = s.index(marker); j = s.index("</section>", i)
    btn = f'<div class="sec-cta rv{" light" if tone else ""}"><a class="btn {"btn-white" if tone else "btn-royal"}" href="#{target}" data-focus="{target}">{label} {ARROW}</a><span>Free · no obligation</span></div>\n'
    s = s[:j] + btn + s[j:]

FINAL = band("", "lmFinal", "Still deciding?",
      'Get a call back <span class="serif">from our team.</span>',
      "Leave your number and a ScaleAcres strategist will call you to answer your questions and plan the next step.",
      f'<label class="full"><span>You are a</span>{ROLE}</label>', "Call me back")
a = s.index("<!-- footer -->"); b = s.index("</footer>") + len("</footer>")
s = s[:a] + s[b:]
s = s.replace("</main>", "<!-- lead magnet (landing page): closing -->\n" + FINAL + "</main>", 1)

JS = """
/* section buttons: scroll to the lead magnet that follows, then put the cursor in its first field */
document.querySelectorAll(".sec-cta a[data-focus]").forEach((a) => a.addEventListener("click", (e) => {
  const f = document.getElementById(a.dataset.focus); if (!f) return; e.preventDefault();
  f.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => f.querySelector("input, select")?.focus({ preventScroll: true }), 650);
}));
"""
k = s.rindex("</script>"); s = s[:k] + JS + s[k:]
s = s.replace('$("#footSvc").innerHTML', 'if ($("#footSvc")) $("#footSvc").innerHTML', 1)
s = s.replace("<title>ScaleAcres · Real Estate 360° Marketing &amp; Creative Agency</title>",
              "<title>ScaleAcres · Real Estate 360° Marketing &amp; Creative Agency · Free Consultation</title>", 1)

css = """
  /* ---------- landing-page version: slim lead bands and closing ---------- */
  .lmb.slim { background: #fff; padding: 46px 0; }
  .lmb.slim .card { grid-template-columns: 1fr 1.2fr; gap: 40px; padding: 30px 38px; border-radius: 22px; }
  .lmb.slim h3 { margin-top: 12px; font-size: 28px; } .lmb.slim p { margin-top: 8px; font-size: 15.5px; }
  .lmb.slim form { grid-template-columns: 1fr 1fr 1fr; } .lmb.slim .full { grid-column: auto; }
  .lmb.slim button { grid-column: 1 / -1; height: 52px; }
  main > .lmb:last-child { padding-bottom: 90px; }
  .sec-cta { position: relative; z-index: 2; width: min(var(--wrap), calc(100% - 96px)); margin: 56px auto 0; display: flex; align-items: center; justify-content: center; gap: 18px; flex-wrap: wrap; }
  .sec-cta .btn { height: 58px; padding: 0 30px; font-size: 16.5px; box-shadow: 0 18px 36px -16px rgba(29,78,216,.75); }
  .sec-cta span { font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }
  .sec-cta.light span { color: rgba(255,255,255,.75); }
  .btn-white { background: #fff; color: var(--ink); } .btn-white:hover { background: var(--mist); }
  .ideas .sec-cta { position: absolute; left: 0; right: 0; bottom: 64px; margin: 0 auto; }
  @media (max-width: 640px) { .sec-cta { width: calc(100% - 32px); margin-top: 40px; } .sec-cta .btn { width: 100%; justify-content: center; } .ideas .sec-cta { bottom: 32px; } }
  @media (max-width: 1100px) { .lmb.slim .card { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .lmb.slim form { grid-template-columns: 1fr; } .lmb.slim .card { padding: 26px 20px; } }
"""
i = s.index("</style>"); s = s[:i] + css + s[i:]
s = s.replace("<!-- Homepage concept v8", "<!-- Landing-page version of homepage v8: generated by scripts/landing-pages/build_home_landing.py; edit index.html or the script, not this file.\n     Homepage concept v8", 1)
(ROOT / "home-landing.html").write_text(s)
print("wrote home-landing.html", s.count('class="lmb'), "lead bands")
