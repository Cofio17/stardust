"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { siteContent } from "../site-content";
import { Reveal } from "./Reveal";
import { HeroShootingStar } from "./HeroShootingStar";

export function HeroRotator() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const intro = (delay: number) => ({
    initial: reducedMotion ? false as const : { opacity: 0, y: "105%" },
    animate: { opacity: 1, y: "0%" },
    transition: { duration: reducedMotion ? 0 : 0.82, delay: reducedMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const }
  });

  useEffect(() => {
    if (reducedMotion) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % siteContent.hero.messages.length);
    }, 4600);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <section aria-labelledby="hero-title" className="hero" id="top">
      <div aria-hidden="true" className="hero-rings">
        <motion.div
          animate={{ opacity: 0.52, scale: 1 }}
          className="hero-ring hero-ring-large"
          initial={reducedMotion ? false : { opacity: 0, scale: 2.35 }}
          transition={{
            delay: reducedMotion ? 0 : 0.05,
            duration: reducedMotion ? 0 : 1.9,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.img
            alt=""
            animate={reducedMotion ? undefined : { rotate: 360 }}
            draggable="false"
            src="/images/hero-dashed-orbit.svg"
            transition={{ duration: 82, ease: "linear", repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          animate={{ opacity: 0.62, scale: 1 }}
          className="hero-ring hero-ring-small"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.72 }}
          transition={{
            delay: reducedMotion ? 0 : 1.25,
            duration: reducedMotion ? 0 : 1.05,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.img
            alt=""
            animate={reducedMotion ? undefined : { rotate: -360 }}
            draggable="false"
            src="/images/hero-dashed-orbit-small.svg"
            transition={{ duration: 64, ease: "linear", repeat: Infinity }}
          />
        </motion.div>
      </div>

      <HeroShootingStar />

      <div className="hero-stage shell">
        <div className="hero-sticky">
          <div className="hero-copy">
            <h1 className="display-xl" id="hero-title">
              <span className="hero-line hero-intro-mask">
                <motion.span className="hero-intro-line" {...intro(0.08)}>{siteContent.hero.titleLead}</motion.span>
              </span>
              {/* Every word sits in the same grid cell, so the line keeps the width of
                  the longest one and the stack never reflows as the word swaps. */}
              <span className="hero-line hero-message hero-intro-mask">
                <motion.span className="hero-intro-line" {...intro(0.26)}>
                  <span className="hero-message-slot">
                    {siteContent.hero.messages.map((word, index) => (
                      <motion.span
                        key={word}
                        animate={{
                          opacity: index === active ? 1 : 0,
                          y: index === active ? "0%" : index < active ? "-46%" : "46%"
                        }}
                        aria-hidden={index === active ? undefined : true}
                        initial={false}
                        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                </motion.span>
              </span>
              <span className="hero-line hero-tail-line">
                <motion.span
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.5 }}
                >{siteContent.hero.titleTail}</motion.span>
              </span>
            </h1>
            <Reveal delay={0.64}><p>{siteContent.hero.description}</p></Reveal>
            <Reveal delay={0.8}>
              <div className="hero-actions">
                <button className="button button-lime" data-open-contact type="button">
                  Start a conversation <span aria-hidden="true">↗</span>
                </button>
                <a className="button button-ghost-light" href="#what-we-solve">
                  See what we build <span aria-hidden="true">↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
