"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ndShowcase, type ShowcaseProject } from "@/content/nd";
import { ArrowUR, Pic, Plus, Tag, Words } from "@/components/nd/ui";

/**
 * 05 — Our work / Creative showcase. Warm-white ground, the heading rising word by word, then a
 * two-column grid of 16:10 project covers. Each cover unmasks upward as it arrives (the right
 * column a beat later) while the picture settles from a slight zoom; name and category follow.
 * Hover pushes the image in and raises a "View project" pill. No project has a detail page yet, so
 * each card opens an accessible preview dialog instead of linking anywhere invented.
 */
export function NdShowcase() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<ShowcaseProject | null>(null);

  const open = (p: ShowcaseProject, btn: HTMLButtonElement) => {
    opener.current = btn;
    setActive(p);
  };
  const close = useCallback(() => dialog.current?.close(), []);

  useEffect(() => {
    const d = dialog.current;
    if (active && d && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
  }, [active]);

  const onClose = () => {
    document.documentElement.style.overflow = "";
    setActive(null);
    opener.current?.focus();
  };

  return (
    <section id="work" className="nd-paper relative border-t border-[color:var(--line-l)]" aria-labelledby="nd-work-title">
      <div className="nd-wrap relative py-[clamp(4.5rem,9vw,8rem)]">
        <div className="nd-grid items-end gap-y-8">
          <div className="nd-cell lg:col-span-2">
            <div data-nd="up"><Tag>Our work does the talking</Tag></div>
            <h2 id="nd-work-title" className="mt-7">
              <span data-nd="up" style={{ "--d": 60 } as CSSProperties} className="block text-[clamp(1.25rem,1rem+0.9vw,1.875rem)] font-medium tracking-[-0.02em]">
                Our Work <span className="tabular-nums text-[color:var(--royal)]">(04)</span>
              </span>
              <Words as="span" lines={["Creative", "Showcase"]} lineClass={["", "lg:pl-[1.1em]"]} delay={120} className="mt-2 block text-[clamp(3.2rem,9vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em]" />
            </h2>
          </div>
          <div className="nd-cell lg:pb-4" data-nd="up" style={{ "--d": 160 } as CSSProperties}>
            <p className="nd-lead max-w-[26rem]">Launches, identities and websites for developers and property businesses, presented from the genuine work we delivered.</p>
          </div>
        </div>

        <ul role="list" className="mt-[clamp(3rem,6vw,5.5rem)] grid gap-x-[clamp(1rem,2.2vw,2rem)] gap-y-[clamp(2.75rem,5vw,4.5rem)] px-[clamp(0.75rem,1.2vw,1.25rem)] md:grid-cols-2">
          {ndShowcase.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard p={p} delay={(i % 2) * 120} onOpen={open} />
            </li>
          ))}
        </ul>

        <div data-nd="up" className="mt-[clamp(3.5rem,6vw,5.5rem)] flex justify-center">
          <Link href="/our-work/" className="group inline-flex items-center gap-4 rounded-full border border-[color:var(--ink)] py-2 pl-7 pr-2 text-[0.9375rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink)] transition-colors duration-300 hover:border-[color:var(--royal)] hover:bg-[color:var(--royal)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--royal)]">
            Explore all work
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--ink)] text-white transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-white group-hover:text-[color:var(--royal)]">
              <ArrowUR className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>

      <dialog ref={dialog} className="nd-dialog" aria-labelledby="nd-work-dialog-title" onClose={onClose} onClick={(e) => e.target === e.currentTarget && close()}>
        {active ? <Preview p={active} onClose={close} /> : null}
      </dialog>
    </section>
  );
}

function ProjectCard({ p, delay, onOpen }: { p: ShowcaseProject; delay: number; onOpen: (p: ShowcaseProject, b: HTMLButtonElement) => void }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(e) => onOpen(p, e.currentTarget)}
      className="group block w-full cursor-pointer text-left focus-visible:outline-none"
    >
      <div data-nd="clip" style={{ "--d": delay } as CSSProperties} className="nd-zoom relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#e9e7e1] shadow-[var(--sh-1)] transition-shadow duration-500 group-hover:shadow-[var(--sh-2)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[color:var(--royal)]">
        <div className="nd-settle absolute inset-0">
          <Pic image={p.cover} alt={p.alt} sizes="(min-width: 768px) 48vw, 94vw" imgClass="absolute inset-0 h-full w-full object-cover" />
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 inline-flex translate-y-3 items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-[opacity,transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:bg-[color:var(--royal)] group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          View project <Plus className="h-3 w-3" />
        </span>
      </div>
      <div data-nd="up" style={{ "--d": delay + 140 } as CSSProperties} className="mt-4 flex items-start justify-between gap-4 md:mt-5">
        <div className="min-w-0">
          <h3 className="text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em] text-[color:var(--ink)]">{p.client}</h3>
          <p className="mt-1.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-l)]">{p.category}</p>
        </div>
        <span aria-hidden="true" className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--line-l)] text-[color:var(--ink)] transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:border-[color:var(--royal)] group-hover:bg-[color:var(--royal)] group-hover:text-white">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </div>
      <span className="sr-only">: open a preview of {p.project}</span>
    </button>
  );
}

function Preview({ p, onClose }: { p: ShowcaseProject; onClose: () => void }) {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="flex items-center bg-[#efede8] p-2 sm:p-3">
        <Pic image={p.cover} alt={p.alt} sizes="(min-width: 1024px) 44rem, 100vw" imgClass="block aspect-[16/10] h-auto w-full rounded-[12px] object-cover" />
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="nd-label text-[color:var(--muted-l)]">{p.category}</p>
          <button type="button" onClick={onClose} className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--line-l)] transition-colors hover:border-[color:var(--royal)] hover:bg-[color:var(--royal)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--royal)]" aria-label="Close preview">
            <Plus className="h-3.5 w-3.5 rotate-45" />
          </button>
        </div>
        <h3 id="nd-work-dialog-title" className="mt-4 text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-semibold leading-[1] tracking-[-0.04em]">{p.client}</h3>
        <p className="mt-2 text-[1.0625rem] font-medium text-[color:var(--royal)]">{p.project}</p>
        <p className="mt-4 text-[1rem] leading-[1.6] text-[color:var(--muted-l)]">{p.summary}</p>
        <p className="nd-label mt-6">What we did</p>
        <ul role="list" className="mt-3 flex flex-wrap gap-2">
          {p.scope.map((s) => <li key={s} className="nd-pill rounded-full">{s}</li>)}
        </ul>
        <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--line-l)] pt-5 lg:mt-auto">
          {p.services.map((s) => (
            <Link key={s.href} href={s.href} className="nd-link w-fit text-[0.9375rem] font-medium">{s.label} <ArrowUR className="h-3.5 w-3.5" /></Link>
          ))}
          <Link href="/our-work/" className="nd-link nd-label w-fit text-[color:var(--royal)]">Explore all work <ArrowUR className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}
