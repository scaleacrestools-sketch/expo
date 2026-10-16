"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import { studioTabs, type StudioTab, type StudioVideo } from "@/content/studio";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { DevBadge } from "@/components/ui/DevBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoModal } from "@/components/VideoModal";
import { prefersReducedMotion } from "@/lib/motion";

export function CreativeStudio({ showCta = true }: { showCta?: boolean }) {
  const [active, setActive] = useState<StudioTab["id"]>(studioTabs[0].id);
  const [modal, setModal] = useState<StudioVideo | null>(null);
  const tabsId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = studioTabs.findIndex((t) => t.id === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % studioTabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + studioTabs.length) % studioTabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = studioTabs.length - 1;
    else return;
    e.preventDefault();
    const id = studioTabs[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <Reveal as="section" id="creative-studio" className="section-y bg-charcoal text-ivory">
      <div className="container-x mx-auto max-w-[110rem]">
        <SectionHeading eyebrow="The creative lab" title="Made to be seen." description="Ideas don't have to stay on paper. We turn concepts into compelling visual stories through creative production, AI-powered content and videos that get noticed." />

        <div className="mt-14 border-b border-ivory/15" data-reveal>
          <div role="tablist" aria-label="Creative Studio categories" className="scrollbar-none -mb-px flex gap-2 overflow-x-auto" onKeyDown={onKeyDown}>
            {studioTabs.map((t) => {
              const selected = t.id === active;
              return (
                <button
                  key={t.id}
                  ref={(el) => { tabRefs.current[t.id] = el; }}
                  role="tab"
                  id={`${tabsId}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${tabsId}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  className={`relative shrink-0 whitespace-nowrap px-1 pb-5 pt-2 text-[clamp(0.875rem,0.8rem+0.5vw,1.125rem)] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-4 ${selected ? "text-ivory" : "text-grey hover:text-ivory"}`}
                >
                  {t.label}
                  <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[2px] bg-coral transition-transform duration-500 ease-out-expo ${selected ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {studioTabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${tabsId}-panel-${t.id}`}
            aria-labelledby={`${tabsId}-tab-${t.id}`}
            hidden={t.id !== active}
            className="pt-10 motion-safe:animate-[fade-up_0.6s_var(--ease-out-expo)_both]"
          >
            <p className="lead max-w-[56ch] text-stone">{t.description}</p>
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-6 md:gap-6" role="list">
              {t.videos.map((v, i) => (
                <li key={v.id} className={gridClass(v.aspect, i)}>
                  <VideoTile video={v} onOpen={() => setModal(v)} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {showCta ? (
          <div className="mt-14" data-reveal>
            <ArrowLink href="/creative-studio" variant="solid">Explore Creative Studio</ArrowLink>
          </div>
        ) : null}
      </div>
      <VideoModal video={modal} onClose={() => setModal(null)} />
      <style>{`@keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </Reveal>
  );
}

const HOVER_MQ = "(hover: hover) and (pointer: fine)";
function subscribeHover(cb: () => void) {
  const mq = window.matchMedia(HOVER_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getCanHover() {
  return window.matchMedia(HOVER_MQ).matches && !prefersReducedMotion();
}

function gridClass(aspect: StudioVideo["aspect"], i: number) {
  if (aspect === "16/9") return `col-span-2 md:col-span-4 ${i === 0 ? "" : ""}`;
  if (aspect === "9/16") return "col-span-1 md:col-span-2 md:row-span-2";
  return "col-span-1 md:col-span-2";
}

function VideoTile({ video: v, onOpen }: { video: StudioVideo; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const canHover = useSyncExternalStore(subscribeHover, getCanHover, () => false);
  const preview = (on: boolean) => {
    const el = ref.current;
    if (!el || !canHover) return;
    if (on) el.play().catch(() => undefined);
    else { el.pause(); el.currentTime = 0; }
  };
  const aspectCls = v.aspect === "16/9" ? "aspect-video" : v.aspect === "9/16" ? "aspect-[9/16]" : v.aspect === "4/5" ? "aspect-[4/5]" : "aspect-square";
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => preview(true)}
      onMouseLeave={() => preview(false)}
      onFocus={() => preview(true)}
      onBlur={() => preview(false)}
      aria-label={`Play ${v.title}`}
      className={`group relative block h-full w-full overflow-hidden rounded-sm bg-charcoal-soft text-left focus-visible:outline-coral ${aspectCls}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={v.poster} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]" loading="lazy" />
      {canHover ? (
        <video ref={ref} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          {v.sources.map((s) => (<source key={s.src} src={s.src} type={s.type} />))}
        </video>
      ) : null}
      {v.placeholder ? <DevBadge label="Dev placeholder video" /> : null}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,21,26,0)_50%,rgba(17,21,26,0.8)_100%)]" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/50 bg-charcoal/40 text-ivory backdrop-blur transition-all duration-500 ease-out-expo group-hover:scale-110 group-hover:border-coral group-hover:bg-coral group-hover:text-charcoal">
        <svg viewBox="0 0 12 12" className="ml-0.5 h-3.5 w-3.5 fill-current"><path d="M2 1.5l9 4.5-9 4.5z" /></svg>
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-coral">{v.category}</span>
        <span className="mt-1 block text-sm font-semibold leading-snug text-ivory md:text-base">{v.title}</span>
      </span>
    </button>
  );
}
