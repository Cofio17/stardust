"use client";
import { ButtonLabel } from "./ButtonLabel";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    setVisible(currentScrollY > 600);
  });

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: shouldReduceMotion ? 0 : 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 4)
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="Back to top"
          className="scroll-top"
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          onClick={scrollToTop}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          type="button"
        >
          <ButtonLabel><svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path
              d="M12 19V5M12 5l-6 6M12 5l6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg></ButtonLabel>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
