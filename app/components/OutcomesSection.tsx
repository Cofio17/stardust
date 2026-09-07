"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "../site-content";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";
import { FeatureSystemIcon, SectionSvgSystem, type FeatureIconKind } from "./SvgVisualSystem";

const iconKinds: FeatureIconKind[] = ["signal", "momentum", "handoff", "clarity"];

export function OutcomesSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="outcomes section-light section-pad" id="what-we-solve">
      <SectionSvgSystem className="outcomes-system" kind="spine" />
      <div className="shell outcomes-inner">
        <div className="section-intro">
          <div>
            <Reveal><p className="eyebrow">What changes</p></Reveal>
            <Reveal delay={0.06}><h2>Less effort.<br />More movement.</h2></Reveal>
          </div>
          <Reveal delay={0.12}>
            <p>When the small frictions add up, the whole business feels slower than it should. We make the better path easier to take.</p>
          </Reveal>
        </div>
        <div className="outcome-grid">
          {siteContent.outcomes.map((outcome, index) => (
            <motion.article
              className={`outcome-card-new outcome-${outcome.accent}`}
              initial={reducedMotion ? false : { y: 46, opacity: 0 }}
              key={outcome.title}
              transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ amount: 0.25, once: true }}
              whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
            >
              <div className="outcome-card-top">
                <span className="outcome-index">0{index + 1}</span>
                <FeatureSystemIcon kind={iconKinds[index]} />
              </div>
              <div className="outcome-card-copy">
                <p className="card-note">{outcome.note}</p>
                <h3>{outcome.title}</h3>
                <p className="outcome-description">{outcome.description}</p>
              </div>
              <span aria-hidden="true" className="outcome-card-wordmark wordmark">
                <Logo mark={false} variant="mono" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
