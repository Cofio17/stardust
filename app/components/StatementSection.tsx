"use client";
import { ButtonLabel } from "./ButtonLabel";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";

/* The banner opens itself in two movements, both lifted from the reference CTA:

   1. Copy entrance - once the banner is a fifth of the way on screen, the wash
      and the three copy pieces each fade up over 0.8s, offset 0s / 0.3s / 0.6s.
      Timing lives in CSS; script only arms and releases it.

   2. Scroll-scrubbed expand - over the 30vh after the banner's centre passes
      70% of the viewport, the card tweens from inset-and-rounded to full bleed,
      and the copy block picks up matching margin so it never hugs the edge.
      The copy block starts 0.05s into that timeline, so it trails the card. */

const ENTER_AT = 0.2; // fraction of the banner on screen that releases the copy
const MIN_SCROLL = 200; // never start the expand above this scroll position
const SCRUB = 0.8; // seconds for the scrubbed value to catch up to the scroll
const TWEEN = 0.5; // length of each tween on the expand timeline
const CONTAINER_OFFSET = 0.05; // the copy block's head start on that timeline
const TIMELINE = TWEEN + CONTAINER_OFFSET;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const powerOut = (t: number) => 1 - (1 - t) ** 2;

type RestState = {
  maxWidth: number;
  marginTop: number;
  marginBottom: number;
  borderRadius: number;
};

/** Measures the card as CSS leaves it, with any scrubbed inline styles lifted. */
function readRestState(bg: HTMLElement): RestState {
  const inline = bg.style.cssText;
  bg.style.cssText = "";
  const cs = getComputedStyle(bg);
  const rest = {
    maxWidth: parseFloat(cs.maxWidth) || bg.clientWidth,
    marginTop: parseFloat(cs.marginTop),
    marginBottom: parseFloat(cs.marginBottom),
    borderRadius: parseFloat(cs.borderTopLeftRadius)
  };
  bg.style.cssText = inline;
  return rest;
}

export function StatementSection() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bannerRef.current;
    const inner = innerRef.current;
    if (!bg || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    bg.classList.add("is-armed");

    /* --- 1. Copy entrance --- */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < ENTER_AT) return;
        bg.classList.add("is-copy-shown");
        observer.disconnect();
      },
      { threshold: [ENTER_AT] }
    );
    observer.observe(bg);

    /* --- 2. Scroll-scrubbed expand --- */
    let rest = readRestState(bg);
    let fullWidth = bg.parentElement?.clientWidth ?? rest.maxWidth;
    let pad = 0;
    let current = 0;
    let applied = -1;
    let frame = 0;
    let last = 0;

    // Where the expand runs: from the banner's centre reaching 70% down the
    // viewport, over the next 30vh of scroll.
    const range = () => {
      const rect = bg.getBoundingClientRect();
      const centre = rect.top + window.scrollY + rect.height / 2;
      const start = Math.max(centre - window.innerHeight * 0.7, MIN_SCROLL);
      return { start, end: start + window.innerHeight * 0.3 };
    };

    const target = () => {
      const { start, end } = range();
      return clamp01((window.scrollY - start) / Math.max(end - start, 1));
    };

    const apply = () => {
      if (Math.abs(current - applied) < 0.0005) return;
      applied = current;

      const time = current * TIMELINE;
      const card = powerOut(clamp01(time / TWEEN));
      const copy = powerOut(clamp01((time - CONTAINER_OFFSET) / TWEEN));

      bg.style.maxWidth = card > 0.999 ? "100%" : `${rest.maxWidth + (fullWidth - rest.maxWidth) * card}px`;
      bg.style.marginTop = `${rest.marginTop * (1 - card)}px`;
      bg.style.marginBottom = `${rest.marginBottom * (1 - card)}px`;
      bg.style.borderRadius = `${rest.borderRadius * (1 - card)}px`;
      inner.style.marginTop = `${pad * copy}px`;
      inner.style.marginBottom = `${pad * copy}px`;
    };

    // Re-reads the card's CSS rest state, then snaps to where the scroll
    // already is - a resize, or a load part-way down the page, should not
    // replay the expand.
    const measure = () => {
      bg.style.cssText = "";
      inner.style.cssText = "";
      applied = -1;
      rest = readRestState(bg);
      fullWidth = bg.parentElement?.clientWidth ?? rest.maxWidth;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      pad = (window.matchMedia("(max-width: 479px)").matches ? 2 : 4) * rem;
      current = target();
      apply();
    };

    // The scrub is an exponential chase rather than a hard snap, so the card
    // trails the wheel by roughly SCRUB seconds the way the reference does.
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
      last = now;
      const to = target();
      current += (to - current) * (1 - Math.exp((-dt * 4.6) / SCRUB));
      apply();
      if (Math.abs(to - current) > 0.0005) {
        frame = requestAnimationFrame(tick);
      } else {
        current = to;
        apply();
        frame = 0;
      }
    };

    const wake = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      measure();
      wake();
    };

    measure();
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="statement-wrap">
      <div className="statement" ref={bannerRef}>
        <div className="statement-media">
          <div className="statement-image">
            <Image alt="A studio team and client working together on a website built around their business" fill sizes="(max-width: 900px) 100vw, min(100vw, 1440px)" src="/images/studio/partnership.webp" />
          </div>
        </div>
        <div className="statement-wash" />
        <div className="statement-inner" ref={innerRef}>
          <Eyebrow>Built around how you actually work</Eyebrow>
          <h2>{siteContent.statement}</h2>
          <button className="button button-lime" data-open-contact type="button"><ButtonLabel>Start a conversation <span aria-hidden="true">↗</span></ButtonLabel></button>
        </div>
      </div>
    </section>
  );
}
