"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { ServiceIllustration } from "./ServiceIllustration";
import "./parallax-section.css";

type Story = (typeof siteContent.approach)[number];

function ParallaxPair({ story, index }: { story: Story; index: number }) {
  const pairRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: pairRef,
    offset: ["start end", "end start"]
  });
  // Move the image ahead of the normal page scroll; the copy stays in document flow.
  const imageY = useTransform(scrollYProgress, [0.1, 0.9], ["15%", "-15%"]);

  return (
    <article aria-labelledby={`approach-title-${index}`} className="parallax-pair" ref={pairRef}>
      <motion.div className="parallax-pair-media" style={{ y: reducedMotion ? 0 : imageY }}>
        <div className="parallax-pair-image">
          {/* Plays once each time the image scrolls into view. */}
          <ServiceIllustration
            active
            alt={story.image.alt}
            kind={story.image.animation}
            sizes="(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1160px) 45vw, 520px"
            src={story.image.src}
            trigger="view"
          />
        </div>
      </motion.div>
      <div className="parallax-pair-copy">
        <Eyebrow className="parallax-pair-eyebrow">{story.eyebrow}</Eyebrow>
        <h2 id={`approach-title-${index}`}>{story.title}</h2>
        <p>{story.description}</p>
        <p>{story.detail}</p>
        <div className="parallax-pair-takeaways">
          <h3>{story.takeawayTitle}</h3>
          <ul>
            {story.takeaways.map(takeaway => <li key={takeaway}>{takeaway}</li>)}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function ParallaxSection() {
  return (
    <section aria-label="Our approach" className="parallax-section" id="our-approach">
      <div className="shell parallax-section-inner">
        {siteContent.approach.map((story, index) => (
          <ParallaxPair index={index} key={story.eyebrow} story={story} />
        ))}
      </div>
    </section>
  );
}
