"use client";

import { useEffect, useId, useRef, useState } from "react";
import { studioTabs, type StudioTab, type StudioVideo } from "@/content/studio";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/ui/Reveal";
import { VideoModal } from "@/components/VideoModal";

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
    <Reveal as="section" id="creative-studio" className="section-y relative overflow-hidden bg-ink text-white">
      <div className="container-x mx-auto max-w-[110rem]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-blue" data-reveal>The creative lab</p>
            <h2 className="h2 mt-6" data-split-reveal>
              Made to
              <br />
              be <span className="text-blue">seen.</span>
            </h2>
          </div>
          <p className="lead text-grey-soft lg:col-span-5" data-reveal>
            Ideas don&apos;t have to stay on paper. We turn concepts into compelling visual stories through creative production, AI-powered content and videos that get noticed.
          </p>
        </div>

        <div className="mt-14 border-b border-white/15" data-reveal>
          <div role="tablist" aria-label="Creative Studio categories" className="scrollbar-none -mb-px flex gap-8 overflow-x-auto [mask-image:linear-gradient(90deg,#000_80%,transparent)] md:gap-12 md:[mask-image:none]" onKeyDown={onKeyDown}>
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
                  className={`relative shrink-0 whitespace-nowrap pb-5 pt-2 text-[clamp(1rem,0.8rem+0.9vw,1.75rem)] font-bold uppercase tracking-[0.04em] transition-colors ${selected ? "text-white" : "text-white/40 hover:text-white"}`}
                >
                  {t.label}
                  <span className="ml-2 align-top text-xs font-semibold text-blue">{String(t.videos.length).padStart(2, "0")}</span>
                  <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-blue transition-transform duration-500 ease-out-expo ${selected ? "scale-x-100" : "scale-x-0"}`} />
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
            className="pt-10 motion-safe:animate-[studio-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]"
          >
            <p className="max-w-[60ch] text-[length:var(--fs-body)] leading-[1.7] text-grey-soft">{t.description}</p>
            {t.videos.length ? <Showcase videos={t.videos} onOpen={setModal} active={t.id === active} /> : <Pending note={t.pendingNote} label={t.label} />}
          </div>
        ))}

        {showCta ? (
          <div className="mt-16" data-reveal>
            <ArrowLink href="/creative-studio/" variant="solid" size="lg">Explore Creative Studio</ArrowLink>
          </div>
        ) : null}
      </div>
      <VideoModal video={modal} onClose={() => setModal(null)} />
      <style>{`@keyframes studio-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>
    </Reveal>
  );
}

/** Large stage that plays the selected clip; the list beside it previews on hover/focus. */
function Showcase({ videos, onOpen, active }: { videos: StudioVideo[]; onOpen: (v: StudioVideo) => void; active: boolean }) {
  const [current, setCurrent] = useState(0);
  const [inView, setInView] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const v = videos[current];

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = vid.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (inView && active && !reduce) el.play().catch(() => undefined);
    else el.pause();
  }, [inView, active, current]);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div ref={stage} className="lg:col-span-8">
        <button
          type="button"
          onClick={() => onOpen(v)}
          aria-label={`Play ${v.title} full screen`}
          className="group relative block aspect-video w-full overflow-hidden rounded-sm bg-ink-soft text-left focus-visible:outline-blue"
        >
          <video
            key={v.id}
            ref={vid}
            src={inView ? v.src : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-label={v.description}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.03]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,13,13,0.85))]" />
          <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-6 p-6 md:p-8">
            <span>
              <span className="label block text-blue">{v.category} · {String(current + 1).padStart(2, "0")}</span>
              <span className="mt-2 block text-[clamp(1.5rem,1rem+1.6vw,2.75rem)] font-extrabold uppercase leading-none tracking-[-0.02em]">{v.title}</span>
            </span>
            <span aria-hidden="true" className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110 md:h-20 md:w-20">
              <svg viewBox="0 0 12 12" className="ml-1 h-5 w-5 fill-current"><path d="M2 1.5l9 4.5-9 4.5z" /></svg>
            </span>
          </span>
        </button>
      </div>
      <ol className="lg:col-span-4" role="list" aria-label="Videos">
        {videos.map((item, i) => (
          <li key={item.id} className="border-t border-white/15 last:border-b">
            <button
              type="button"
              onMouseEnter={() => setCurrent(i)}
              onFocus={() => setCurrent(i)}
              onClick={() => { setCurrent(i); onOpen(item); }}
              aria-current={i === current}
              className={`group flex w-full items-center gap-5 py-5 text-left transition-colors ${i === current ? "text-white" : "text-white/45 hover:text-white"}`}
            >
              <span className={`text-sm font-semibold tabular-nums ${i === current ? "text-blue" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] font-bold uppercase tracking-[-0.01em]">{item.title}</span>
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full transition-all ${i === current ? "bg-blue" : "bg-transparent"}`} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Pending({ note, label }: { note?: string; label: string }) {
  return (
    <div className="mt-10 grid min-h-[22rem] place-items-center rounded-sm border border-dashed border-white/20 p-10 text-center">
      <div className="max-w-[46ch]">
        <p className="label text-blue">{label} · awaiting approved files</p>
        <p className="mt-4 text-[clamp(1.5rem,1rem+1.2vw,2.25rem)] font-bold uppercase leading-tight tracking-[-0.02em]">Real client work only.</p>
        {note ? <p className="mt-4 text-[0.975rem] leading-[1.6] text-grey-soft">{note}</p> : null}
      </div>
    </div>
  );
}
