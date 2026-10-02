"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { CSSProperties } from "react";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { SectionSvgSystem } from "./SvgVisualSystem";
import { siteContent, type Metric } from "../site-content";

function MetricFigure({ metric }: { metric: Metric }) {
  const rowRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  // Blueprint reveals each row between entering the viewport and its bottom
  // reaching the viewport midpoint. Scrolling back reverses the same animation.
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start end", "end center"] });
  const reveal = useTransform(scrollYProgress, progress => {
    const t = Math.max(0, Math.min(1, progress));
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  });

  return (
    <motion.article className="metric-figure" ref={rowRef}
      style={{ "--metric-progress": reducedMotion ? 1 : reveal } as CSSProperties}>
      <p className="metric-value">
        {metric.value}{metric.suffix ? <span className="metric-suffix">{metric.suffix}</span> : null}
      </p>
      <div className="metric-copy">
        <h3>{metric.label}</h3>
        <p className="metric-note">{metric.note}</p>
      </div>
    </motion.article>
  );
}

export function MetricsSection() {
  return (
    <section aria-labelledby="numbers-title" className="metrics" id="numbers">
      <SectionSvgSystem className="metrics-system" kind="spine" />
      <div className="shell metrics-inner section-pad">
        <div className="metrics-head">
          <Reveal><Eyebrow className="metrics-eyebrow" variant="mono">The record so far</Eyebrow></Reveal>
          <Reveal delay={0.06}><h2 id="numbers-title">Young company.<br />Honest numbers.</h2></Reveal>
        </div>
        <div className="metric-list">
          {siteContent.metrics.map(metric => <MetricFigure key={metric.label} metric={metric} />)}
        </div>
      </div>
    </section>
  );
}
