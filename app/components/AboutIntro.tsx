"use client";

import { animate, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ButtonLabel } from "./ButtonLabel";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import "./about-intro.css";

const paragraphs = [
  {
    lead: "We are StarDust, a small web studio that includes Me and myself and retard Devic.",
    rest: "Designers, developers and strategists with a soft spot for clean interfaces, fast pages and copy that says what it means."
  },
  {
    rest: "We help companies look sharp online and stay that way. Strategy, design and engineering sit at one table, so ideas move from sketch to launch without getting lost between departments."
  },
  {
    rest: "No ticket queues, no rotating juniors — you talk to the people who build your product. Honest, practical and focused on results."
  }
];

const stats = [
  { value: 2021, suffix: "", label: "Founded" },
  { value: 40, suffix: "+", label: "Websites launched" },
  { value: 25, suffix: "+", label: "Happy clients" }
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
    if (!inView) return;
    if (reducedMotion) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => setShown(Math.round(latest))
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return (
    <div className="about-intro-stat" ref={ref}>
      <p className="about-intro-stat-value">{shown}{suffix}</p>
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

          <div className="about-intro-stats">
            {stats.map(stat => <StatFigure key={stat.label} {...stat} />)}
          </div>

          <Reveal>
            <a className="button button-lime" href="#contact">
              <ButtonLabel>More about us <span aria-hidden="true" className="button-icon">→</span></ButtonLabel>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
