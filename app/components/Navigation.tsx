"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Logo } from "./Logo";
import { siteContent } from "../site-content";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const direction = useRef<"up" | "down">("up");
  const directionDistance = useRef(0);
  const menuOpen = useRef(open);

  function setMenuState(nextOpen: boolean) {
    menuOpen.current = nextOpen;
    setOpen(nextOpen);

    if (nextOpen) {
      setHidden(false);
    }
  }

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    const previousScrollY = lastScrollY.current;
    const delta = currentScrollY - previousScrollY;
    const nextDirection = delta > 0 ? "down" : "up";

    setScrolled(currentScrollY > 20);

    if (Math.abs(delta) > 0.5) {
      if (nextDirection !== direction.current) {
        direction.current = nextDirection;
        directionDistance.current = 0;
      }

      directionDistance.current += Math.abs(delta);
    }

    if (menuOpen.current || currentScrollY < 72) {
      setHidden(false);
    } else if (directionDistance.current > 18) {
      setHidden(nextDirection === "down");
      directionDistance.current = 0;
    }

    lastScrollY.current = currentScrollY;
  });

  function closeMenu() {
    setMenuState(false);
  }

  return (
    <motion.header
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? "-125%" : "0%" }}
      aria-label="Primary navigation"
      className={`nav-wrap${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}`}
      initial={false}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: hidden ? 0.32 : 0.46, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="shell">
        <nav className="nav-inner">
          <a aria-label="StarDust Studio home" className="wordmark" href="#top">
            <Logo />
          </a>
          <div className="nav-links">
            {siteContent.nav.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <button className="button button-lime nav-cta" data-open-contact type="button">
            Start a project <span aria-hidden="true">↗</span>
          </button>
          <button
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="menu-toggle"
            onClick={() => setMenuState(!open)}
            type="button"
          >
            <span />
          </button>
          {open ? (
            <div className="mobile-panel">
              {siteContent.nav.map((item) => (
                <a href={item.href} key={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              ))}
              <button className="mobile-cta" data-open-contact onClick={closeMenu} type="button">
                Start a project <span aria-hidden="true">↗</span>
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </motion.header>
  );
}
