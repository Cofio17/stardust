"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type AmbientLinesProps = {
  className?: string;
  variant?: "loop" | "route" | "wave";
};

const paths = {
  loop: "M-20 162C82 20 160 24 215 114c54 88 126 92 202 4 70-82 163-75 238 22 63 82 151 72 245-31 80-87 164-91 260-10",
  route: "M-35 210C84 203 121 77 239 88c93 9 102 124 221 109 128-17 155-165 298-134 99 22 116 122 234 113 73-6 122-44 188-113",
  wave: "M-10 70c110 134 201 153 286 55 88-101 184-97 286 18 93 105 190 99 285-18 77-94 168-86 333 42"
};

export function AmbientLines({ className = "", variant = "loop" }: AmbientLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0.05, 0.78], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [46, -46]);

  return (
    <motion.div
      aria-hidden="true"
      className={`ambient-lines ${className}`}
      ref={ref}
      style={reducedMotion ? undefined : { y }}
    >
      <svg preserveAspectRatio="none" viewBox="0 0 1180 260">
        <motion.path
          d={paths[variant]}
          pathLength={1}
          style={{ pathLength: reducedMotion ? 1 : pathLength }}
        />
        <motion.path
          className="ambient-lines-ghost"
          d={paths[variant]}
          pathLength={1}
          style={{ pathLength: reducedMotion ? 1 : pathLength }}
          transform="translate(0 16)"
        />
      </svg>
    </motion.div>
  );
}
