"use client";

import { animate, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonLabel } from "./ButtonLabel";
import { Arrow } from "./Arrow";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import "./about-intro.css";

const paragraphs = [
  {
    lead: "We are StarDust Studio, a small team from Novi Sad, Serbia.",
    rest: "We design and build custom software for small and mid-sized businesses in the US and Europe."
  },
  {
    rest: "Websites and web applications, AI that works with your own data, and automation that connects the tools you already use. Engineering and project management sit at one table, so nothing gets lost between departments."
  },
  {
    rest: "You work directly with the people who build your product, from the first call to long after launch."
  }
];

const stats = [
  { value: 3, suffix: "", label: "People, one team" },
  { value: 5, suffix: "", label: "AI systems shipped to production" },
  { value: 2, suffix: "", label: "Markets: US and Europe" }
];

function splitWords(text: string) {
  return text.split(" ").filter(Boolean);
}

const totalWords = paragraphs.reduce(
  (total, paragraph) => total + splitWords(paragraph.lead ?? "").length + splitWords(paragraph.rest).length,
  0
);

function StatFigure({ value, suffix, label }: (typeof stats)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => setShown(Math.round(latest))
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <div className="about-intro-stat" ref={ref}>
      {/* Without motion the final figure shows as soon as it's in view; no count-up. */}
      <p className="about-intro-stat-value">{reducedMotion && inView ? value : shown}{suffix}</p>
      <p className="about-intro-stat-label">{label}</p>
    </div>
  );
}

export function AboutIntro() {
  const copyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [revealedWords, setRevealedWords] = useState(0);
  const { scrollYProgress } = useScroll({
    target: copyRef,
    // Finish the sweep when the middle of the copy reaches the viewport center.
    offset: ["start 0.9", "center 0.5"]
  });
  useMotionValueEvent(scrollYProgress, "change", progress => {
    setRevealedWords(Math.ceil(Math.max(0, Math.min(1, progress)) * totalWords));
  });
  const lit = reducedMotion || revealedWords === totalWords;

  // One running index across every paragraph for a continuous scroll-driven sweep.
  let index = 0;
  const renderWords = (text: string) =>
    splitWords(text).map(word => {
      const i = index++;
      return (
        <span className={`about-intro-word${i < revealedWords ? " is-lit" : ""}`} key={i}>
          {word}{" "}
        </span>
      );
    });

  return (
    <section aria-labelledby="about-intro-title" className="about-intro section-light section-pad" id="about">
      <div className="shell">
        <div className="about-intro-inner">
          <Reveal className="about-intro-eyebrow"><Eyebrow>Who we are</Eyebrow></Reveal>
          <div className={`about-intro-copy${lit ? " is-lit" : ""}`} ref={copyRef}>
            {paragraphs.map((paragraph, p) => (
              <p key={p}>
                {paragraph.lead ? <strong className="about-intro-lead" id="about-intro-title">{renderWords(paragraph.lead)}</strong> : null}
                {renderWords(paragraph.rest)}
              </p>
            ))}
          </div>

          {/* <div className="about-intro-stats">
            {stats.map(stat => <StatFigure key={stat.label} {...stat} />)}
          </div> */}

          <Reveal>
            <a className="button button-lime" href="#contact">
              <ButtonLabel>More about us <span aria-hidden="true" className="button-icon"><Arrow direction="right" /></span></ButtonLabel>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
