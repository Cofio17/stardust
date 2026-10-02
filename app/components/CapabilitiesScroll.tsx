"use client";
import { ButtonLabel } from "./ButtonLabel";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { SectionSvgSystem } from "./SvgVisualSystem";

function CapabilitySketch({ active }: { active: number }) {
  const reducedMotion = useReducedMotion();
  type SketchPath = { d: string; active?: boolean; secondary?: boolean };
  const sketches: Array<{ paths: SketchPath[]; nodes: number[][]; signal: { x: number[]; y: number[] } }> = [
    // Three task lanes converge into one completed, owned workflow.
    {
      paths: [
        { d: "M12 18h34v18H12Z M12 51h34v18H12Z M12 84h34v18H12Z" },
        { d: "M19 27h18 M19 60h18 M19 93h18", secondary: true },
        { d: "M46 27h16q14 0 14 14v38q0 14-14 14H46", secondary: true },
        { d: "M46 60h68", active: true },
        { d: "M76 41v19 M76 79V60" },
        { d: "M114 38h44v44h-44Z" },
        { d: "m125 59 8 8 15-17", active: true },
        { d: "M158 60h14", active: true }
      ],
      nodes: [[76, 60], [172, 60]],
      signal: { x: [46, 76, 108], y: [60, 60, 60] }
    },
    // Interest becomes measurable momentum: an ascending launch trajectory.
    {
      paths: [
        { d: "M14 16v88h154" },
        { d: "M14 76h154 M14 48h154 M14 20h154", secondary: true },
        { d: "M35 104V85h18v19 M78 104V66h18v38 M121 104V39h18v65" },
        { d: "M24 90 51 79 91 54 155 18", active: true },
        { d: "m141 18 14 0-4 14", active: true },
        { d: "M91 47v14 M84 54h14" }
      ],
      nodes: [[51, 79], [91, 54], [155, 18]],
      signal: { x: [24, 51, 91, 155], y: [90, 79, 54, 18] }
    },
    // One customer context travels intact between three teams.
    {
      paths: [
        { d: "M10 42h36v36H10Z M72 42h36v36H72Z M134 42h36v36h-36Z" },
        { d: "M46 60h26 M108 60h26", active: true },
        { d: "M28 42V28q0-10 10-10h104q10 0 10 10v14", secondary: true },
        { d: "M28 78v14q0 10 10 10h104q10 0 10-10V78", secondary: true },
        { d: "M19 68q9-11 18 0 M81 68q9-11 18 0 M143 68q9-11 18 0" },
        { d: "M86 18h8 M90 14v8", active: true }
      ],
      nodes: [[28, 54], [90, 54], [152, 54]],
      signal: { x: [46, 72, 108, 134], y: [60, 60, 60, 60] }
    }
  ];
  const sketch = sketches[active];

  return (
    <svg aria-hidden="true" className="capability-sketch" viewBox="0 0 180 120">
      <AnimatePresence mode="sync">
        <motion.g key={active} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.15 }}>
          {sketch.paths.map((path, index) => (
            <motion.path
              animate={{ pathLength: 1, opacity: path.secondary ? 0.34 : 1 }}
              className={path.active ? "is-active" : path.secondary ? "is-secondary" : ""}
              d={path.d}
              exit={{ pathLength: 0, opacity: 0 }}
              initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
              key={path.d}
              transition={{ delay: reducedMotion ? 0 : index * 0.045, duration: reducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {sketch.nodes.map(([cx, cy], index) => (
            <motion.circle
              animate={{ opacity: 1, scale: 1 }}
              className={index === sketch.nodes.length - 1 ? "is-active" : ""}
              cx={cx}
              cy={cy}
              exit={{ opacity: 0, scale: 0.4 }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.4 }}
              key={`${cx}-${cy}`}
              r="3"
              transition={{ delay: reducedMotion ? 0 : 0.2 + index * 0.06, duration: reducedMotion ? 0 : 0.3 }}
            />
          ))}
          <motion.circle
            className="is-active"
            cx={sketch.signal.x[0]}
            cy={sketch.signal.y[0]}
            r="2.5"
            initial={false}
            whileInView={reducedMotion ? undefined : {
              cx: sketch.signal.x,
              cy: sketch.signal.y,
              opacity: [0, 1, 1, 0]
            }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 2.8, delay: 0.7, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
            style={{ opacity: reducedMotion ? 0 : undefined }}
          />
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
                <span className="capability-step-number">0{index + 1}</span><ButtonLabel>{item.title}</ButtonLabel>
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
