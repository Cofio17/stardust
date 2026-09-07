"use client";

import { useRef, useState } from "react";
import { siteContent } from "../site-content";

export function CapabilityAccordion() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const capability = siteContent.capabilities[active];

  function moveActive(direction: 1 | -1) {
    const next = (active + direction + siteContent.capabilities.length) % siteContent.capabilities.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="capability-layout">
      <div className="capability-nav" role="tablist" aria-label="Capabilities">
        {siteContent.capabilities.map((item, index) => (
          <button
            aria-controls={`capability-panel-${index}`}
            aria-selected={active === index}
            className={`capability-tab ${active === index ? "is-active" : ""}`}
            id={`capability-tab-${index}`}
            key={item.title}
            onClick={() => setActive(index)}
            onFocus={() => setActive(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault();
                moveActive(1);
              }
              if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                event.preventDefault();
                moveActive(-1);
              }
            }}
            role="tab"
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            tabIndex={active === index ? 0 : -1}
            type="button"
          >
            {item.title}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`capability-tab-${active}`}
        className="capability-detail"
        id={`capability-panel-${active}`}
        role="tabpanel"
        tabIndex={0}
      >
        <p className="eyebrow">{capability.eyebrow}</p>
        <h3>{capability.title}</h3>
        <p>{capability.description}</p>
        <ul className="capability-bullets">
          {capability.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
