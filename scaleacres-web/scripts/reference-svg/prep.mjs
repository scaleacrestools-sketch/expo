// Loads the reference homepage and flattens it into a static, design-file layout:
// every scroll reveal finished, sticky/pinned sections laid out in flow, one hero frame.
import { chromium } from "playwright";

export const HERO_Y = 7200; // scroll position of the stadium frame in the scroll-driven hero film

export async function open() {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route("**/*", (r) => /reddashmedia\.com/.test(new URL(r.request().url()).host) || r.request().url().startsWith("data:") ? r.continue() : r.abort());
  await p.goto("https://www.reddashmedia.com/", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  // play every scroll reveal once
  let H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.evaluate((t) => scrollTo(0, t), y); await p.waitForTimeout(160); H = await p.evaluate(() => document.documentElement.scrollHeight); }
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1200);
  // hero frame: the film as it stands at HERO_Y, captured without any overlay
  await p.evaluate((t) => scrollTo(0, t), HERO_Y); await p.waitForTimeout(1500);
  await p.evaluate(() => { const v = document.querySelector(".filmbed video.on, .filmbed video"); v?.pause(); });
  await p.addStyleTag({ content: ".filmscrim,.filmcaption,.copy,.fall-cue,.filmrail,.site-header,.side-rail,.fab-quote,.fab-portfolio,.grain,.film-open{visibility:hidden!important}" , });
  await p.waitForTimeout(400);
  const heroBg = await p.screenshot({ type: "jpeg", quality: 90 });
  return { b, p, heroBg };
}

export async function flatten(p) {
  await p.addStyleTag({ content: `
    .filmscrim,.filmcaption,.copy,.filmrail,.site-header,.side-rail,.fab-quote,.grain{visibility:visible!important}
    .filmstage{height:100vh!important;min-height:0!important}
    .fall-cue,.film-open,.filmrail,.grain,.fab-portfolio,.nav-panel,dialog,.skip{display:none!important}
    .filmbed{visibility:hidden!important}
    .filmstage .copy{opacity:1!important;visibility:visible!important}
    .filmstage .copy *{opacity:1!important;transform:none!important;clip-path:none!important}
    .filmcaption{opacity:1!important}
    .filmcaption span{display:none!important}
    .filmcaption span:last-child{display:block!important;opacity:1!important;transform:none!important}
    *{animation-play-state:paused!important}
  `});
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(800);
}
