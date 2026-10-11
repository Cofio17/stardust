"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

// The last thing on the page: the name, flat and oversized, cropped by the
// bottom edge. Decorative, since the footer brand already names the studio.
export function FooterWordmark() {
  const reducedMotion = useReducedMotion();
  // Watch the wrapper: the clipped text has no visible area until it reveals,
  // so observing it directly never reports it in view.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div aria-hidden="true" className="footer-wordmark" ref={ref}>
      {/* The tight line box is shorter than the glyphs, so the clip reaches past it. */}
      <motion.span
        animate={reducedMotion || inView ? { clipPath: "inset(-25% 0% -25% 0)" } : { clipPath: "inset(-25% 100% -25% 0)" }}
        initial={reducedMotion ? false : { clipPath: "inset(-25% 100% -25% 0)" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        StarDust
      </motion.span>
    </div>
  );
}
