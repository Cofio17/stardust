"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import studies from "./studies.json";
import styles from "./studies.module.css";

type Mode = "draw" | "rotate" | "still";

function Study({ study, index }: { study: typeof studies[number]; index: number }) {
  const [mode, setMode] = useState<Mode>("draw");
  const [replay, setReplay] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section id={study.id} className={`${styles.study} ${index % 3 === 0 ? styles.ink : index % 3 === 2 ? styles.blue : styles.paper}`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>0{index + 1} / {study.name}</p>
          <h2>{study.heading}</h2>
          <p className={styles.body}>{study.description}</p>
          <p className={styles.fit}>{study.fit}</p>
          <div className={styles.controls} role="group" aria-label={`Animacija: ${study.name}`}>
            {([ ["draw", "Iscrtavanje"], ["rotate", "Rotacija"], ["still", "Mirno"] ] as const).map(([value, label]) => (
              <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>
            ))}
            {mode === "draw" && <button type="button" aria-label={`Ponovi iscrtavanje: ${study.name}`} onClick={() => setReplay(value => value + 1)}>↻</button>}
          </div>
          <a className={styles.download} href={`/images/svg-studies/${study.id}.svg`} download>Preuzmi SVG <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.artWrap}>
          <motion.svg key={`${mode}-${replay}`} viewBox="0 0 800 800" aria-hidden="true" className={`${styles.art} ${mode === "rotate" ? styles.rotate : ""}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            {study.paths.map((path, i) => (
              <motion.path key={i} d={path.d} transform={path.transform || undefined} fill="none" stroke="currentColor" strokeWidth={study.stroke} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
                style={{ opacity: path.opacity, "--path-index": i } as CSSProperties}
                variants={{ hidden: { pathLength: mode === "draw" && !reduced ? 0 : 1 }, visible: { pathLength: 1, transition: { duration: reduced || mode !== "draw" ? 0 : 2.8, delay: reduced || mode !== "draw" ? 0 : i * 0.16, ease: [0.22, 1, 0.36, 1] } } }} />
            ))}
          </motion.svg>
          <span className={styles.artCaption}>800 × 800 / {study.stroke}px stroke / {mode === "rotate" ? "48s rotation" : mode === "draw" ? "path reveal" : "static form"}</span>
        </div>
      </div>
    </section>
  );
}

export function SvgStudies() {
  return (
    <main className={styles.page} lang="sr-Latn">
      <header className={styles.header}><Link href="/">StarDust <span>Studio</span></Link><Link href="/">Nazad na sajt ↗</Link></header>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>STARDUST / FORM STUDIES / 01—06</p>
        <h1>Velika forma.<br /><span>Tih karakter.</span></h1>
        <p>Šest skulpturalnih akcenata sa debelim linijama. Uz tekst, na ivici sekcije, sa dovoljno prostora da poruka ostane prva.</p>
        <nav className={styles.index} aria-label="SVG varijacije">{studies.map((study, i) => <a key={study.id} href={`#${study.id}`}><span>0{i + 1}</span>{study.name}<span>↘</span></a>)}</nav>
      </div>
      {studies.map((study, index) => <Study key={study.id} study={study} index={index} />)}
      <footer className={styles.footer}>STARDUST / SVG STUDIES <Link href="/">Nazad na sajt ↑</Link></footer>
    </main>
  );
}
