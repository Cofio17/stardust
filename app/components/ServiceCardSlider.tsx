"use client";
import { ButtonLabel } from "./ButtonLabel";

import Image from "next/image";
import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { ServiceCard, ServiceCardSliderContent } from "../service-cards";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { ServiceIllustration } from "./ServiceIllustration";
import { serviceSwiperOptions, useCardSlider, useCardVideo } from "./useCardSlider";
import "swiper/css";
import "swiper/css/a11y";
import "./service-card-slider.css";

function CardVideo({ media, title }: { media: Extract<ServiceCard["media"], { type: "video" }>; title: string }) {
  const { videoRef, playing, toggle, onPlay, onPause } = useCardVideo(media.src);
  return <>
    <video aria-label={media.alt} className="service-card-media" loop muted onPause={onPause} onPlay={onPlay}
      playsInline poster={media.poster} preload="none" ref={videoRef} />
    <button aria-label={`${playing ? "Pause" : "Play"} video: ${title}`} className="button service-card-video-toggle"
      onClick={toggle} type="button">
      <ButtonLabel><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span> {playing ? "Pause" : "Play"}</ButtonLabel>
    </button>
  </>;
}

export function ServiceCardSlider({ cards, title, label, text, link, theme = "light" }: ServiceCardSliderContent) {
  const id = useId();
  const { position, move, onKeyDown, onWheel, onSwiper, syncPosition, speed, interacting, startInteraction, endInteraction } = useCardSlider(cards.length);
  // Omit the whole section when no content is supplied, including empty controls.
  if (!cards.length) return null;

  return (
    <section aria-labelledby={`${id}-title`} aria-roledescription="carousel" className={`service-card-slider service-card-slider-${theme} section-pad`}
      onKeyDown={onKeyDown} onWheel={onWheel}>
      <div className="shell service-card-header">
        <div className="service-card-intro">
          <Reveal>{label && <Eyebrow>{label}</Eyebrow>}<h2 id={`${id}-title`}>{title}</h2></Reveal>
          {text && <Reveal delay={0.06}><p className="service-card-lede">{text}</p></Reveal>}
        </div>
        {link && <a className={`button ${theme === "dark" ? "button-ghost-light" : "button-ghost"}`} href={link.url}>
          <ButtonLabel>{link.label}<span aria-hidden="true">↗</span></ButtonLabel>
        </a>}
      </div>

      <p className="sr-only" id={`${id}-help`}>Swipe or drag to explore. Use Left and Right arrow keys, Home or End when the cards are focused.</p>
      <Swiper {...serviceSwiperOptions} aria-describedby={`${id}-help`} aria-label={title} className="shell service-card-rail" id={`${id}-rail`}
        onSwiper={onSwiper} onSlideChange={syncPosition}
        onTouchStart={startInteraction} onSliderFirstMove={startInteraction} onTouchEnd={endInteraction}
        onTransitionStart={startInteraction} onTransitionEnd={endInteraction}
        onResize={syncPosition} onFromEdge={syncPosition} onReachBeginning={syncPosition} onReachEnd={syncPosition}
        onLock={syncPosition} onUnlock={syncPosition} role="group" speed={speed} tabIndex={0}>
        {cards.map((card, index) => (
          <SwiperSlide tag="article" aria-label={`${index + 1} of ${cards.length}: ${card.title}`}
            className="service-card" data-service-card key={card.id} tabIndex={card.url ? undefined : 0}>
            {({ isActive }) => <>
              <div className="service-card-artwork" style={{ aspectRatio: "4 / 3", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                {card.media.type === "image" ? (
                  card.media.animation ? <ServiceIllustration key={card.media.src} kind={card.media.animation} src={card.media.src} alt={card.media.alt}
                    active={isActive} suspended={interacting} /> :
                    <Image alt={card.media.alt} className="service-card-media" decoding="async" draggable={false} fill loading="lazy"
                      sizes="(max-width: 600px) 85vw, (max-width: 1000px) 46vw, (max-width: 1480px) 38vw, 560px" src={card.media.src} />
                ) : <CardVideo key={card.media.src} media={card.media} title={card.title} />}
              </div>
              <span aria-hidden="true" className="service-card-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="service-card-content">
                <h3>{card.url ? <a className="service-card-link" draggable={false} href={card.url}>{card.title}</a> : card.title}</h3>
                <p className="service-card-description">{card.description}</p>
                <div className="service-card-details"><div>
                  {card.label && <span className={card.url ? "link-arrow service-card-cta" : "service-card-label"}>{card.label}</span>}
                </div></div>
              </div>
            </>}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shell service-card-footer">
        <div aria-label="Slider navigation" className="service-card-controls">
          <button aria-controls={`${id}-rail`} aria-label="Previous card" className={`button ${theme === "dark" ? "button-ghost-light" : "button-ghost"}`}
            disabled={position.atStart} onClick={() => move(-1)} type="button"><ButtonLabel><span aria-hidden="true">←</span></ButtonLabel></button>
          <button aria-controls={`${id}-rail`} aria-label="Next card" className={`button ${theme === "dark" ? "button-ghost-light" : "button-ghost"}`}
            disabled={position.atEnd} onClick={() => move(1)} type="button"><ButtonLabel><span aria-hidden="true">→</span></ButtonLabel></button>
        </div>
      </div>
    </section>
  );
}
