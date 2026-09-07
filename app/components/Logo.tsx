"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type LogoProps = {
  /** "accent" gives the core an amber fill. "mono" keeps everything in currentColor —
   *  use it wherever amber already means something else, such as the nav CTA. */
  variant?: "accent" | "mono";
  /** Drop the symbol and render the name only. */
  mark?: boolean;
  className?: string;
};

export function Logo({ variant = "accent", mark = true, className = "" }: LogoProps) {
  const reducedMotion = useReducedMotion();

  return (
    <span className={`logo-lockup${className ? ` ${className}` : ""}`}>
      {mark ? (
        <span className="logo-mark-wrap">
          <motion.svg
            aria-hidden="true"
            className="logo-mark"
            fill="none"
            initial={reducedMotion ? false : { rotate: -108, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            viewBox="0 0 64 64"
            viewport={{ once: true, amount: 0.5 }}
            whileInView={reducedMotion ? undefined : { rotate: 0, scale: 1, opacity: 1 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="currentColor" strokeLinecap="round" strokeWidth="2.2">
              <path d="M32 32L32 14" />
              <path d="M32 32L47.6 23" />
              <path d="M32 32L47.6 41" />
              <path d="M32 32L32 50" />
              <path d="M32 32L16.4 41" />
              <path d="M32 32L16.4 23" />
            </g>
            <g fill="currentColor">
              <circle cx="32" cy="11" r="2.7" />
              <circle cx="50.2" cy="21.5" r="2.7" />
              <circle cx="50.2" cy="42.5" r="2.7" />
            </g>
            <g fill="none" opacity="0.55" stroke="currentColor" strokeWidth="1.9">
              <circle cx="32" cy="53" r="2.3" />
              <circle cx="13.8" cy="42.5" r="2.3" />
              <circle cx="13.8" cy="21.5" r="2.3" />
            </g>
            <motion.circle
              className="logo-core"
              cx="32"
              cy="32"
              fill={variant === "accent" ? "var(--accent)" : "currentColor"}
              initial={reducedMotion ? false : { scale: 0 }}
              r="5.2"
              transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
              viewport={{ once: true, amount: 0.5 }}
              whileInView={reducedMotion ? undefined : { scale: 1 }}
            />
          </motion.svg>
        </span>
      ) : null}
      <span className="logo-word">
        StarDust<span>Studio</span>
      </span>
    </span>
  );
}
