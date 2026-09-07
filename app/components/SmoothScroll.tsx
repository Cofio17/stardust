"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

export function SmoothScroll({ children }: Readonly<{ children: React.ReactNode }>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        anchors: true,
        autoRaf: true,
        lerp: shouldReduceMotion ? 1 : 0.085,
        smoothWheel: !shouldReduceMotion,
        wheelMultiplier: 0.92
      }}
    >
      {children}
    </ReactLenis>
  );
}
