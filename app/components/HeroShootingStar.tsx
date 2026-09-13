"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useId, useRef } from "react";
import "./hero-shooting-star.css";

/* The star rides a quadratic Bézier that bows above its own chord, so it reads as
   an arc rather than the ruler-straight corner-to-corner line a linear tween gives.
   Head is at the local origin; the artwork extends backwards along -x, which lets
   the tangent angle drive `rotate` and keep the tail behind the head at all times. */

/** Where the star clears the top edge, as a fraction of hero height. */
const ENTRY = [-0.17, -0.03] as const;
/** How far the arc lifts off its own chord, as a fraction of the drop. */
const BOW = [0.3, 0.42] as const;
/** Seconds per crossing, then milliseconds of dark sky before the next one. */
const DURATION = [1.35, 1.75] as const;
const REST = [12000, 19000] as const;
/** Late enough to trail the headline reveal rather than race it. */
const FIRST_FLIGHT = 900;
/** Barely-there deceleration: enough to read as burning out, not as braking. */
const EASE = [0.22, 0.61, 0.36, 1] as const;

type Flight = { entry: number; bow: number; duration: number };

const rand = ([min, max]: readonly [number, number]) => min + Math.random() * (max - min);
/** Every crossing gets its own line, so repeats never retrace the last one. */
const flightOf = (): Flight => ({ entry: rand(ENTRY), bow: rand(BOW), duration: rand(DURATION) });

const at = (t: number, a: number, b: number, c: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
const slope = (t: number, a: number, b: number, c: number) =>
  2 * (1 - t) * (b - a) + 2 * t * (c - b);

export function HeroShootingStar() {
  const id = useId().replace(/:/g, "");
  const layerRef = useRef<HTMLDivElement>(null);
  const flight = useRef<Flight>(flightOf());
  const reducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);

  // Control points in hero pixels. The drop is capped against the width so the
  // descent stays a shallow diagonal instead of going near-vertical on a phone.
  const curve = () => {
    const w = width.get();
    const h = height.get();
    const x0 = -0.16 * w;
    const x2 = 1.16 * w;
    const drop = Math.min(1.06 * h, 0.72 * w);
    const y0 = flight.current.entry * h;
    return {
      x0,
      y0,
      x1: x0 + (x2 - x0) * 0.4,
      y1: y0 + drop * flight.current.bow,
      x2,
      y2: y0 + drop
    };
  };

  const x = useTransform(() => {
    const c = curve();
    return at(progress.get(), c.x0, c.x1, c.x2);
  });
  const y = useTransform(() => {
    const c = curve();
    return at(progress.get(), c.y0, c.y1, c.y2);
  });
  // Tangent of the same curve, so the star always points where it is going.
  const rotate = useTransform(() => {
    const t = progress.get();
    const c = curve();
    const dx = slope(t, c.x0, c.x1, c.x2);
    const dy = slope(t, c.y0, c.y1, c.y2);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  });

  const opacity = useTransform(progress, [0, 0.06, 0.52, 0.86, 1], [0, 1, 1, 0.42, 0]);
  // The tail whips out on ignition, then collapses back into the head as it burns off.
  const tail = useTransform(progress, [0, 0.13, 0.56, 1], [0.26, 1.06, 0.94, 0.16]);
  const head = useTransform(progress, [0, 0.11, 0.72, 1], [0.5, 1, 0.9, 0.28]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || reducedMotion) return;

    const measure = () => {
      width.set(layer.clientWidth);
      height.set(layer.clientHeight);
    };
    measure();

    let controls: { stop: () => void } | null = null;
    let timer = 0;
    let flying = false;
    let onScreen = true;
    let stopped = false;

    const canPlay = () => !stopped && onScreen && !document.hidden;

    const queue = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fire, delay);
    };

    function fire() {
      timer = 0;
      // Bail quietly - `sync` re-queues once the hero is back on screen.
      if (!canPlay()) return;
      flight.current = flightOf();
      flying = true;
      progress.set(0);
      controls = animate(progress, 1, {
        duration: flight.current.duration,
        ease: EASE,
        onComplete: () => {
          flying = false;
          queue(rand(REST));
        }
      });
    }

    // Nothing streaks past an unwatched hero: pause on a hidden tab or a scrolled-away
    // section. A hidden tab also parks the animation itself mid-flight, so `flying`
    // keeps the wake-up from queueing a second star on top of the frozen one.
    const sync = () => {
      if (canPlay()) {
        if (!timer && !flying) queue(rand(REST) / 2);
      } else {
        window.clearTimeout(timer);
        timer = 0;
      }
    };

    queue(FIRST_FLIGHT);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(layer);
    const viewObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    viewObserver.observe(layer);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      controls?.stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [height, progress, reducedMotion, width]);

  return (
    <div aria-hidden="true" className="hero-star-layer" ref={layerRef}>
      <motion.div className="hero-comet" style={{ x, y, rotate, opacity }}>
        <svg className="hero-shooting-star" fill="none" focusable="false" viewBox="-300 -20 328 40">
          <defs>
            {/* Two ramps over the same length: a wide, dim body and a tight hot core.
                Overlaid they read as light falling off, not as a filled wedge. */}
            <linearGradient gradientUnits="userSpaceOnUse" id={`${id}-body`} x1="-296" x2="0" y1="0" y2="0">
              <stop stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.34" stopColor="currentColor" stopOpacity="0.06" />
              <stop offset="0.7" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.34" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id={`${id}-core`} x1="-208" x2="0" y1="0" y2="0">
              <stop stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.46" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="0.8" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id={`${id}-halo`}>
              <stop stopColor="currentColor" stopOpacity="0.24" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Both needles stretch from their tip, which is the head. originX has to be
              set through motion because motion writes transform-origin inline itself. */}
          <motion.path
            d="M-296 0C-190-2.7-80-4.7 0-5.1L0 5.1C-80 4.7-190 2.7-296 0Z"
            fill={`url(#${id}-body)`}
            style={{ scaleX: tail, originX: 1, originY: 0.5 }}
          />
          <motion.path
            d="M-208 0C-130-0.7-58-1.5 0-1.7L0 1.7C-58 1.5-130 0.7-208 0Z"
            fill={`url(#${id}-core)`}
            style={{ scaleX: tail, originX: 1, originY: 0.5 }}
          />

          {/* Every shape below is centred on the head, so the default origin is right. */}
          <motion.g style={{ scale: head }}>
            <circle fill={`url(#${id}-halo)`} r="16" />
            {/* Four-point spark, stretched backwards so the head itself reads as speed. */}
            <path
              d="M-16 0C-4-0.7-1.3-2.9 0-7.4C1.3-2.9 4-0.7 10 0C4 0.7 1.3 2.9 0 7.4C-1.3 2.9-4 0.7-16 0Z"
              fill="currentColor"
            />
            {/* On paper the brightest point has to be the darkest one. */}
            <circle fill="#b8790b" r="2.1" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
