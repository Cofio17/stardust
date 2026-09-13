"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { SectionSvgSystem } from "./SvgVisualSystem";

function CapabilitySketch({ active }: { active: number }) {
  type SketchPath = { d: string; active?: boolean; secondary?: boolean };
  const sketches: Array<{ paths: SketchPath[]; nodes: number[][] }> = [
    {
      paths: [
        { d: "M8 27h31c13 0 13 18 26 18h22", secondary: true },
        { d: "M8 60h44c13 0 13-12 26-12h25" },
        { d: "M8 93h31c13 0 13-18 26-18h22", secondary: true },
        { d: "M87 31h32l15 15v42l-15 15H87" },
        { d: "M103 48v19c0 9 7 15 16 15h50", active: true }
      ],
      nodes: [[65, 45], [78, 48], [65, 75], [119, 82], [154, 82]]
    },
    {
      paths: [
        { d: "M8 31h35c16 0 14 22 30 22h18" },
        { d: "M8 60h83" },
        { d: "M8 89h35c16 0 14-22 30-22h18", secondary: true },
        { d: "M91 35c-19 10-19 40 0 50" },
        { d: "M105 45c-10 7-10 23 0 30" },
        { d: "M105 60h23c12 0 12-17 24-17h20", active: true }
      ],
      nodes: [[43, 31], [43, 60], [73, 67], [105, 60], [152, 43]]
    },
    {
      paths: [
        { d: "M8 25h34c13 0 13 19 26 19h22" },
        { d: "M8 60h82" },
        { d: "M8 95h34c13 0 13-19 26-19h22" },
        { d: "M90 44h18c12 0 12 16 24 16h40", active: true },
        { d: "M90 76h18c12 0 12-16 24-16", secondary: true },
        { d: "M42 25v70", secondary: true }
      ],
      nodes: [[42, 25], [42, 60], [42, 95], [90, 44], [90, 76], [132, 60]]
    }
  ];
  const sketch = sketches[active];

  return (
    <svg aria-hidden="true" className="capability-sketch" viewBox="0 0 180 120">
      <AnimatePresence mode="sync">
        <motion.g key={active}>
          {sketch.paths.map((path, index) => (
            <motion.path
              animate={{ pathLength: 1, opacity: path.secondary ? 0.34 : 1 }}
              className={path.active ? "is-active" : path.secondary ? "is-secondary" : ""}
              d={path.d}
              exit={{ pathLength: 0, opacity: 0 }}
              initial={{ pathLength: 0, opacity: 0 }}
              key={path.d}
              transition={{ delay: index * 0.07, duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {sketch.nodes.map(([cx, cy], index) => (
            <motion.circle
              animate={{ opacity: 1, scale: 1 }}
              className={index === sketch.nodes.length - 1 ? "is-active" : ""}
              cx={cx}
              cy={cy}
              exit={{ opacity: 0, scale: 0.4 }}
              initial={{ opacity: 0, scale: 0.4 }}
              key={`${cx}-${cy}`}
              r="3"
              transition={{ delay: 0.25 + index * 0.06, duration: 0.35 }}
            />
          ))}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

export function CapabilitiesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const step = useTransform(scrollYProgress, [0, 0.34, 0.66, 1], [0, 0, 1, 2]);
  const railScale = useTransform(scrollYProgress, [0.03, 0.95], [0, 1]);

  useMotionValueEvent(step, "change", (value) => {
    setActive(Math.min(siteContent.capabilities.length - 1, Math.max(0, Math.round(value))));
  });

  const capability = siteContent.capabilities[active];

  return (
    <section className="capabilities-scroll" id="how-we-work" ref={sectionRef}>
      <SectionSvgSystem className="capabilities-system" kind="routing" />
      <div className="capabilities-sticky shell">
        <div className="capabilities-heading">
          <Reveal><Eyebrow>Where we help</Eyebrow></Reveal>
          <Reveal delay={0.06}><h2>Fewer things<br />in the way.</h2></Reveal>
          <Reveal delay={0.12}><p>You feel a good system in the rhythm of a day: fewer interruptions, clearer ownership, and a list that finally gets shorter.</p></Reveal>
        </div>

        <div className="capabilities-story">
          <div className="capability-rail" aria-hidden="true">
            <motion.span style={{ scaleY: reducedMotion ? 1 : railScale }} />
          </div>
          <div className="capability-step-list" aria-label="Areas where we help">
            {siteContent.capabilities.map((item, index) => (
              <button
                aria-current={active === index ? "step" : undefined}
                className={active === index ? "is-active" : ""}
                key={item.title}
                onClick={() => setActive(index)}
                type="button"
              >
                <span>0{index + 1}</span>{item.title}
              </button>
            ))}
          </div>
          <div className="capability-story-card">
            <CapabilitySketch active={active} />
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                initial={{ opacity: 0, y: 28 }}
                key={capability.title}
                transition={{ duration: reducedMotion ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                <Eyebrow>{capability.eyebrow}</Eyebrow>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
                <ul>
                  {capability.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <span className="scroll-cue" aria-hidden="true">Scroll to explore <i>↓</i></span>
      </div>
    </section>
  );
}
