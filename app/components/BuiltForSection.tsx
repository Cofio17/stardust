"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "../site-content";
import { Reveal } from "./Reveal";

type IconKind = "sprout" | "puzzle" | "idea" | "check";

const cardIcons: IconKind[] = ["sprout", "puzzle", "idea", "check"];

type DrawnPathProps = {
  d: string;
  delay?: number;
  reducedMotion: boolean | null;
};

function DrawnPath({ d, delay = 0, reducedMotion }: DrawnPathProps) {
  return (
    <motion.path
      d={d}
      initial={reducedMotion ? false : { strokeDashoffset: 1 }}
      pathLength={1}
      strokeDasharray="1 1"
      transition={{ delay: 0.72 + delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ amount: 0.8, once: true }}
      whileInView={reducedMotion ? undefined : { strokeDashoffset: 0 }}
    />
  );
}

function CardIcon({ kind, reducedMotion }: { kind: IconKind; reducedMotion: boolean | null }) {
  const commonProps = {
    className: "built-for-icon",
    fill: "none",
    viewBox: "0 0 48 48",
    xmlns: "http://www.w3.org/2000/svg"
  };

  if (kind === "sprout") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <DrawnPath d="M24 39V20" reducedMotion={reducedMotion} />
        <DrawnPath d="M24 28C17 28 11 23 10 15C18 15 24 19 24 26" delay={0.12} reducedMotion={reducedMotion} />
        <DrawnPath d="M24 22C25 13 31 8 39 7C39 16 34 22 24 24" delay={0.2} reducedMotion={reducedMotion} />
        <DrawnPath d="M24 33C29 30 34 30 39 32C36 38 30 40 24 37" delay={0.3} reducedMotion={reducedMotion} />
        <DrawnPath d="M11 42H29" delay={0.36} reducedMotion={reducedMotion} />
      </svg>
    );
  }

  if (kind === "puzzle") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <DrawnPath
          d="M8 10H18C17.4 8.9 17 7.7 17 6.5C17 3.5 19.5 1 22.5 1C25.5 1 28 3.5 28 6.5C28 7.7 27.6 8.9 27 10H37V20C38.1 19.4 39.3 19 40.5 19C43.5 19 46 21.5 46 24.5C46 27.5 43.5 30 40.5 30C39.3 30 38.1 29.6 37 29V39H27C27.6 37.9 28 36.7 28 35.5C28 32.5 25.5 30 22.5 30C19.5 30 17 32.5 17 35.5C17 36.7 17.4 37.9 18 39H8V29C9.1 29.6 10.3 30 11.5 30C14.5 30 17 27.5 17 24.5C17 21.5 14.5 19 11.5 19C10.3 19 9.1 19.4 8 20V10Z"
          reducedMotion={reducedMotion}
        />
      </svg>
    );
  }

  if (kind === "idea") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <DrawnPath d="M15 22C15 14.8 19.9 10 26 10C32.1 10 37 14.8 37 22C37 26.5 34.7 29.1 32.3 31.7C30.8 33.3 30 35 30 37H22C22 35 21.2 33.3 19.7 31.7C17.3 29.1 15 26.5 15 22Z" reducedMotion={reducedMotion} />
        <DrawnPath d="M22 41H30M23.5 45H28.5" delay={0.15} reducedMotion={reducedMotion} />
        <DrawnPath d="M26 1V5M9 7L12 10M43 7L40 10M5 22H10M42 22H47" delay={0.25} reducedMotion={reducedMotion} />
      </svg>
    );
  }

  return (
    <svg {...commonProps} aria-hidden="true">
      <DrawnPath d="M24 3C35.6 3 45 12.4 45 24C45 35.6 35.6 45 24 45C12.4 45 3 35.6 3 24C3 12.4 12.4 3 24 3Z" reducedMotion={reducedMotion} />
      <DrawnPath d="M14 24L21 31L35 17" delay={0.28} reducedMotion={reducedMotion} />
    </svg>
  );
}

export function BuiltForSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-labelledby="built-for-title" className="built-for section-pad">
      <div className="shell built-for-panel">
        <div className="built-for-intro">
          <Reveal className="built-for-title-reveal">
            <h2 id="built-for-title">{siteContent.builtFor.title}</h2>
          </Reveal>

          <div className="built-for-lede">
            {siteContent.builtFor.description.map((paragraph, index) => (
              <Reveal delay={0.08 + index * 0.08} key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="built-for-grid">
          {siteContent.builtFor.cards.map((card, index) => (
            <motion.article
              className="built-for-card"
              initial={reducedMotion ? false : { opacity: 0, y: 64, scale: 0.96 }}
              key={card.number}
              transition={{
                delay: index * 0.06,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ amount: 0.22, once: true }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            >
              <CardIcon kind={cardIcons[index]} reducedMotion={reducedMotion} />
              <div className="built-for-card-copy">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="built-for-card-index">
                <span className="built-for-number">{card.number}</span>
                <span aria-hidden="true" className="built-for-index-line" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
