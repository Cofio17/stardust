"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type WheelEvent } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import type { SwiperOptions } from "swiper/types";
import { A11y, Mousewheel } from "swiper/modules";
import { getVisibleCardRange } from "./service-card-range";

export const serviceSwiperOptions: SwiperOptions = {
  modules: [A11y, Mousewheel],
  slidesPerView: 1.1,
  spaceBetween: 16,
  grabCursor: true,
  watchOverflow: true,
  mousewheel: { forceToAxis: true, releaseOnEdges: true, sensitivity: 2 },
  a11y: { slideRole: "group", itemRoleDescriptionMessage: "slide", wrapperLiveRegion: false },
  breakpoints: {
    601: { slidesPerView: 2.1 },
    1001: { slidesPerView: 2.5, spaceBetween: 32 }
  }
};

export function useCardSlider(itemCount: number) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reducedMotion = useReducedMotion();
  const speed = reducedMotion ? 0 : 600;
  const [interacting, setInteracting] = useState(false);
  const [position, setPosition] = useState({ visibleStart: 1, visibleEnd: 1, atStart: true, atEnd: itemCount <= 1 });
  const releaseFrame = useRef<number | null>(null);
  useEffect(() => () => {
    if (releaseFrame.current !== null) cancelAnimationFrame(releaseFrame.current);
  }, []);

  function startInteraction() {
    if (releaseFrame.current !== null) cancelAnimationFrame(releaseFrame.current);
    releaseFrame.current = null;
    setInteracting(true);
  }

  const syncPosition = useCallback((swiper: SwiperInstance) => {
    // Swiper emits some events before it updates translation/animation flags.
    // Read on the next frame and announce a range only once movement settles.
    if (releaseFrame.current !== null) cancelAnimationFrame(releaseFrame.current);
    releaseFrame.current = requestAnimationFrame(() => {
      releaseFrame.current = null;
      if (swiper.destroyed) return;
      const moving = swiper.animating || !!swiper.touchEventsData.isTouched;
      setInteracting(moving);
      setPosition(previous => {
        const next = {
          ...(moving ? { visibleStart: previous.visibleStart, visibleEnd: previous.visibleEnd } : getVisibleCardRange(swiper)),
          atStart: swiper.isBeginning || swiper.isLocked,
          atEnd: swiper.isEnd || swiper.isLocked,
        };
        return previous.visibleStart === next.visibleStart && previous.visibleEnd === next.visibleEnd &&
          previous.atStart === next.atStart && previous.atEnd === next.atEnd ? previous : next;
      });
    });
  }, []);

  function onSwiper(swiper: SwiperInstance) {
    swiperRef.current = swiper;
    syncPosition(swiper);
  }

  function move(direction: number) {
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed) return;
    if (direction > 0) swiper.slideNext(speed);
    else swiper.slidePrev(speed);
  }

  // Keyboard handling stays local to the focused carousel. Swiper owns movement.
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!(event.target as HTMLElement).closest(".service-card-rail")) return;
    if (event.altKey || event.ctrlKey || event.metaKey || (event.target as HTMLElement).closest("button")) return;
    const swiper = swiperRef.current;
    if (!swiper || swiper.destroyed || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-service-card]");
    const index = card ? swiper.slides.indexOf(card) : swiper.activeIndex;
    const destination = event.key === "Home" ? 0 : event.key === "End" ? itemCount - 1 : index + (event.key === "ArrowRight" ? 1 : -1);
    const target = Math.max(0, Math.min(itemCount - 1, destination));
    if (card) (swiper.slides[target]?.querySelector<HTMLElement>("a") ?? swiper.slides[target])?.focus({ preventScroll: true });
    swiper.slideTo(target, speed);
  }

  function onWheel(event: WheelEvent<HTMLElement>) {
    // Swiper's native listener runs first. Keep consumed gestures out of Lenis.
    if (event.defaultPrevented) event.stopPropagation();
  }

  return { position, move, onKeyDown, onWheel, onSwiper, syncPosition, speed, interacting, startInteraction, endInteraction: syncPosition };
}

export function useCardVideo(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const manuallyPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || reducedMotion.matches || manuallyPaused.current) { video.pause(); return; }
      if (!video.getAttribute("src")) { video.src = src; video.load(); }
      void video.play().catch(() => { /* The poster and play button remain available if autoplay is blocked. */ });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= 0.25; sync(); }, { threshold: [0, 0.25] });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); reducedMotion.removeEventListener("change", sync); video.pause(); };
  }, [src]);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) { manuallyPaused.current = true; video.pause(); }
    else {
      manuallyPaused.current = false;
      if (!video.getAttribute("src")) { video.src = src; video.load(); }
      void video.play().catch(() => {});
    }
  }

  return { videoRef, playing, toggle, onPlay: () => setPlaying(true), onPause: () => setPlaying(false) };
}
