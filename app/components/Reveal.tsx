"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { ReactNode, useRef } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const maskRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(maskRef, { amount: 0.28, once: true });

  return (
    <div className={`reveal-mask ${className}`} ref={maskRef}>
      <motion.div
        animate={reducedMotion || inView ? { y: "0%", opacity: 1 } : { y: "112%", opacity: 0 }}
        initial={reducedMotion ? false : { y: "112%", opacity: 0 }}
        transition={{ duration: 0.82, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
