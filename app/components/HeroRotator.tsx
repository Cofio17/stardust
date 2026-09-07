"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { siteContent } from "../site-content";
import { Reveal } from "./Reveal";

export function HeroRotator() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

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
          animate={{ opacity: 0.72, scale: 1 }}
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
          animate={{ opacity: 0.82, scale: 1 }}
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

      <div className="hero-stage shell">
        <div className="hero-sticky">
          <div className="hero-copy">
            <Reveal className="hero-title-reveal" delay={0.08}>
              <h1 className="display-xl" id="hero-title">
                <span className="hero-line">{siteContent.hero.titleLead}</span>
                {/* Every word sits in the same grid cell, so the line keeps the width of
                    the longest one and the stack never reflows as the word swaps. */}
                <span className="hero-line hero-message">
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
                </span>
                <span className="hero-line">{siteContent.hero.titleTail}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.5}><p>{siteContent.hero.description}</p></Reveal>
            <Reveal delay={0.68}>
              <div className="hero-actions">
                <button className="button button-lime" data-open-contact type="button">
                  Start a conversation <span aria-hidden="true">↗</span>
                </button>
                <a className="button button-ghost-light" href="#what-we-solve">
                  See what we solve <span aria-hidden="true">↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
