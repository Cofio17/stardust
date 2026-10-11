"use client";

import Image from "next/image";
import { animate, motion, useInView, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { illustrationScenes, type IllustrationKind, type IllustrationLayer, type IllustrationReveal } from "./service-illustration-scenes";
import "./service-illustration.css";

const SIZE = 1254;
const DURATION = 1.6;
const imageSizes = "(max-width: 600px) 85vw, (max-width: 1000px) 46vw, (max-width: 1480px) 38vw, 560px";
function mediaStore(media: string) {
  return {
    subscribe(callback: () => void) {
      const query = window.matchMedia(media);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    snapshot: () => window.matchMedia(media).matches,
  };
}
const pointerStore = mediaStore("(hover: hover) and (pointer: fine)");
const reducedMotionStore = mediaStore("(prefers-reduced-motion: reduce)");
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
const readVisibility = () => !document.hidden;
const serverMedia = () => false;
const serverVisibility = () => true;

type Orbit = NonNullable<IllustrationLayer["orbit"]>;

function orbitPoint({ center, radii, tilt }: Orbit, angle: number) {
  const t = tilt * Math.PI / 180;
  const x = radii[0] * Math.cos(angle);
  const y = radii[1] * Math.sin(angle);
  return [center[0] + x * Math.cos(t) - y * Math.sin(t), center[1] + x * Math.sin(t) + y * Math.cos(t)];
}

/** The ellipse angle nearest a point, so a piece leaves from where it rests. */
function orbitAngle({ center, radii, tilt }: Orbit, [px, py]: [number, number]) {
  const t = tilt * Math.PI / 180;
  const dx = px - center[0];
  const dy = py - center[1];
  return Math.atan2((-dx * Math.sin(t) + dy * Math.cos(t)) / radii[1], (dx * Math.cos(t) + dy * Math.sin(t)) / radii[0]);
}

function MovingPiece({ layer, loop, source, clipId, phase, strength }: {
  layer: IllustrationLayer; loop: boolean; source: string; clipId: string;
  phase: MotionValue<number>; strength: MotionValue<number>;
}) {
  const group = useRef<SVGGElement>(null);
  useEffect(() => {
    const [cx, cy] = layer.pivot ?? [0, 0];
    const restAngle = layer.orbit ? orbitAngle(layer.orbit, [cx, cy]) : 0;
    const restPoint = layer.orbit ? orbitPoint(layer.orbit, restAngle) : [0, 0];
    const update = () => {
      const progress = phase.get();
      const amount = strength.get();
      const delay = layer.delay ?? 0;
      // A looping scene repeats each pulse `cycles` times; a single cycle
      // squeezes it into what remains after the delay.
      const local = loop
        ? (((progress * (layer.cycles ?? 1) - delay) % 1) + 1) % 1
        : Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const pulse = Math.sin(Math.PI * local) ** 2 * amount;
      const float = layer.float ? -16 * Math.sin(Math.PI * progress) ** 2 * amount : 0;
      let orbitX = 0;
      let orbitY = 0;
      let scale = 1;
      if (layer.orbit) {
        const angle = restAngle + layer.orbit.direction * 2 * Math.PI * progress;
        const [x, y] = orbitPoint(layer.orbit, angle);
        orbitX = (x - restPoint[0]) * amount;
        orbitY = (y - restPoint[1]) * amount;
        // The lower arc is the near side: sin grows towards the viewer.
        scale = 1 + layer.orbit.depth * (Math.sin(angle) - Math.sin(restAngle)) * amount;
      }
      group.current?.setAttribute("transform", `translate(${(layer.x ?? 0) * pulse + orbitX} ${(layer.y ?? 0) * pulse + float + orbitY}) translate(${cx} ${cy}) rotate(${(layer.rotate ?? 0) * pulse}) scale(${scale} ${scale * (1 + (layer.scaleY ?? 0) * pulse)}) translate(${-cx} ${-cy})`);
    };
    // Motion drives the clock, while native SVG transforms retain user-space
    // hinges regardless of CSS transform-box or the crop used by the card.
    update();
    const unwatchPhase = phase.on("change", update);
    const unwatchStrength = strength.on("change", update);
    return () => { unwatchPhase(); unwatchStrength(); };
  }, [layer, loop, phase, strength]);
  return <g ref={group} data-illustration-piece={layer.id}>
    <image href={source} width={SIZE} height={SIZE} clipPath={`url(#${clipId})`} />
  </g>;
}

/** Draws hidden ink back in: each stroke unrolls a mask over the original pixels. */
function DrawnInk({ reveal, source, clipId, maskId, phase }: {
  reveal: IllustrationReveal; source: string; clipId: string; maskId: string; phase: MotionValue<number>;
}) {
  const strokes = useRef<(SVGPathElement | null)[]>([]);
  useEffect(() => {
    const update = () => {
      const drawn = Math.max(0, Math.min(1, (phase.get() - reveal.start) / (reveal.end - reveal.start)));
      reveal.strokes.forEach((stroke, index) => {
        const path = strokes.current[index];
        if (!path) return;
        const local = Math.max(0, Math.min(1, (drawn - stroke.from) / Math.max(1e-6, stroke.to - stroke.from)));
        path.setAttribute("stroke-dashoffset", String(1 - local));
        // A round cap would still paint a dot for an empty dash.
        path.setAttribute("stroke-opacity", local > 0 ? "1" : "0");
      });
    };
    update();
    return phase.on("change", update);
  }, [phase, reveal]);
  return <>
    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
      {reveal.strokes.map((stroke, index) => <path key={index} ref={path => { strokes.current[index] = path; }}
        d={stroke.d} fill="none" stroke="white" strokeWidth={reveal.width} strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} strokeOpacity={0} />)}
    </mask>
    <image href={source} width={SIZE} height={SIZE} clipPath={`url(#${clipId})`} mask={`url(#${maskId})`} />
  </>;
}

export type ServiceIllustrationProps = {
  kind: IllustrationKind;
  src: string;
  alt: string;
  active?: boolean;
  suspended?: boolean;
  /**
   * "hover" loops while a fine pointer rests on the card and plays once per
   * activation on touch. "view" plays once each time the artwork scrolls into
   * view, on every device, for artwork that is not a card.
   */
  trigger?: "hover" | "view";
  sizes?: string;
  /** Development comparison can inspect a single frame without a running clock. */
  previewProgress?: number;
};

export function ServiceIllustration({ kind, src, alt, active = false, suspended = false, trigger = "hover", sizes = imageSizes, previewProgress }: ServiceIllustrationProps) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const scene = illustrationScenes[kind];
  const reducedMotion = useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.snapshot, serverMedia);
  const visible = useInView(root, { amount: 0.6 });
  const finePointer = useSyncExternalStore(pointerStore.subscribe, pointerStore.snapshot, serverMedia);
  const playOnce = trigger === "view" || !finePointer;
  const duration = scene.duration ?? DURATION;
  // A looping scene in view keeps going; everything else follows the trigger.
  const continuous = !!scene.loop && trigger === "view";
  const once = !continuous && playOnce;
  const drawsInk = !!scene.reveals?.length;
  const cutouts = [
    ...scene.layers.map(layer => ({ id: layer.id, path: layer.path })),
    ...(scene.reveals ?? []).map(reveal => ({ id: reveal.id, path: reveal.area })),
    ...(scene.erase ?? []).map((path, index) => ({ id: `erase-${index}`, path })),
  ];
  const documentVisible = useSyncExternalStore(subscribeVisibility, readVisibility, serverVisibility);
  const [source, setSource] = useState("");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const mobilePlayed = useRef(false);
  const phase = useMotionValue(0);
  const strength = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    const target = root.current?.closest<HTMLElement>("[data-service-card]") ?? root.current;
    if (!target) return;
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") setHovered(true); };
    const leave = () => setHovered(false);
    const focus = () => setFocused(target.matches(":focus-visible") || !!target.querySelector(":focus-visible"));
    const blur = (event: FocusEvent) => {
      if (!target.contains(event.relatedTarget as Node | null)) setFocused(false);
    };
    target.addEventListener("pointerenter", enter);
    target.addEventListener("pointerleave", leave);
    target.addEventListener("focusin", focus);
    target.addEventListener("focusout", blur);
    const initialPointer = requestAnimationFrame(() => {
      if (pointerStore.snapshot() && target.matches(":hover")) setHovered(true);
      focus();
    });
    return () => {
      cancelAnimationFrame(initialPointer);
      target.removeEventListener("pointerenter", enter);
      target.removeEventListener("pointerleave", leave);
      target.removeEventListener("focusin", focus);
      target.removeEventListener("focusout", blur);
    };
  }, []);

  useEffect(() => {
    // Re-entry (or returning to a slide) permits a new mobile cycle. Finishing
    // a cycle and unrelated React renders do not start another one.
    if (!active || !visible) mobilePlayed.current = false;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let clock: ReturnType<typeof animate> | undefined;
    let ramp: ReturnType<typeof animate> | undefined;
    const status = (value: string) => root.current?.setAttribute("data-motion-state", value);
    const reset = () => {
      opacity.set(0);
      phase.set(0);
      strength.set(0);
      status("idle");
    };
    const allowed = ready && !failed && visible && documentVisible && !suspended && !reducedMotion;
    const wanted = allowed && (continuous || (once ? active && !mobilePlayed.current : hovered || focused));
    // Ink that will be drawn waits hidden while the artwork is out of view, so
    // it is never seen to vanish before it is drawn.
    const waiting = once && drawsInk && ready && !failed && !reducedMotion && !mobilePlayed.current;

    const begin = () => {
      if (cancelled) return;
      if (once) mobilePlayed.current = true;
      status(once ? "playing-once" : "looping");
      opacity.set(1);
      ramp = animate(strength, 1, { duration: continuous ? 0.5 : 0.16, ease: "easeOut" });
      // Finish an interrupted cycle first, then repeat from zero. Every layer
      // is at rest at both ends, so re-entering during the return never jumps.
      clock = animate(phase, 1, {
        duration: Math.max(0.05, (1 - phase.get()) * duration), ease: "linear",
        onComplete: () => {
          if (cancelled) return;
          phase.set(0);
          if (!once) clock = animate(phase, 1, { duration, ease: "linear", repeat: Infinity });
          else reset();
        },
      });
    };

    if (previewProgress !== undefined && ready && !failed && !reducedMotion) {
      strength.set(1);
      opacity.set(1);
      phase.set(Math.max(0, Math.min(1, previewProgress)));
      status("preview-frame");
    } else if (wanted) {
      if (!once) begin();
      else timer = setTimeout(begin, 180);
    } else if (!allowed) {
      reset();
      if (waiting) {
        opacity.set(1);
        status("waiting");
      }
    } else {
      status("returning");
      ramp = animate(strength, 0, { duration: 0.4, ease: "easeOut", onComplete: reset });
    }
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      clock?.stop();
      ramp?.stop();
    };
  }, [active, continuous, documentVisible, drawsInk, duration, failed, focused, hovered, once, opacity, phase, previewProgress, ready, reducedMotion, strength, suspended, visible]);

  // Critical geometry belongs in the server HTML: lazy images and SVG layers
  // must stay inside the reserved frame even before the stylesheet is ready.
  return <div className="service-illustration" data-illustration={kind} ref={root}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
    <Image alt={alt} className="service-card-media service-illustration-original" decoding="async" draggable={false}
      fill loading="lazy" sizes={sizes} src={src} style={{ objectFit: "cover", transform: "none" }}
      onLoad={event => {
        const nextSource = event.currentTarget.currentSrc;
        if (nextSource !== source) {
          setReady(false);
          setSource(nextSource);
        }
      }} />
    {source && !failed && <motion.svg aria-hidden="true" focusable="false" className="service-illustration-layers"
      width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid slice"
      style={{ opacity, position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", overflow: "hidden", pointerEvents: "none" }}>
      <defs>
        <pattern id={`${id}-paper`} patternUnits="userSpaceOnUse" width={SIZE} height="240">
          <image href={source} width={SIZE} height={SIZE} />
        </pattern>
        <mask id={`${id}-stationary`} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
          <rect width={SIZE} height={SIZE} fill="white" />
          {cutouts.map(cutout => <path key={cutout.id} d={cutout.path} fill="black" />)}
        </mask>
        <clipPath id={`${id}-holes`}>
          {cutouts.map(cutout => <path key={cutout.id} d={cutout.path} />)}
        </clipPath>
        {cutouts.map(cutout => <clipPath id={`${id}-${cutout.id}`} key={cutout.id}><path d={cutout.path} /></clipPath>)}
      </defs>
      <rect width={SIZE} height={SIZE} fill={`url(#${id}-paper)`} />
      <image href={source} width={SIZE} height={SIZE} mask={`url(#${id}-stationary)`}
        onLoad={() => setReady(true)} onError={() => setFailed(true)} />
      {scene.repairs && <g clipPath={`url(#${id}-holes)`}>
        {scene.repairs.map((repair, index) => <path key={index} d={repair.path} fill={repair.fill ?? "none"}
          stroke={repair.stroke} strokeWidth={repair.width} strokeDasharray={repair.dash} strokeLinecap="round" strokeLinejoin="round" />)}
      </g>}
      {scene.reveals?.map(reveal => <DrawnInk clipId={`${id}-${reveal.id}`} key={reveal.id} maskId={`${id}-${reveal.id}-ink`}
        phase={phase} reveal={reveal} source={source} />)}
      {scene.layers.map(layer => <MovingPiece clipId={`${id}-${layer.id}`} key={layer.id} layer={layer}
        loop={continuous} source={source} phase={phase} strength={strength} />)}
    </motion.svg>}
  </div>;
}
