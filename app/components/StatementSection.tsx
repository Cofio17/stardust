"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { siteContent } from "../site-content";
import { SectionSvgSystem } from "./SvgVisualSystem";

export function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 88%", "end 18%"] });
  const clipPath = useTransform(scrollYProgress, [0.04, 0.58], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const copyX = useTransform(scrollYProgress, [0.14, 0.62], [-72, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.14, 0.55], [0, 1]);

  return (
    <section className="statement-wrap section-pad" ref={sectionRef}>
      <div className="statement shell">
        <motion.div className="statement-media" style={reducedMotion ? undefined : { clipPath }}>
          <motion.div className="statement-image" style={reducedMotion ? undefined : { scale: imageScale }}>
            <Image alt="Architectural forms connected by a bright route" fill sizes="(max-width: 900px) calc(100vw - 1.5rem), min(100vw - 2.5rem, 1440px)" src="/images/hero-structure.webp" />
          </motion.div>
        </motion.div>
        <div className="statement-wash" />
        <SectionSvgSystem className="statement-system" kind="decision" />
        <motion.div className="statement-inner" style={reducedMotion ? undefined : { x: copyX, opacity: copyOpacity }}>
          <p className="eyebrow">Give focus back to the work that matters</p>
          <h2>{siteContent.statement}</h2>
          <button className="button button-lime" data-open-contact type="button">Start a conversation <span aria-hidden="true">↗</span></button>
        </motion.div>
      </div>
    </section>
  );
}
