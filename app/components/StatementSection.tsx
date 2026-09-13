"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { SectionSvgSystem } from "./SvgVisualSystem";

const DRAW_AT = 0.2;

function visibleRatio(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  if (!rect.height) return 0;
  const shown = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  return Math.max(0, shown) / rect.height;
}

export function StatementSection() {
  const bannerRef = useRef<HTMLDivElement>(null);

  // The banner draws itself in with one left-to-right clip-path wipe (the wipe
  // lives in CSS). It is armed from script and only while it is still below the
  // fold, so a banner already on screen — or one whose script never runs — is
  // simply shown rather than left clipped away.
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (visibleRatio(el) > DRAW_AT) return;

    el.classList.add("is-armed");

    const draw = () => {
      if (visibleRatio(el) <= DRAW_AT) return;
      el.classList.add("is-drawn");
      stop();
    };
    const stop = () => {
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", draw);
    };

    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
    return stop;
  }, []);

  return (
    <section className="statement-wrap section-pad">
      <div className="statement shell" ref={bannerRef}>
        <div className="statement-media">
          <div className="statement-image">
            <Image alt="Architectural forms connected by a bright route" fill sizes="(max-width: 900px) calc(100vw - 1.5rem), min(100vw - 2.5rem, 1440px)" src="/images/hero-structure.webp" />
          </div>
        </div>
        <div className="statement-wash" />
        {/* <SectionSvgSystem className="statement-system" kind="decision" />  */}
        <div className="statement-inner">
          <Eyebrow>Give focus back to the work that matters</Eyebrow>
          <h2>{siteContent.statement}</h2>
          <button className="button button-lime" data-open-contact type="button">Start a conversation <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
  );
}
