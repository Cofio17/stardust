"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteContent } from "../site-content";

export function FaqAccordion() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="faq-list" role="list">
      {siteContent.faq.map((item, index) => {
        return (
          <motion.article
            className="faq-item"
            initial={reducedMotion ? false : { opacity: 0, y: 26 }}
            key={item.question}
            role="listitem"
            transition={{
              delay: reducedMotion ? 0 : (index % 2) * 0.08,
              duration: reducedMotion ? 0 : 0.62,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ amount: 0.25, once: true }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </motion.article>
        );
      })}
    </div>
  );
}
