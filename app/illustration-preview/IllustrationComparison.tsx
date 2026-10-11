"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ServiceIllustration } from "../components/ServiceIllustration";
import { serviceCards } from "../service-cards";
import { siteContent } from "../site-content";
import type { IllustrationKind } from "../components/service-illustration-scenes";
import styles from "./preview.module.css";

const frameStyle: CSSProperties = { aspectRatio: "4 / 3", position: "relative", overflow: "hidden", width: "100%" };

type Entry = { id: string; title: string; src: string; alt: string; animation: IllustrationKind; trigger: "hover" | "view" };
const entries: Entry[] = [
  ...serviceCards.cards.flatMap(card => card.media.type === "image" && card.media.animation
    ? [{ id: card.id, title: card.title, src: card.media.src, alt: card.media.alt, animation: card.media.animation, trigger: "hover" as const }]
    : []),
  ...siteContent.approach.map(story => ({
    id: story.image.animation, title: story.title, src: story.image.src, alt: story.image.alt,
    animation: story.image.animation, trigger: "view" as const,
  })),
];

export function IllustrationComparison() {
  const [frame, setFrame] = useState<number | undefined>();
  return <main className={styles.preview}>
    <header className={styles.header}>
      <Link href="/">← StarDust Studio</Link>
      <h1>Originali u pokretu.</h1>
      <p>Pređi mišem preko desne slike ili je fokusiraj tastaturom. Na telefonu se jedan ciklus pokreće kada slika uđe u prikaz.</p>
      <div className={styles.controls}>
        <label htmlFor="motion-frame">Pregled kadra</label>
        <input id="motion-frame" type="range" min="0" max="1" step="0.01" value={frame ?? 0}
          onChange={event => setFrame(Number(event.target.value))} />
        <button type="button" onClick={() => setFrame(undefined)} disabled={frame === undefined}>Animacija uživo</button>
      </div>
    </header>
    {entries.map(card => <section key={card.id} className={styles.comparison}>
      <h2>{card.title}</h2>
      <div className={styles.pair}>
        <figure>
          <figcaption>Original</figcaption>
          <div className={styles.art} style={frameStyle}>
            <Image src={card.src} alt={card.alt} fill sizes="(max-width: 700px) 90vw, 45vw" draggable={false} style={{ objectFit: "cover" }} />
          </div>
        </figure>
        <figure>
          <figcaption>{card.trigger === "view" ? "Animacija · pri ulasku u prikaz" : "Animacija · hover / fokus"}</figcaption>
          <div className={styles.art} style={frameStyle} data-service-card tabIndex={0} aria-label={`Animacija: ${card.title}`}>
            <ServiceIllustration kind={card.animation} src={card.src} alt={card.alt} active trigger={card.trigger} previewProgress={frame} />
          </div>
        </figure>
      </div>
    </section>)}
  </main>;
}
