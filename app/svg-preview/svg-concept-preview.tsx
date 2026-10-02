"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import styles from "./svg-preview.module.css";

type Concept = {
  id: string;
  number: string;
  name: string;
  fit: string;
  heading: string;
  body: string;
  surface: "paper" | "ink" | "blue";
};

const concepts: Concept[] = [
  {
    id: "orbita",
    number: "01",
    name: "Orbitalni potpis",
    fit: "Za uvod u pristup ili završnu poruku",
    heading: "From first sketch to everything after launch.",
    body: "Jedna velika kompozicija sa orbitama koje se spajaju u centru. Najbliža je imenu StarDust i može da stoji desno od kratke, snažne poruke.",
    surface: "ink"
  },
  {
    id: "putanja",
    number: "02",
    name: "Jedna putanja",
    fit: "Za sekciju o procesu rada",
    heading: "A clearer path from problem to product.",
    body: "Linija prolazi kroz tri stanice i doslovno vodi pogled niz sekciju. Njen smer je najčitljiviji kada se iscrtavanje veže za skrol.",
    surface: "paper"
  },
  {
    id: "slojevi",
    number: "03",
    name: "Slojevi sistema",
    fit: "Za usluge ili objašnjenje šta gradimo",
    heading: "Every piece works better together.",
    body: "Geometrijski okviri se otvaraju jedan po jedan, a centralna linija ih povezuje. Deluje arhitektonski i lepo prati postojeće vizuale sajta.",
    surface: "blue"
  },
  {
    id: "sazvezdje",
    number: "04",
    name: "Mreža tačaka",
    fit: "Za rezultate ili saradnju sa klijentom",
    heading: "The right connections change the whole picture.",
    body: "Više nezavisnih tačaka postaje jedna čitljiva celina. Ima najviše karaktera, ali je i vizuelno najaktivniji predlog.",
    surface: "paper"
  }
];

function DrawPath({ d, progress, from, to, accent = false, thin = false }: {
  d: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  accent?: boolean;
  thin?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const length = useTransform(progress, [from, to], [0, 1]);
  return (
    <motion.path
      className={`${styles.drawPath} ${accent ? styles.accentPath : ""} ${thin ? styles.thinPath : ""}`}
      d={d}
      pathLength={1}
      style={{ pathLength: reducedMotion ? 1 : length }}
    />
  );
}

function DrawPoint({ x, y, progress, at, accent = false, square = false }: {
  x: number;
  y: number;
  progress: MotionValue<number>;
  at: number;
  accent?: boolean;
  square?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const opacity = useTransform(progress, [at, at + 0.045], [0, 1]);
  const scale = useTransform(progress, [at, at + 0.07], [0.25, 1]);
  const className = `${styles.point} ${accent ? styles.accentPoint : ""}`;
  return square ? (
    <motion.rect className={className} height="12" width="12" x={x - 6} y={y - 6} style={{ opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale }} />
  ) : (
    <motion.circle className={className} cx={x} cy={y} r="6" style={{ opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale }} />
  );
}

function Orbital({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg className={styles.art} viewBox="0 0 680 680" role="img" aria-label="Tri orbite se iscrtavaju oko zajedničkog središta">
      <circle className={styles.guide} cx="340" cy="340" r="252" />
      <circle className={styles.guide} cx="340" cy="340" r="122" />
      <path className={styles.guide} d="M340 20v640M20 340h640" />
      <DrawPath d="M104 366C119 204 251 103 393 110c152 7 245 124 225 256-20 131-145 218-284 204C187 555 89 478 104 366Z" progress={progress} from={0.04} to={0.52} thin />
      <DrawPath d="M191 164c117-95 284-89 359 17 85 119 31 285-100 351-139 70-287 18-335-93-50-117-9-206 76-275Z" progress={progress} from={0.14} to={0.66} />
      <DrawPath d="M95 471c26-115 151-219 301-266 94-29 184-18 208 31 31 64-78 166-236 222-150 52-263 55-273 13Z" progress={progress} from={0.3} to={0.78} accent />
      <DrawPath d="M340 266v148M266 340h148" progress={progress} from={0.7} to={0.87} thin />
      <DrawPath d="M340 302l38 38-38 38-38-38 38-38Z" progress={progress} from={0.79} to={0.93} accent />
      <DrawPoint x={191} y={164} progress={progress} at={0.29} />
      <DrawPoint x={550} y={181} progress={progress} at={0.48} />
      <DrawPoint x={604} y={236} progress={progress} at={0.68} accent />
      <DrawPoint x={340} y={340} progress={progress} at={0.94} accent square />
      <text x="70" y="588">01 / DISCOVER</text><text x="472" y="608">BUILD / BEYOND</text>
    </svg>
  );
}

function Route({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg className={styles.art} viewBox="0 0 680 680" role="img" aria-label="Jedna linija se iscrtava kroz tri stanice procesa">
      <path className={styles.guide} d="M40 130h600M40 340h600M40 550h600M130 30v620M340 30v620M550 30v620" />
      <DrawPath d="M48 124h150c44 0 44 62 88 62h105c46 0 46 62 92 62h147" progress={progress} from={0.05} to={0.34} />
      <DrawPath d="M630 248h-83c-42 0-42 64-84 64H292c-44 0-44 66-88 66H52" progress={progress} from={0.3} to={0.57} accent />
      <DrawPath d="M52 378h116c45 0 45 58 90 58h174c45 0 45 67 90 67h108" progress={progress} from={0.52} to={0.79} />
      <DrawPath d="M630 503h-86c-42 0-42 58-84 58H225c-40 0-40 57-80 57H50" progress={progress} from={0.74} to={0.97} thin />
      <DrawPoint x={286} y={186} progress={progress} at={0.22} square />
      <DrawPoint x={292} y={312} progress={progress} at={0.46} accent square />
      <DrawPoint x={432} y={436} progress={progress} at={0.69} square />
      <DrawPoint x={460} y={561} progress={progress} at={0.86} accent />
      <text x="51" y="105">QUESTION</text><text x="52" y="360">PROTOTYPE</text><text x="526" y="485">PRODUCT</text>
    </svg>
  );
}

function Layers({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg className={styles.art} viewBox="0 0 680 680" role="img" aria-label="Četiri pomerena okvira povezuje jedna linija">
      <path className={styles.guide} d="M70 90h540v500H70zM120 140h440v400H120zM170 190h340v300H170z" />
      <DrawPath d="M95 110h320v88H95V110Z" progress={progress} from={0.04} to={0.31} thin />
      <DrawPath d="M212 180h346v120H212V180Z" progress={progress} from={0.18} to={0.45} />
      <DrawPath d="M90 280h344v150H90V280Z" progress={progress} from={0.34} to={0.61} />
      <DrawPath d="M207 400h370v169H207V400Z" progress={progress} from={0.5} to={0.77} thin />
      <DrawPath d="M43 240h123c45 0 45 38 90 38h125c36 0 36 61 72 61h104M557 339h-96c-45 0-45 70-90 70H273c-44 0-44 88-88 88H54" progress={progress} from={0.56} to={0.96} accent />
      <DrawPoint x={166} y={240} progress={progress} at={0.64} />
      <DrawPoint x={381} y={278} progress={progress} at={0.75} accent square />
      <DrawPoint x={461} y={339} progress={progress} at={0.84} />
      <DrawPoint x={273} y={409} progress={progress} at={0.9} accent square />
      <text x="110" y="98">STRATEGY</text><text x="474" y="169">DESIGN</text><text x="105" y="463">BUILD</text><text x="466" y="598">GROW</text>
    </svg>
  );
}

function Constellation({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg className={styles.art} viewBox="0 0 680 680" role="img" aria-label="Tačke se povezuju u razgranatu mrežu">
      <circle className={styles.guide} cx="340" cy="340" r="266" />
      <circle className={styles.guide} cx="340" cy="340" r="173" />
      <DrawPath d="M76 412 176 209 309 317 454 128 588 203" progress={progress} from={0.04} to={0.5} />
      <DrawPath d="M76 412 209 535 309 317 477 486 588 203" progress={progress} from={0.22} to={0.7} accent />
      <DrawPath d="M176 209 359 89 454 128M209 535 369 606 477 486M309 317 588 203" progress={progress} from={0.45} to={0.82} thin />
      <DrawPath d="M309 317c58-51 110-40 168 169M176 209c32 98 79 116 133 108" progress={progress} from={0.7} to={0.97} thin />
      <DrawPoint x={76} y={412} progress={progress} at={0.08} />
      <DrawPoint x={176} y={209} progress={progress} at={0.2} />
      <DrawPoint x={309} y={317} progress={progress} at={0.35} accent square />
      <DrawPoint x={454} y={128} progress={progress} at={0.45} />
      <DrawPoint x={588} y={203} progress={progress} at={0.53} />
      <DrawPoint x={209} y={535} progress={progress} at={0.59} />
      <DrawPoint x={477} y={486} progress={progress} at={0.71} accent />
      <DrawPoint x={359} y={89} progress={progress} at={0.79} />
      <DrawPoint x={369} y={606} progress={progress} at={0.87} />
      <text x="97" y="456">INPUT</text><text x="325" y="304">CONNECT</text><text x="483" y="531">IMPACT</text>
    </svg>
  );
}

function ConceptSection({ concept, index }: { concept: Concept; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const artwork = [Orbital, Route, Layers, Constellation][index];
  const Art = artwork;

  return (
    <section id={concept.id} ref={ref} className={`${styles.concept} ${styles[concept.surface]}`} aria-labelledby={`${concept.id}-title`}>
      <div className={styles.conceptInner}>
        <div className={styles.copy}>
          <p className={styles.kicker}><span>{concept.number} / 04</span> <span>{concept.fit}</span></p>
          <h2 id={`${concept.id}-title`}>{concept.heading}</h2>
          <p className={styles.explanation}>{concept.body}</p>
          <div className={styles.conceptName}><span className={styles.nameRule} />{concept.name}</div>
        </div>
        <div className={styles.artWrap}><Art progress={scrollYProgress} /></div>
      </div>
    </section>
  );
}

export function SvgConceptPreview() {
  return (
    <main className={styles.preview}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">STARDUST <span>STUDIO</span></Link>
        <Link className={styles.back} href="/">← Nazad na sajt</Link>
      </header>
      <div className={styles.intro}>
        <p className={styles.introLabel}>Vizuelni predlozi / 30.09.2026.</p>
        <h1>Četiri načina da se priča <em>iscrta.</em></h1>
        <p>Skroluj kroz predloge. Svaki SVG je prikazan u veličini i rasporedu u kojem bi mogao da stoji uz tekst na sajtu. Linije se crtaju dok sekcija prolazi kroz ekran.</p>
        <nav className={styles.jump} aria-label="Predlozi">
          {concepts.map((concept) => <a key={concept.id} href={`#${concept.id}`}><span>{concept.number}</span>{concept.name} <span aria-hidden="true">↗</span></a>)}
        </nav>
      </div>
      {concepts.map((concept, index) => <ConceptSection concept={concept} index={index} key={concept.id} />)}
      <footer className={styles.footer}><span>SVG / scroll study</span><a href="#orbita">Vrati se na prvi predlog ↑</a></footer>
    </main>
  );
}
