"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import wordmark from "./stardust-wordmark-paths.json";

export function ContactWordmark() {
  const reducedMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const width = Number(wordmark.viewBox.split(" ")[2]);
  const sweepWidth = width * 1.08;

  return (
    <div className="shell contact-wordmark">
      <motion.svg
        aria-label="StarDust Studio"
        role="img"
        className="contact-wordmark-svg"
        viewBox={wordmark.viewBox}
        initial={reducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        <defs>
          <linearGradient id={`${id}-feather`}>
            <stop offset="0" stopColor="white" />
            <stop offset="94%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id={`${id}-sweep`} maskUnits="userSpaceOnUse" x="0" y="0" width={sweepWidth} height="800">
            <motion.rect
              y="0"
              width={sweepWidth}
              height="800"
              fill={`url(#${id}-feather)`}
              variants={{
                hidden: { x: -sweepWidth },
                visible: { x: 0, transition: { duration: reducedMotion ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] } }
              }}
            />
          </mask>
        </defs>
        {/* One feathered sweep carries both the face and its subtle extrusion. */}
        <g mask={`url(#${id}-sweep)`} fill="currentColor">
          {[18, 12, 6].map(offset => (
            <g key={offset} transform={`translate(0 ${offset})`} opacity="0.16">
              {wordmark.paths.map((d, index) => <path d={d} key={index} />)}
            </g>
          ))}
          {wordmark.paths.map((d, index) => <path d={d} key={index} />)}
        </g>
      </motion.svg>
    </div>
  );
}
