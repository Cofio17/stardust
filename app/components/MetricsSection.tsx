"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { SectionSvgSystem } from "./SvgVisualSystem";
import { siteContent, type Metric } from "../site-content";

/* One strip per digit column, built to travel in a single direction: even columns
   roll up, odd columns roll down. The strip holds exactly the digits passed through
   (wrapping via 9→0 or 0→9), so the direction never flips just because a digit
   happens to decrease. Equal digits get a full ten-step loop so nothing sits still. */
function buildStrip(from: number, to: number, rollUp: boolean) {
  const step = rollUp ? 1 : -1;
  const passed = [from];
  let digit = from;

  do {
    digit = (digit + step + 10) % 10;
    passed.push(digit);
  } while (digit !== to);

  return rollUp
    ? { cells: passed, rest: 0, slot: passed.length - 1 }
    : { cells: [...passed].reverse(), rest: passed.length - 1, slot: 0 };
}

function DigitRoll({
  delay,
  from,
  rollUp,
  to
}: {
  delay: number;
  from: number;
  rollUp: boolean;
  to: number;
}) {
  const { cells, rest, slot } = buildStrip(from, to, rollUp);
  /* Longer travel takes longer, so a digit crossing nine cells does not
     outrun one crossing two. */
  const duration = 1.15 + cells.length * 0.11;

  return (
    <span className="metric-digit">
      <span
        className="metric-digit-track"
        style={{
          "--delay": `${delay}s`,
          "--duration": `${duration}s`,
          "--rest": rest,
          "--slot": slot
        } as React.CSSProperties}
      >
        {cells.map((cell, position) => <span key={`${cell}-${position}`}>{cell}</span>)}
      </span>
    </span>
  );
}

function MetricFigure({ index, metric }: { index: number; metric: Metric }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(rowRef, { amount: 0.55, once: true });

  const target = String(metric.value).split("");
  const start = String(metric.from).padStart(target.length, "0").split("");

  return (
    <div className={`metric-figure metric-figure-${index % 2 === 0 ? "end" : "start"}`} ref={rowRef}>
      <span className="metric-index" aria-hidden="true">{`0${index + 1}`}</span>
      <p className="metric-value" aria-label={`${metric.value}${metric.suffix ?? ""}`}>
        {reducedMotion ? (
          <span aria-hidden="true" className="metric-reel">
            {metric.value}
            {metric.suffix ? <i className="metric-suffix">{metric.suffix}</i> : null}
          </span>
        ) : (
          <span aria-hidden="true" className="metric-reel" data-rolling={inView ? "true" : "false"}>
            {target.map((digit, column) => (
              <DigitRoll
                delay={index * 0.05 + column * 0.14}
                from={Number(start[column])}
                key={`${metric.label}-${column}`}
                rollUp={column % 2 === 0}
                to={Number(digit)}
              />
            ))}
            {metric.suffix ? <i className="metric-suffix">{metric.suffix}</i> : null}
          </span>
        )}
      </p>
      <h3>{metric.label}</h3>
      <p className="metric-note">{metric.note}</p>
    </div>
  );
}

export function MetricsSection() {
  return (
    <section className="metrics" id="numbers">
      <SectionSvgSystem className="metrics-system" kind="spine" />
      <div className="shell metrics-inner section-pad">
        <div className="metrics-head">
          <Reveal><p className="eyebrow metrics-eyebrow">The record so far</p></Reveal>
          <Reveal delay={0.06}><h2>Numbers we are<br />happy to be held to.</h2></Reveal>
        </div>
        <div className="metric-list">
          {siteContent.metrics.map((metric, index) => (
            <MetricFigure index={index} key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
