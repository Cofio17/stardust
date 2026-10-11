"use client";

import type { MotionValue } from "motion/react";
import { memo, useEffect, useRef } from "react";
import styles from "./services-cylinder.module.css";

function createParticles() {
  let seed = 8173;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 72 }, (_, index) => {
    const depth = index % 3;
    const x = random();
    const y = random();
    const center = Math.exp(-(((x - 0.5) / 0.3) ** 2 + ((y - 0.5) / 0.2) ** 2));
    return {
      depth, x: `${(x * 100).toFixed(3)}%`, y: `${(y * 100).toFixed(3)}%`,
      radius: Number((0.5 + depth * 0.3 + random() * 0.4).toFixed(3)),
      // Round transcendental math so Node and browser serialize identical SVG.
      opacity: Number(((0.35 + random() * 0.35) * (1 - center * 0.65)).toFixed(4)),
      color: index % 10 === 0 ? "var(--accent)" : index % 3 === 0 ? "#a9c8ff" : "var(--porcelain)",
      desktopOnly: index >= 32,
    };
  });
}

// Painted once. Only three HTML layers move, instead of repainting a full-size
// Canvas on every display frame alongside the cylinder's 3D text.
const particles = createParticles();

export const SpaceDust = memo(function SpaceDust({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-dust-layer]"));
    // Transform/opacity animations can run on the compositor, independent of
    // JavaScript frame work. No canvas, resize loop, blur, or per-particle layers.
    const animations = layers.map((layer, depth) => {
      const animation = layer.animate([
        { transform: "translate3d(-24px, 48px, 0)", opacity: 0.72 },
        { transform: "translate3d(24px, -48px, 0)", opacity: 1 },
      ], { duration: [26000, 18000, 12000][depth], iterations: Infinity, direction: "alternate", easing: "linear" });
      animation.pause();
      animation.currentTime = depth * 3100;
      return animation;
    });
    let onScreen = false;
    let playing = false;
    let rate = 1;
    let sampleTime = 0;
    let sampleProgress = scrollYProgress.get();
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    function setRate(next: number) {
      if (Math.abs(next - rate) < 0.05) return;
      rate = next;
      animations.forEach(animation => animation.updatePlaybackRate(next));
    }

    function settle() {
      setRate(Math.max(1, rate - 0.5));
      if (rate > 1) settleTimer = setTimeout(settle, 100);
    }

    function sync() {
      const wanted = onScreen && !document.hidden && !reducedMotion.matches;
      if (wanted === playing) return;
      playing = wanted;
      root!.dataset.running = String(playing);
      clearTimeout(settleTimer);
      setRate(1);
      sampleTime = performance.now();
      sampleProgress = scrollYProgress.get();
      animations.forEach(animation => playing ? animation.play() : animation.pause());
    }

    const unwatch = scrollYProgress.on("change", progress => {
      if (!playing) return;
      const time = performance.now();
      // At most ten small playback-rate updates per second during scrolling.
      if (time - sampleTime < 100) return;
      const velocity = Math.abs(progress - sampleProgress) / ((time - sampleTime) / 1000);
      sampleTime = time;
      sampleProgress = progress;
      clearTimeout(settleTimer);
      setRate(1 + Math.min(2, velocity * 10));
      settleTimer = setTimeout(settle, 150);
    });

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      clearTimeout(settleTimer);
      unwatch();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      animations.forEach(animation => animation.cancel());
    };
  }, [scrollYProgress]);

  return <div ref={rootRef} className={styles.dust} aria-hidden="true">
    {[0, 1, 2].map(depth => <div key={depth} data-dust-layer className={styles.dustLayer}>
      <svg width="100%" height="100%" focusable="false" aria-hidden="true">
        {particles.filter(particle => particle.depth === depth).map((particle, index) =>
          <g key={index} opacity={particle.opacity} fill={particle.color} className={particle.desktopOnly ? styles.dustDesktop : undefined}>
            {depth === 2 && <circle cx={particle.x} cy={particle.y} r={particle.radius * 3} opacity="0.1" />}
            <circle cx={particle.x} cy={particle.y} r={particle.radius} />
          </g>)}
      </svg>
    </div>)}
  </div>;
});
