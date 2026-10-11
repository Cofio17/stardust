"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { SpaceDust } from "./SpaceDust";
import styles from "./services-cylinder.module.css";

const services = siteContent.services;
// Match the reference's angular spacing (14 labels over 150 degrees),
// while ending the scroll at our last service rather than rotating into empty space.
const step = 150 / 13;
const arc = (services.length - 1) * step;
const tickCount = services.length * 4;

// Tick changes should not rerender the 3D text, descriptions, or artwork.
const CylinderIndicators = memo(function CylinderIndicators({ progress, height }: {
  progress: MotionValue<number>; height: number;
}) {
  const [activeTick, setActiveTick] = useState(0);
  const lastTick = useRef(0);
  useMotionValueEvent(progress, "change", value => {
    const next = Math.round(Math.max(0, Math.min(1, value)) * (tickCount - 1));
    if (next === lastTick.current) return;
    lastTick.current = next;
    setActiveTick(next);
  });
  return <>{["left", "right"].map(side =>
    <div aria-hidden="true" className={`${styles.indicator} ${side === "left" ? styles.left : styles.right}`}
      key={side} style={{ height }}>
      {Array.from({ length: tickCount }, (_, index) =>
        <i className={styles.tick} key={index} data-distance={Math.min(Math.abs(index - activeTick), 4)}
          style={{ top: `${(index / (tickCount - 1)) * 100}%` }} />)}
    </div>)}</>;
});

function CylinderItem({ index, radius, active, select }: {
  index: number; radius: number; active: boolean; select: () => void;
}) {
  const angle = index * step;
  const radians = angle * Math.PI / 180;
  const position = {
    "--item-y": `${(Math.sin(radians) * radius).toFixed(3)}px`,
    "--item-z": `${(Math.cos(radians) * radius).toFixed(3)}px`,
    "--item-angle": `${-angle}deg`
  } as CSSProperties;
  return (
    <div className={`cylindar__text__item ${styles.item}`} style={position}>
      <button aria-current={active ? "step" : undefined} className={styles.name}
        onClick={select} tabIndex={active ? 0 : -1} type="button">{services[index].title}</button>
    </div>
  );
}

export function ServicesCylinder() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [geometry, setGeometry] = useState({ radius: 300, indicator: 300 });
  const [active, setActive] = useState(0);
  const lastActive = useRef(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, arc]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const clamped = Math.max(0, Math.min(1, progress));
    const next = Math.round(clamped * (services.length - 1));
    if (next === lastActive.current) return;
    lastActive.current = next;
    setActive(next);
  });

  useEffect(() => {
    const resize = () => {
      const dimension = Math.min(window.innerWidth, window.innerHeight);
      const radius = dimension * 0.4;
      setGeometry({ radius, indicator: dimension * (dimension < 767 ? 0.8 : 0.4) });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function goToService(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + (index / (services.length - 1)) * distance, behavior: "instant" });
  }

  return (
    <section aria-labelledby="services-cylinder-title" className={styles.section} id="services-cylinder">
      <div className={`shell ${styles.intro}`}>
        <Reveal><Eyebrow>Our services</Eyebrow></Reveal>
        <Reveal delay={0.06}><h2 id="services-cylinder-title">Everything your next<br />chapter needs.</h2></Reveal>
        <Reveal delay={0.12}><p>{siteContent.hero.description}</p></Reveal>
      </div>
      <div className={styles.track} ref={trackRef}>
        <div className={styles.sticky}>
          <SpaceDust scrollYProgress={scrollYProgress} />
          <div className={`shell ${styles.topline}`}>
            <span>StarDust Studio / Services</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
          </div>
          <div className={`shell cylindar__wrapper ${styles.viewport}`}>
            <CylinderIndicators progress={scrollYProgress} height={geometry.indicator} />
            <motion.div className={`cylindar__text__wrapper ${styles.cylinder}`} style={{ rotateX: reduceMotion ? 0 : rotation }}>
              {services.map((service, index) => <CylinderItem key={service.title} index={index} radius={geometry.radius}
                active={active === index} select={() => goToService(index)} />)}
            </motion.div>
          </div>
          <div className={`shell ${styles.bottomline}`}>
            <div className={styles.description} aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} initial={{ opacity: 0, y: 12 }}
                  key={active} transition={{ duration: reduceMotion ? 0 : 0.22 }}>{services[active].description}</motion.p>
              </AnimatePresence>
            </div>
            <div className={styles.artwork} aria-hidden="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={services[active].icon} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
                  <Image alt="" src={services[active].icon} width={160} height={160} sizes="(max-width: 767px) 112px, 144px" />
                </motion.div>
              </AnimatePresence>
            </div>
            <span className={styles.cue} aria-hidden="true">Scroll to explore ↓</span>
          </div>
        </div>
      </div>
      <div className={`shell ${styles.accessibleList}`}>
        {services.map(service => <article key={service.title}><h3>{service.title}</h3><p>{service.description}</p></article>)}
      </div>
    </section>
  );
}
