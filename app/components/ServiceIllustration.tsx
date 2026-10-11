"use client";

import Image from "next/image";
import { animate, motion, useInView, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { illustrationScenes, type IllustrationKind, type IllustrationLayer } from "./service-illustration-scenes";
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

function MovingPiece({ layer, source, clipId, phase, strength }: {
  layer: IllustrationLayer; source: string; clipId: string;
  phase: MotionValue<number>; strength: MotionValue<number>;
}) {
  const group = useRef<SVGGElement>(null);
  useEffect(() => {
    const update = () => {
      const progress = phase.get();
      const delay = layer.delay ?? 0;
      const local = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      const pulse = Math.sin(Math.PI * local) ** 2 * strength.get();
      const float = layer.float ? -16 * Math.sin(Math.PI * progress) ** 2 * strength.get() : 0;
      const [cx, cy] = layer.pivot ?? [0, 0];
      group.current?.setAttribute("transform", `translate(${(layer.x ?? 0) * pulse} ${(layer.y ?? 0) * pulse + float}) translate(${cx} ${cy}) rotate(${(layer.rotate ?? 0) * pulse}) scale(1 ${1 + (layer.scaleY ?? 0) * pulse}) translate(${-cx} ${-cy})`);
    };
    // Motion drives the clock, while native SVG transforms retain user-space
    // hinges regardless of CSS transform-box or the crop used by the card.
    update();
    const unwatchPhase = phase.on("change", update);
    const unwatchStrength = strength.on("change", update);
    return () => { unwatchPhase(); unwatchStrength(); };
  }, [layer, phase, strength]);
  return <g ref={group} data-illustration-piece={layer.id}>
    <image href={source} width={SIZE} height={SIZE} clipPath={`url(#${clipId})`} />
  </g>;
}

export type ServiceIllustrationProps = {
  kind: IllustrationKind;
  src: string;
  alt: string;
  active?: boolean;
  suspended?: boolean;
  /** Development comparison can inspect a single frame without a running clock. */
  previewProgress?: number;
};

export function ServiceIllustration({ kind, src, alt, active = false, suspended = false, previewProgress }: ServiceIllustrationProps) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const scene = illustrationScenes[kind];
  const reducedMotion = useSyncExternalStore(reducedMotionStore.subscribe, reducedMotionStore.snapshot, serverMedia);
  const visible = useInView(root, { amount: 0.6 });
  const finePointer = useSyncExternalStore(pointerStore.subscribe, pointerStore.snapshot, serverMedia);
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
    const wanted = allowed && (finePointer ? hovered || focused : active && !mobilePlayed.current);

    const begin = () => {
      if (cancelled) return;
      if (!finePointer) mobilePlayed.current = true;
      status(finePointer ? "looping" : "playing-once");
      opacity.set(1);
      ramp = animate(strength, 1, { duration: 0.16, ease: "easeOut" });
      // Finish an interrupted cycle first, then repeat from zero. Every layer
      // is at rest at both ends, so re-entering during the return never jumps.
      clock = animate(phase, 1, {
        duration: Math.max(0.05, (1 - phase.get()) * DURATION), ease: "linear",
        onComplete: () => {
          if (cancelled) return;
          phase.set(0);
          if (finePointer) clock = animate(phase, 1, { duration: DURATION, ease: "linear", repeat: Infinity });
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
      if (finePointer) begin();
      else timer = setTimeout(begin, 180);
    } else if (!allowed) reset();
    else {
      status("returning");
      ramp = animate(strength, 0, { duration: 0.4, ease: "easeOut", onComplete: reset });
    }
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      clock?.stop();
      ramp?.stop();
    };
  }, [active, documentVisible, failed, finePointer, focused, hovered, opacity, phase, previewProgress, ready, reducedMotion, strength, suspended, visible]);

  // Critical geometry belongs in the server HTML: lazy images and SVG layers
  // must stay inside the reserved frame even before the stylesheet is ready.
  return <div className="service-illustration" data-illustration={kind} ref={root}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
    <Image alt={alt} className="service-card-media service-illustration-original" decoding="async" draggable={false}
      fill loading="lazy" sizes={imageSizes} src={src} style={{ objectFit: "cover", transform: "none" }}
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
          {scene.layers.map(layer => <path key={layer.id} d={layer.path} fill="black" />)}
        </mask>
        <clipPath id={`${id}-holes`}>
          {scene.layers.map(layer => <path key={layer.id} d={layer.path} />)}
        </clipPath>
        {scene.layers.map(layer => <clipPath id={`${id}-${layer.id}`} key={layer.id}><path d={layer.path} /></clipPath>)}
      </defs>
      <rect width={SIZE} height={SIZE} fill={`url(#${id}-paper)`} />
      <image href={source} width={SIZE} height={SIZE} mask={`url(#${id}-stationary)`}
        onLoad={() => setReady(true)} onError={() => setFailed(true)} />
      {scene.repairs && <g clipPath={`url(#${id}-holes)`}>
        {scene.repairs.map((repair, index) => <path key={index} d={repair.path} fill={repair.fill ?? "none"}
          stroke={repair.stroke} strokeWidth={repair.width} strokeDasharray={repair.dash} strokeLinecap="round" strokeLinejoin="round" />)}
      </g>}
      {scene.layers.map(layer => <MovingPiece clipId={`${id}-${layer.id}`} key={layer.id} layer={layer}
        source={source} phase={phase} strength={strength} />)}
    </motion.svg>}
  </div>;
}
