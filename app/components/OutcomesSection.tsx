"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { siteContent } from "../site-content";
import { Eyebrow } from "./Eyebrow";
import { Logo } from "./Logo";
import { Reveal } from "./Reveal";

export function OutcomesSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="outcomes section-light section-pad" id="what-we-solve">
      <div className="shell outcomes-inner">
        <div className="section-intro">
          <div>
            <Reveal><Eyebrow>What we do</Eyebrow></Reveal>
            <Reveal delay={0.06}><h2>Everything you need.One team <br /> behind it.</h2></Reveal>
          </div>
          <Reveal delay={0.12}>
            <p>Design, development, and the growth work that follows - so you are not managing four suppliers who each blame the other three.</p>
          </Reveal>
        </div>
        <div className="outcome-grid">
          {siteContent.services.map((service, index) => (
            <motion.article
              className="service-tile"
              initial={reducedMotion ? false : { y: 46, opacity: 0 }}
              key={service.title}
              transition={{ duration: 0.65, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ amount: 0.25, once: true }}
              whileInView={reducedMotion ? undefined : { y: 0, opacity: 1 }}
            >
              <Image
                alt=""
                className="service-tile-illustration"
                height={1254}
                sizes="200px"
                src={service.icon}
                width={1254}
              />
              <div className="service-tile-copy">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span aria-hidden="true" className="service-tile-signature">
                <Logo variant="mono" wordmark={false} />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
