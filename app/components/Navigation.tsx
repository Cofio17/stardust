"use client";
import { ButtonLabel } from "./ButtonLabel";
import { Arrow } from "./Arrow";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { siteContent } from "../site-content";
import "./navigation.css";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const travelled = useRef(0);
  const desktop = useRef(true);
  const hovered = useRef(false);
  const lockedUntil = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const menuOpen = useRef(open);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 901px)");
    function reset() {
      desktop.current = media.matches;
      lastScrollY.current = Math.max(0, window.scrollY);
      travelled.current = 0;
      hovered.current = false;
      clearTimeout(hoverTimer.current);
      setCompact(media.matches && window.scrollY > 140);
      setHidden(false);
      setScrolled(window.scrollY > 20);
      menuOpen.current = false;
      setOpen(false);
    }
    const frame = requestAnimationFrame(reset);
    media.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", reset);
      clearTimeout(hoverTimer.current);
    };
  }, []);

  function expandNavigation() {
    clearTimeout(hoverTimer.current);
    setCompact(false);
    travelled.current = 0;
    lockedUntil.current = performance.now() + 400;
  }

  function leaveNavigation() {
    hovered.current = false;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (desktop.current && !menuOpen.current && !navRef.current?.querySelector(":focus-visible")) {
        setCompact(window.scrollY > 140);
      }
    }, 200);
  }

  function setMenuState(nextOpen: boolean) {
    menuOpen.current = nextOpen;
    setOpen(nextOpen);

    if (nextOpen) {
      setHidden(false);
      expandNavigation();
    }
  }

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    const previousScrollY = lastScrollY.current;
    const position = Math.max(0, currentScrollY);
    const delta = position - previousScrollY;
    lastScrollY.current = position;

    setScrolled(currentScrollY > 20);

    if (menuOpen.current || position <= (desktop.current ? 140 : 24)) {
      travelled.current = 0;
      setCompact(false);
      setHidden(false);
      return;
    }
    if (desktop.current && (hovered.current || navRef.current?.querySelector(":focus-visible") || performance.now() < lockedUntil.current)) {
      travelled.current = 0;
      return;
    }
    if (delta * travelled.current < 0) travelled.current = 0;
    travelled.current += delta;
    if (travelled.current >= (desktop.current ? 200 : 48)) {
      if (desktop.current) setCompact(true);
      else setHidden(true);
      travelled.current = 0;
    } else if (travelled.current <= -(desktop.current ? 80 : 8)) {
      setCompact(false);
      setHidden(false);
      travelled.current = 0;
    }
  });

  function closeMenu() {
    setMenuState(false);
  }

  return (
    <motion.header
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? "-125%" : "0%" }}
      aria-label="Primary navigation"
      className={`nav-wrap${scrolled ? " is-scrolled" : ""}${hidden ? " is-hidden" : ""}${compact ? " is-compact" : ""}`}
      initial={false}
      inert={hidden}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: hidden ? 0.32 : 0.46, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <div className="shell">
        <nav className="nav-inner" ref={navRef}
          onMouseEnter={() => {
            if (!desktop.current) return;
            hovered.current = true;
            clearTimeout(hoverTimer.current);
            hoverTimer.current = setTimeout(expandNavigation, 140);
          }}
          onMouseLeave={leaveNavigation}
          onFocusCapture={event => {
            if (!(event.target as HTMLElement).closest(".nav-expand")) expandNavigation();
          }}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) leaveNavigation();
          }}
          onClick={event => {
            if ((event.target as HTMLElement).closest("a")) lockedUntil.current = performance.now() + 400;
          }}
          onKeyDown={event => { if (event.key === "Escape") closeMenu(); }}
        >
          <Link aria-label="StarDust Studio home" className="wordmark" href="/">
            <Logo />
          </Link>
          <div className="nav-links" id="desktop-navigation" inert={compact}>
            {siteContent.nav.map((item) => (
              <Link href={item.href} key={item.href} aria-current={item.href === "/our-work" && pathname.startsWith("/our-work") ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions" inert={compact}>
          <button className="button button-lime nav-cta" data-open-contact type="button">
            <ButtonLabel>Start a project <Arrow /></ButtonLabel>
          </button>
          </div>
          <button className="nav-expand" type="button" aria-label="Expand navigation" aria-expanded={!compact}
            aria-controls="desktop-navigation" tabIndex={compact ? 0 : -1}
            onClick={() => {
              expandNavigation();
              navRef.current?.querySelector<HTMLAnchorElement>(".wordmark")?.focus({ preventScroll: true });
            }}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 8 5 12l4 4 M15 8l4 4-4 4 M5 12h14" />
            </svg>
          </button>
          <button
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            className="menu-toggle"
            onClick={() => setMenuState(!open)}
            type="button"
          >
            <span />
          </button>
          {open ? (
            <div className="mobile-panel" id="mobile-navigation">
              {siteContent.nav.map((item) => (
                <Link href={item.href} key={item.href} onClick={closeMenu} aria-current={item.href === "/our-work" && pathname.startsWith("/our-work") ? "page" : undefined}>
                  {item.label}
                </Link>
              ))}
              <button className="mobile-cta" data-open-contact onClick={closeMenu} type="button">
                <ButtonLabel>Start a project <Arrow /></ButtonLabel>
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </motion.header>
  );
}
