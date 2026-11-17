"""Builds design/home-v8/landing.html (ad landing page) and design/home-v8/free-audit.html (lead magnet)
from the homepage's design system: same CSS, fonts, colours, footer and form styles.

    python3 -I scripts/landing-pages/build.py
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2] / "design" / "home-v8"
home = (ROOT / "index.html").read_text()
css = home[home.index("<style>") + 7 : home.index("</style>")]
fonts = re.findall(r'<link rel="preload" href="assets/fonts/[^"]+"[^>]*>', home)
footer = home[home.index('<footer class="foot"') : home.index("</footer>") + 9]
footer = footer.replace('<ul id="footSvc"></ul>', "<ul>" + "".join(f'<li><a href="index.html#services">{t}</a></li>' for t in ["Website Design &amp; Development", "Search Engine Optimization", "Performance Marketing", "Branding &amp; Creative Design", "Social Media Marketing", "Custom Applications &amp; Software"]) + "</ul>")
footer = footer.replace('href="#', 'href="index.html#')
aform = home[home.index('<form class="aform') : home.index("</form>", home.index('<form class="aform')) + 7]
talk = home[home.index('<section class="talk"') : home.index("</section>", home.index('<section class="talk"')) + 10]
bands = re.findall(r'<section class="lmb.*?</section>', home, flags=re.S)
TICK = '<svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8.5 3.2 3L13 4.5"/></svg>'
ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'

PAGE_CSS = """
  /* ---------- landing pages ---------- */
  .lp-hdr { position: absolute; inset: 0 0 auto; z-index: 50; }
  .lp-hdr .bar { width: min(var(--wrap), calc(100% - 96px)); margin: 0 auto; height: 88px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.12); }
  .lp-hdr .logo img { height: 44px; width: auto; }
  .lp-hdr .right { display: flex; align-items: center; gap: 22px; }
  .lp-hdr .tel { color: #fff; font-weight: 600; font-size: 15px; }
  .lp-hero { position: relative; min-height: max(100vh, 860px); display: flex; align-items: center; background: var(--ink); color: #fff; overflow: hidden; }
  .lp-hero .bgv { position: absolute; inset: 0; }
  .lp-hero .bgv video, .lp-hero .bgv img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.5) saturate(.85); }
  .lp-hero .veil { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(11,13,13,.96), rgba(11,13,13,.82) 42%, rgba(11,13,13,.55)), linear-gradient(180deg, rgba(11,13,13,.6), rgba(11,13,13,0) 25%, rgba(11,13,13,0) 70%, rgba(11,13,13,.95)); }
  .lp-hero .grid { position: relative; display: grid; grid-template-columns: 1.1fr .9fr; gap: 64px; align-items: center; padding: 132px 0 72px; }
  .lp-hero .pill { color: var(--sky); background: rgba(56,189,248,.08); border: 1px solid rgba(56,189,248,.4); }
  .lp-hero h1 { margin-top: 24px; font-size: clamp(46px, 4.3vw, 66px); line-height: 1.06; letter-spacing: -0.015em; }
  .lp-hero h1 .serif { color: var(--sky); }
  .lp-hero .sub { margin-top: 22px; max-width: 560px; font-size: 18.5px; line-height: 1.62; color: var(--grey-soft); }
  .lp-hero ul { list-style: none; margin-top: 22px; display: grid; gap: 10px; }
  .lp-hero li { display: flex; gap: 10px; align-items: center; font-size: 16px; font-weight: 500; }
  .lp-hero li i { width: 22px; height: 22px; border-radius: 50%; background: var(--royal); display: grid; place-items: center; flex: none; } .lp-hero li i svg { width: 12px; height: 12px; }
  .lp-hero .nums { margin-top: 34px; display: flex; gap: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,.14); }
  .lp-hero .nums b { display: block; font-family: "Clash Display", sans-serif; font-size: 44px; font-weight: 600; letter-spacing: -0.02em; }
  .lp-hero .nums span { font-size: 12.5px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--silver); }
  .lp-logos { background: #fff; border-bottom: 1px solid var(--line); }
  .lp-logos .wrap { display: flex; align-items: center; justify-content: space-between; gap: 34px; height: 120px; }
  .lp-logos small { flex: none; font-size: 12.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); }
  .lp-logos img { height: 42px; width: auto; max-width: 120px; object-fit: contain; opacity: .85; filter: grayscale(.2); }
  .lp-sec { padding: 120px 0; background: #fff; color: var(--ink); }
  .lp-sec.mist { background: var(--mist); } .lp-sec.dark { background: var(--ink); color: #fff; }
  .lp-sec .center { text-align: center; max-width: 780px; margin: 0 auto; }
  .lp-sec .center .lead { margin: 18px auto 0; }
  .lp-svc { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-svc > div { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 30px 28px; transition: transform .6s var(--ease), box-shadow .6s var(--ease); }
  .lp-svc > div:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -42px rgba(11,13,13,.5); }
  .lp-svc i { width: 52px; height: 52px; border-radius: 14px; background: var(--mist); display: grid; place-items: center; }
  .lp-svc i svg { width: 26px; height: 26px; stroke: var(--ink); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .lp-svc i svg .a { stroke: var(--royal); }
  .lp-svc h3 { margin-top: 20px; font-family: "Clash Display", sans-serif; font-size: 23px; font-weight: 600; }
  .lp-svc p { margin-top: 8px; font-size: 15.5px; line-height: 1.6; color: var(--muted); }
  .lp-work { margin-top: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .lp-work figure { border-radius: 22px; overflow: hidden; background: var(--ink); }
  .lp-work img { width: 100%; height: auto; aspect-ratio: 16/10; object-fit: cover; display: block; }
  .lp-work figcaption { display: flex; justify-content: space-between; padding: 16px 20px; color: #fff; font-weight: 700; font-size: 16px; }
  .lp-work figcaption span { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--sky); font-weight: 700; }
  .lp-res { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-res > div { border-radius: 22px; background: #15181B; border: 1px solid rgba(255,255,255,.1); padding: 30px 28px; }
  .lp-res small { font-size: 12.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--sky); }
  .lp-res .n { margin-top: 18px; display: flex; gap: 26px; flex-wrap: wrap; }
  .lp-res b { display: block; font-family: "Clash Display", sans-serif; font-size: 46px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }
  .lp-res span { font-size: 13px; color: var(--silver); }
  .lp-steps { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .lp-steps figure img { border-radius: 22px; }
  .lp-steps img { width: 100%; height: auto; aspect-ratio: 1.1/1; object-fit: cover; display: block; }
  .lp-steps .t { padding: 22px 6px 0; }
  .lp-steps .t b { font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: var(--royal); }
  .lp-steps .t h3 { margin-top: 8px; font-family: "Clash Display", sans-serif; font-size: 24px; font-weight: 600; }
  .lp-steps .t p { margin-top: 8px; font-size: 15.5px; color: var(--muted); line-height: 1.6; }
  .lp-tst { margin-top: 56px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .lp-tst > div { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4/5; background: var(--ink); }
  .lp-tst img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.82); }
  .lp-tst .cap { position: absolute; inset: auto 0 0; padding: 60px 18px 18px; background: linear-gradient(180deg, rgba(11,13,13,0), rgba(11,13,13,.92)); color: #fff; }
  .lp-tst .cap b { display: block; font-size: 16px; } .lp-tst .cap small { display: block; margin-top: 4px; font-size: 13px; color: var(--grey-soft); line-height: 1.4; }
  .lp-tst .play { position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%; background: #fff; display: grid; place-items: center; }
  .lp-tst .play svg { width: 14px; height: 14px; fill: var(--ink); margin-left: 2px; }
  .lp-faq { max-width: 880px; margin: 48px auto 0; display: grid; gap: 12px; }
  .lp-faq details { border-radius: 16px; background: #fff; border: 1px solid var(--line); }
  .lp-faq summary { list-style: none; cursor: pointer; padding: 22px 26px; font-weight: 700; font-size: 17px; display: flex; justify-content: space-between; gap: 20px; }
  .lp-faq summary::-webkit-details-marker { display: none; }
  .lp-faq summary::after { content: "+"; color: var(--royal); font-size: 22px; line-height: 1; }
  .lp-faq details[open] summary::after { content: "–"; }
  .lp-faq details p { padding: 0 26px 22px; color: var(--muted); line-height: 1.65; }
  .lp-final { background: var(--ink); color: #fff; padding: 120px 0; text-align: center; position: relative; overflow: hidden; }
  .lp-final::before { content: ""; position: absolute; left: 50%; top: -260px; width: 900px; height: 600px; margin-left: -450px; background: radial-gradient(closest-side, rgba(29,78,216,.32), transparent); }
  .lp-final h2 { position: relative; font-size: clamp(48px, 5.4vw, 84px); line-height: 1.02; } .lp-final h2 .serif { color: var(--sky); }
  .lp-final p { position: relative; margin: 20px auto 0; max-width: 560px; color: var(--grey-soft); font-size: 18px; }
  .lp-final .btns { position: relative; margin-top: 34px; display: flex; gap: 14px; justify-content: center; }
  .lp-final .btn-wa { border: 1.5px solid rgba(255,255,255,.35); color: #fff; }
  .lp-who { margin-top: 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-who > div { border-radius: 22px; padding: 30px 28px; background: #fff; border: 1px solid var(--line); }
  .lp-who b { font-size: 12.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--royal); }
  .lp-who h3 { margin-top: 10px; font-family: "Clash Display", sans-serif; font-size: 24px; font-weight: 600; }
  .lp-who p { margin-top: 8px; color: var(--muted); line-height: 1.6; font-size: 15.5px; }
  .lp-how { margin-top: 56px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,.14); }
  .lp-how > div { padding: 30px 30px 0 0; }
  .lp-how b { font-family: "Clash Display", sans-serif; font-size: 64px; font-weight: 600; color: transparent; -webkit-text-stroke: 1.5px rgba(56,189,248,.8); line-height: 1; }
  .lp-how h3 { margin-top: 18px; font-family: "Clash Display", sans-serif; font-size: 24px; font-weight: 600; }
  .lp-how p { margin-top: 8px; color: var(--grey-soft); line-height: 1.6; font-size: 15.5px; max-width: 340px; }
  @media (max-width: 1100px) { .lp-hero .grid { grid-template-columns: 1fr; gap: 44px; } .lp-svc, .lp-res, .lp-who, .lp-how { grid-template-columns: 1fr 1fr; } .lp-tst { grid-template-columns: 1fr 1fr; } .lp-logos .wrap { flex-wrap: wrap; height: auto; padding: 24px 0; justify-content: center; } }
  @media (max-width: 640px) { .lp-hdr .bar { width: calc(100% - 32px); height: 72px; } .lp-hdr .tel { display: none; } .lp-hero .grid { padding: 110px 0 56px; } .lp-hero h1 { font-size: 38px; } .lp-hero .nums { gap: 24px; } .lp-hero .nums b { font-size: 34px; }
    .lp-sec, .lp-final { padding: 84px 0; } .lp-svc, .lp-work, .lp-res, .lp-steps, .lp-who, .lp-how, .lp-tst { grid-template-columns: 1fr; } .lp-final .btns { flex-direction: column; align-items: center; } .lp-logos img { height: 32px; } }
"""

def head(title, desc):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0B0D0D">
{chr(10).join(fonts)}
<title>{title}</title>
<!-- Generated by scripts/landing-pages/build.py from the homepage design system. Edit the script, not this file. -->
<style>{css}{PAGE_CSS}</style>
</head>
<body>
<header class="lp-hdr"><div class="bar"><a class="logo" href="index.html" aria-label="ScaleAcres home"><img src="assets/img/scaleacres-logo-white.svg" alt="ScaleAcres"></a>
  <div class="right"><a class="tel" href="tel:+917017169215">+91 70171 69215</a><a class="btn btn-royal btn-sm" href="#lead">Get a free audit {ARROW}</a></div></div></header>
<main>
"""

LOGOS = ["dlf", "godrej-properties", "m3m", "sobha-realty", "signature-global", "tata-realty", "adani-realty", "trg", "jbbr-group", "sid-realtech"]
logos = '<section class="lp-logos" aria-label="Trusted by"><div class="wrap"><small>Trusted by 75+ brands</small>' + "".join(f'<img src="assets/logos/{l}.png" alt="{l.replace("-", " ").title()}" loading="lazy">' for l in LOGOS[:8]) + "</div></section>"

ICONS = {
  "Strategy & research": '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><circle class="a" cx="16" cy="16" r="5"/><path class="a" d="m16 16 8-8"/></svg>',
  "Branding & creative": '<svg viewBox="0 0 32 32"><path d="M6 26 20 12l3 3L9 29H6z"/><path class="a" d="m20 12 4-4a2.1 2.1 0 0 1 3 3l-4 4"/></svg>',
  "Ad films & content": '<svg viewBox="0 0 32 32"><rect x="4" y="8" width="18" height="16" rx="3"/><path class="a" d="m22 14 6-4v12l-6-4"/></svg>',
  "Websites & landing pages": '<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="17" rx="2"/><path d="M12 28h8M16 23v5"/><path class="a" d="M8 11h8"/></svg>',
  "Performance marketing": '<svg viewBox="0 0 32 32"><path d="M5 26h22"/><path class="a" d="m7 21 6-6 5 4 8-9"/><path class="a" d="M21 10h5v5"/></svg>',
  "Social, SEO & CRM": '<svg viewBox="0 0 32 32"><circle cx="9" cy="16" r="3.5"/><circle class="a" cx="23" cy="8" r="3.5"/><circle cx="23" cy="24" r="3.5"/><path d="m12 14.5 8-5M12 17.5l8 5"/></svg>',
}
SVC = [("Strategy & research", "Market, buyer and competitor research turned into a clear launch plan for your project."),
       ("Branding & creative", "Identities, campaigns, brochures, hoardings and the creative that makes people stop."),
       ("Ad films & content", "Ad films, AI films, reels and social content made in our own studio."),
       ("Websites & landing pages", "Fast, conversion-focused websites and campaign landing pages."),
       ("Performance marketing", "Meta and Google campaigns tuned for qualified leads at a lower cost per lead."),
       ("Social, SEO & CRM", "Always-on social, search visibility and lead follow-up that keeps enquiries warm.")]
svc = '<div class="lp-svc">' + "".join(f'<div class="rv" style="--d:{(i%3)*80}ms"><i>{ICONS[t]}</i><h3>{t.replace("&", "&amp;")}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(SVC)) + "</div>"

RESULTS = '''<div class="lp-res">
  <div class="rv"><small>Yugen Infra · Real estate</small><div class="n"><div><b>15k+</b><span>Leads</span></div><div><b>200+</b><span>Plots sold</span></div></div></div>
  <div class="rv" style="--d:80ms"><small>TimesPro Consulting</small><div class="n"><div><b>50%</b><span>Lower cost per lead</span></div><div><b>350%</b><span>More site visits</span></div></div></div>
  <div class="rv" style="--d:160ms"><small>NRG India</small><div class="n"><div><b>20×</b><span>Return on marketing</span></div><div><b>110%</b><span>More site visits</span></div></div></div>
</div>'''

PLAY = '<span class="play"><svg viewBox="0 0 16 16"><path d="M4 2.5v11L13 8z"/></svg></span>'
TST = '<div class="lp-tst">' + "".join(f'<div class="rv" style="--d:{i*60}ms"><img src="assets/img/{img}" alt="{n} video testimonial" loading="lazy">{PLAY}<div class="cap"><b>{n}</b><small>{q}</small></div></div>' for i, (img, n, q) in enumerate([
    ("sunita-bishnoi-lets-movin-poster.webp", "Let's Movin", "Channel partner, real estate"),
    ("timespro-poster.webp", "TimesPro Consulting", "50% lower cost per lead · 350% more site visits"),
    ("nrg-india-poster.webp", "NRG India", "20× return on marketing · 110% more site visits"),
    ("ipd-poster.webp", "IPD · International Property Desk", "Content creation for real estate")])) + "</div>"

def faq(items):
    return '<div class="lp-faq">' + "".join(f'<details class="rv"{" open" if i == 0 else ""}><summary>{q}</summary><p>{a}</p></details>' for i, (q, a) in enumerate(items)) + "</div>"

FORM_JS = home[home.index("/* free-audit form:") : home.index("})();", home.index("/* free-audit form:")) + 5]
LM_JS = home[home.index("/* lead-magnet and contact forms:") : home.index("\n});", home.index("/* lead-magnet and contact forms:")) + 4]
SCRIPT = f"""<script>
const io = new IntersectionObserver((es) => es.forEach((e) => {{ if (e.isIntersecting) {{ e.target.classList.add("in"); io.unobserve(e.target); }} }}), {{ threshold: 0.12 }});
document.querySelectorAll(".rv, .mask").forEach((el) => io.observe(el));
requestAnimationFrame(() => document.querySelectorAll(".lp-hero .rv, .lp-hero .mask").forEach((el) => {{ el.classList.add("in"); io.unobserve(el); }}));
if (/static=1/.test(location.search)) document.documentElement.classList.add("static");
{FORM_JS}
{LM_JS}
</script>"""

def hero(pill, h1, sub, ticks, media):
    lis = "".join(f"<li><i>{TICK}</i>{t}</li>" for t in ticks)
    return f"""<section class="lp-hero" aria-label="Introduction">
  <div class="bgv">{media}</div><div class="veil"></div>
  <div class="wrap grid">
    <div>
      <span class="pill rv">{pill}</span>
      <h1 class="rv">{h1}</h1>
      <p class="sub rv">{sub}</p>
      <ul class="rv">{lis}</ul>
      <div class="nums rv"><div><b>250+</b><span>Projects</span></div><div><b>75+</b><span>Brands</span></div><div><b>2</b><span>Offices · Agra &amp; Delhi</span></div></div>
    </div>
    <div id="lead">{aform}</div>
  </div>
</section>"""

def final(h2, p):
    return talk

VIDEO = '<video autoplay muted loop playsinline preload="auto" poster="assets/img/hero-ai-poster.jpg" aria-hidden="true"><source src="assets/video/hero-ai-wall-1280.webm" type="video/webm"><source src="assets/video/hero-ai-wall-1280.mp4" type="video/mp4"></video>'

# ---------------- landing.html ----------------
work = '<div class="lp-work">' + "".join(f'<figure class="rv" style="--d:{(i%2)*100}ms"><img src="assets/img/{img}.webp" alt="{alt}" loading="lazy" width="1600" height="1000"><figcaption>{n}<span>{c}</span></figcaption></figure>' for i, (img, n, c, alt) in enumerate([
    ("sc-sid-realtech-1600", "SID Realtech · Ellington 86", "Launch campaign", "Ellington 86 launch campaign"),
    ("sc-sohom-1600", "Pravya · Soham × DTC", "Launch film", "Pravya launch film and storyboard"),
    ("sc-yugen-1600", "Yugen Infra", "Lead campaign", "Yugen Infra campaign results"),
    ("sc-jbbr-1600", "JBBR Group", "Brand identity", "JBBR Group luxury brand kit")])) + "</div>"
steps = '<div class="lp-steps">' + "".join(f'<figure class="rv" style="--d:{i*100}ms"><img src="assets/img/{img}.webp" alt="{t}" loading="lazy" width="1210" height="1100"><div class="t"><b>Step 0{i+1}</b><h3>{t}</h3><p>{d}</p></div></figure>' for i, (img, t, d) in enumerate([
    ("journey-01-strategy", "Strategy", "We study your market, buyers and competitors, and set the plan, budget and targets."),
    ("journey-02-execution", "Execution", "Our studio produces the creative and ad films; our media team launches the campaigns."),
    ("journey-03-growth", "Growth", "We track every lead to its source and keep improving what brings qualified buyers.")])) + "</div>"
LP_FAQ = [("What does ScaleAcres do?", "We are a real estate 360° marketing and creative agency. One creative-first team handles strategy, branding, creative, ad films, websites, performance marketing, social and SEO, so every part of your launch works together."),
          ("Who do you work with?", "Real estate developers, channel partners and brokers, across residential, commercial and plotted projects. We have worked on 250+ projects."),
          ("How soon can a campaign go live?", "Once the plan and creative are approved, most campaigns can launch quickly. We share a clear timeline in your first call."),
          ("What does it cost?", "It depends on your goals and channels. Start with the free audit and we will recommend a plan and budget that fits.")]
landing = head("ScaleAcres · Real Estate 360° Marketing & Creative Agency", "ScaleAcres is a real estate 360° marketing and creative agency: branding, ad films, creative, websites and performance campaigns from one studio.") + \
  hero("Real estate 360° marketing &amp; creative agency", 'Real estate creative that turns attention into <span class="serif">qualified leads.</span>',
       "A creative-first 360° team: branding, ad films, websites and performance campaigns from one studio, built for developers and channel partners.",
       ["Big ideas, made in our own creative studio", "Meta &amp; Google campaigns built for qualified leads", "One team, one plan, clear reporting"], VIDEO) + logos + \
  f"""<section class="lp-sec mist" aria-label="Services"><div class="wrap"><div class="center"><span class="eyebrow center rv">360° under one roof</span><h2 class="h2 rv" style="margin-top:20px">Everything your brand needs to <span class="serif royal">grow.</span></h2><p class="lead rv">Six capabilities, one accountable team.</p></div>{svc}</div></section>
{bands[0]}
<section class="lp-sec" aria-label="Our work"><div class="wrap"><div class="center"><span class="eyebrow center rv">Our work</span><h2 class="h2 rv" style="margin-top:20px">Creative that <span class="serif royal">sells.</span></h2></div>{work}</div></section>
<section class="lp-sec dark" aria-label="Results"><div class="wrap"><div class="center"><span class="eyebrow center rv">Results</span><h2 class="h2 rv" style="margin-top:20px">Numbers our clients <span class="serif sky">talk about.</span></h2></div>{RESULTS}</div></section>
<section class="lp-sec mist" aria-label="How we work"><div class="wrap"><div class="center"><span class="eyebrow center rv">How we work</span><h2 class="h2 rv" style="margin-top:20px">From a plan to <span class="serif royal">real growth.</span></h2></div>{steps}</div></section>
{bands[1]}
<section class="lp-sec" aria-label="Testimonials"><div class="wrap"><div class="center"><span class="eyebrow center rv">Client stories</span><h2 class="h2 rv" style="margin-top:20px">Hear it from <span class="serif royal">our clients.</span></h2></div>{TST}</div></section>
<section class="lp-sec mist" aria-label="FAQ"><div class="wrap"><div class="center"><span class="eyebrow center rv">FAQ</span><h2 class="h2 rv" style="margin-top:20px">Questions, <span class="serif royal">answered.</span></h2></div>{faq(LP_FAQ)}</div></section>
""" + final('Let&rsquo;s build your <span class="serif">next launch.</span>', "Start with a free marketing audit. No cost, no obligation.") + "</main>\n" + footer + SCRIPT + "\n</body></html>\n"
(ROOT / "landing.html").write_text(landing)

# ---------------- free-audit.html ----------------
inside = '''<div class="audit" style="padding:0;background:none"><div class="grid" style="grid-template-columns:1fr 1fr;gap:56px;align-items:center">
  <ul class="gets" style="margin-top:0">''' + "".join(f'<li class="rv"><i>{TICK}</i><div>{t}<small>{d}</small></div></li>' for t, d in [
    ("Website &amp; landing page review", "Speed, layout, messaging and how well each page turns visitors into enquiries."),
    ("Ads &amp; cost-per-lead check", "Targeting, creative, budget split and tracking on Meta and Google."),
    ("Social &amp; creative review", "What your feed, reels and ads say about your brand, and what to change."),
    ("Search (SEO) snapshot", "How easily buyers find you on Google, including local search."),
    ("A prioritised action plan", "The three changes likely to move your numbers first.")]) + '''</ul>
  <div class="report rv" style="margin-top:0;max-width:none" aria-label="Sample audit scorecard"><div class="rh">Audit scorecard <em>Sample</em></div>
    <div class="row">Website<div class="bar"><b style="width:62%"></b></div><span>62</span></div>
    <div class="row">Paid ads<div class="bar"><b style="width:48%"></b></div><span>48</span></div>
    <div class="row">Social &amp; creative<div class="bar"><b style="width:71%"></b></div><span>71</span></div>
    <div class="row">Search (SEO)<div class="bar"><b style="width:55%"></b></div><span>55</span></div>
    <div class="row">Lead follow-up<div class="bar"><b style="width:40%"></b></div><span>40</span></div></div>
</div></div>'''
who = '<div class="lp-who">' + "".join(f'<div class="rv" style="--d:{i*80}ms"><b>{b}</b><h3>{t}</h3><p>{d}</p></div>' for i, (b, t, d) in enumerate([
    ("Real estate", "Developers", "Launching or selling a project and want more qualified enquiries and site visits."),
    ("Real estate", "Channel partners &amp; brokers", "Running ads for several projects and want a lower cost per lead."),
    ("Real estate", "Real estate brands", "Builders, consultancies and project marketers who want stronger creative and better leads.")])) + "</div>"
how = '<div class="lp-how">' + "".join(f'<div class="rv" style="--d:{i*100}ms"><b>0{i+1}</b><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate([
    ("Share your link", "Send your website or Instagram link and a few details in the form."),
    ("We review it", "A ScaleAcres strategist reviews your website, ads, social and search."),
    ("Get your plan", "We walk you through what we found and what to fix first.")])) + "</div>"
AU_FAQ = [("Is the audit really free?", "Yes. There is no cost and no obligation to work with us."),
          ("What do you need from me?", "Your website or social link and a few details about your business. If you run ads, we may ask to see results to make the review more precise."),
          ("Who reviews my marketing?", "A ScaleAcres strategist who works on real estate launches every day."),
          ("How long does the audit take?", "Once we have your details, a strategist reviews your marketing and calls you to walk through it.")]
audit = head("Free Marketing Audit · ScaleAcres", "Get a free marketing audit from ScaleAcres: a review of your website, ads, social and search, with a prioritised action plan.") + \
  hero("Free marketing audit", 'Find out what is holding <span class="serif">your leads back.</span>',
       "A ScaleAcres strategist reviews your project's website, ads, social and search, then walks you through what to fix first. Free, with no obligation.",
       ["Website, ads, social and SEO reviewed", "A prioritised action plan", "From a real estate 360° marketing &amp; creative agency"], '<img src="assets/img/ideas-city-1440.webp" alt="" aria-hidden="true">') + logos + \
  f"""<section class="lp-sec dark" aria-label="What is in the audit"><div class="wrap"><div class="center" style="margin-bottom:56px"><span class="eyebrow center rv">What you get</span><h2 class="h2 rv" style="margin-top:20px">Inside your <span class="serif sky">free audit.</span></h2></div>{inside}</div></section>
{bands[0]}
<section class="lp-sec mist" aria-label="Who it is for"><div class="wrap"><div class="center"><span class="eyebrow center rv">Who it is for</span><h2 class="h2 rv" style="margin-top:20px">Built for <span class="serif royal">growth.</span></h2></div>{who}</div></section>
<section class="lp-sec dark" aria-label="How it works"><div class="wrap"><div class="center"><span class="eyebrow center rv">How it works</span><h2 class="h2 rv" style="margin-top:20px">Three simple <span class="serif sky">steps.</span></h2></div>{how}</div></section>
<section class="lp-sec dark" style="padding-top:0" aria-label="Results"><div class="wrap">{RESULTS}</div></section>
{bands[1]}
<section class="lp-sec mist" aria-label="FAQ"><div class="wrap"><div class="center"><span class="eyebrow center rv">FAQ</span><h2 class="h2 rv" style="margin-top:20px">Audit <span class="serif royal">questions.</span></h2></div>{faq(AU_FAQ)}</div></section>
""" + final('Ready to see <span class="serif">what to fix?</span>', "Get your free marketing audit today.") + "</main>\n" + footer + SCRIPT + "\n</body></html>\n"
(ROOT / "free-audit.html").write_text(audit)
print("wrote landing.html and free-audit.html")
