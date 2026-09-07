"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "motion/react";
import { useRef } from "react";

export type FeatureIconKind = "signal" | "momentum" | "handoff" | "clarity";
export type SectionSystemKind = "spine" | "routing" | "stack" | "decision" | "bracket";

type PathSpec = { d: string; active?: boolean; secondary?: boolean };
type NodeSpec = { x: number; y: number; shape?: "circle" | "square"; active?: boolean; secondary?: boolean };
type SystemSpec = { viewBox: string; paths: PathSpec[]; nodes: NodeSpec[]; markers?: Array<{ x: number; y: number; label: string }> };

const featurePaths: Record<FeatureIconKind, PathSpec[]> = {
  signal: [
    { d: "M8 28h28c17 0 12 22 30 22h17", secondary: true },
    { d: "M8 56h42c14 0 13 13 27 13h12" },
    { d: "M8 87h24c16 0 15-11 31-11h26" },
    { d: "M8 112h35c9 0 14-6 14-14", secondary: true },
    { d: "M83 35h28l17 17v47l-17 17H83" },
    { d: "M90 50v18c0 9 7 15 16 15h21" },
    { d: "M128 76h16c12 0 11-16 24-16h8", active: true }
  ],
  momentum: [
    { d: "M10 70h39" },
    { d: "M58 23c-29 13-29 81 0 95", secondary: true },
    { d: "M74 35c-18 10-18 60 0 70" },
    { d: "M80 70h18" },
    { d: "m98 70 11-11 11 11-11 11Z" },
    { d: "M120 70h20c12 0 10-18 22-18h14", active: true },
    { d: "M140 70h12c10 0 10 17 20 17h4", secondary: true }
  ],
  handoff: [
    { d: "M8 25h28c13 0 11 24 25 24h26" },
    { d: "M8 70h79" },
    { d: "M8 115h28c13 0 11-24 25-24h26" },
    { d: "M87 49v42" },
    { d: "M87 70h23c13 0 12-20 25-20h12" },
    { d: "M87 70h23c13 0 12 20 25 20h12", secondary: true },
    { d: "M147 50v40" },
    { d: "M147 70h31", active: true }
  ],
  clarity: [
    { d: "M8 70h37" },
    { d: "M45 70c18 0 17-37 35-37h24", secondary: true },
    { d: "M45 70c18 0 17 37 35 37h18", secondary: true },
    { d: "M45 70h34c15 0 14-17 29-17h17" },
    { d: "M104 33h18", secondary: true },
    { d: "M98 107h13", secondary: true },
    { d: "M125 53h15c13 0 12 17 25 17h13", active: true },
    { d: "M118 89h18", secondary: true }
  ]
};

const featureNodes: Record<FeatureIconKind, NodeSpec[]> = {
  signal: [
    { x: 66, y: 50 }, { x: 77, y: 69 }, { x: 63, y: 76 },
    { x: 128, y: 76, shape: "square", active: true }, { x: 57, y: 98, secondary: true }
  ],
  momentum: [
    { x: 49, y: 70 }, { x: 109, y: 70, shape: "square", active: true },
    { x: 162, y: 52, active: true }, { x: 172, y: 87, secondary: true }
  ],
  handoff: [
    { x: 61, y: 49 }, { x: 61, y: 91 }, { x: 87, y: 70, shape: "square" },
    { x: 147, y: 50 }, { x: 147, y: 90, secondary: true }, { x: 178, y: 70, active: true }
  ],
  clarity: [
    { x: 45, y: 70 }, { x: 80, y: 33, secondary: true }, { x: 80, y: 107, secondary: true },
    { x: 125, y: 53, shape: "square" }, { x: 165, y: 70, active: true }, { x: 118, y: 89, secondary: true }
  ]
};

export function FeatureSystemIcon({ kind }: { kind: FeatureIconKind }) {
  const reducedMotion = useReducedMotion();
  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (index: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: index * 0.075, duration: 0.72, ease: [0.16, 1, 0.3, 1] as const }
    })
  };
  const nodeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.35 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.32 + index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  return (
    <motion.svg
      aria-hidden="true"
      className="feature-system-icon"
      initial={reducedMotion ? "visible" : "hidden"}
      viewBox="0 0 186 140"
      viewport={{ amount: 0.7, once: true }}
      whileInView="visible"
    >
      {featurePaths[kind].map((path, index) => (
        <motion.path
          className={`${path.active ? "is-active" : ""} ${path.secondary ? "is-secondary" : ""}`}
          custom={index}
          d={path.d}
          key={`${kind}-path-${index}`}
          variants={pathVariants}
        />
      ))}
      {featureNodes[kind].map((node, index) => node.shape === "square" ? (
        <motion.rect
          className={`${node.active ? "is-active" : ""} ${node.secondary ? "is-secondary" : ""}`}
          custom={index}
          height="7"
          key={`${kind}-node-${index}`}
          variants={nodeVariants}
          width="7"
          x={node.x - 3.5}
          y={node.y - 3.5}
        />
      ) : (
        <motion.circle
          className={`${node.active ? "is-active" : ""} ${node.secondary ? "is-secondary" : ""}`}
          custom={index}
          cx={node.x}
          cy={node.y}
          key={`${kind}-node-${index}`}
          r="3.5"
          variants={nodeVariants}
        />
      ))}
    </motion.svg>
  );
}

const systems: Record<SectionSystemKind, SystemSpec> = {
  spine: {
    viewBox: "0 0 360 760",
    paths: [
      { d: "M178-20v105c0 26 18 27 18 51v82c0 25-18 25-18 50v117c0 25 18 25 18 50v101c0 27-18 27-18 52v192" },
      { d: "M178 92h-64c-22 0-22 21-44 21H18", secondary: true },
      { d: "M196 188h62c18 0 18-24 36-24h48" },
      { d: "M178 302h-35c-22 0-22 32-44 32H30" },
      { d: "M178 384h-79c-19 0-19-19-38-19H10", secondary: true },
      { d: "M196 474h43c21 0 21 29 42 29h69", active: true },
      { d: "M178 593h-50c-19 0-19 24-38 24H24" },
      { d: "M196 682h59c17 0 17-18 34-18h56", secondary: true }
    ],
    nodes: [
      { x: 178, y: 92, shape: "square" }, { x: 196, y: 188 }, { x: 178, y: 302 },
      { x: 99, y: 334 }, { x: 178, y: 384, shape: "square" }, { x: 196, y: 474, active: true },
      { x: 281, y: 503, shape: "square", active: true }, { x: 178, y: 593 }, { x: 196, y: 682 }
    ],
    markers: [{ x: 38, y: 102, label: "IN" }, { x: 303, y: 493, label: "OUT" }]
  },
  routing: {
    viewBox: "0 0 620 620",
    paths: [
      { d: "M-20 112h94c31 0 31 38 62 38h78" },
      { d: "M25 236h92c32 0 32-34 64-34h56" },
      { d: "M-10 392h116c35 0 35 45 70 45h61", secondary: true },
      { d: "M75 570V476c0-25 27-25 27-50v-72", secondary: true },
      { d: "M214 150h75c27 0 27 34 54 34h79" },
      { d: "M237 202v235" },
      { d: "M237 316h106c29 0 29-41 58-41h71", active: true },
      { d: "M237 437h81c26 0 26 31 52 31h96" },
      { d: "M422 184v91" },
      { d: "M472 275h77c26 0 26 28 52 28h39", active: true },
      { d: "M466 468h62c21 0 21-42 42-42h70", secondary: true }
    ],
    nodes: [
      { x: 136, y: 150 }, { x: 181, y: 202, shape: "square" }, { x: 176, y: 437, secondary: true },
      { x: 237, y: 316, shape: "square" }, { x: 343, y: 316, active: true }, { x: 422, y: 184 },
      { x: 422, y: 275, shape: "square", active: true }, { x: 472, y: 275, active: true }, { x: 466, y: 468 }
    ],
    markers: [{ x: 254, y: 302, label: "R2" }, { x: 488, y: 260, label: "A1" }]
  },
  stack: {
    viewBox: "0 0 540 680",
    paths: [
      { d: "M78 36h302v96M380 203v79H78V120", secondary: true },
      { d: "M120 116h312v104M432 294v64H120V190" },
      { d: "M58 250h314v100M372 420v72H58V332" },
      { d: "M102 386h330v100M432 560v70H102V472" },
      { d: "M18 174h60c23 0 23 26 46 26h93" },
      { d: "M217 200v101c0 25 25 25 25 50v35" },
      { d: "M242 386h73c25 0 25-28 50-28h67", active: true },
      { d: "M372 492h69c25 0 25-25 50-25h64", secondary: true }
    ],
    nodes: [
      { x: 78, y: 174, shape: "square" }, { x: 217, y: 200 }, { x: 242, y: 351 },
      { x: 242, y: 386, shape: "square", active: true }, { x: 365, y: 358, active: true }, { x: 372, y: 492 }
    ],
    markers: [{ x: 134, y: 148, label: "L1" }, { x: 84, y: 324, label: "L2" }, { x: 128, y: 462, label: "L3" }]
  },
  decision: {
    viewBox: "0 0 640 560",
    paths: [
      { d: "M-20 280h93c29 0 29-64 58-64h73" },
      { d: "M73 280c34 0 34 79 68 79h82", secondary: true },
      { d: "M204 216h77c32 0 32-72 64-72h67", secondary: true },
      { d: "M223 359h71c31 0 31-42 62-42h62" },
      { d: "M204 216c38 0 38 101 76 101h76", active: true },
      { d: "M356 317h74c30 0 30-46 60-46h67", active: true },
      { d: "M412 144h62c26 0 26-35 52-35h57", secondary: true },
      { d: "M418 317h69c29 0 29 72 58 72h115", secondary: true },
      { d: "M557 271h103", active: true },
      { d: "M141 359v91c0 24 26 24 26 48v82", secondary: true }
    ],
    nodes: [
      { x: 73, y: 280 }, { x: 204, y: 216, shape: "square" }, { x: 223, y: 359 },
      { x: 280, y: 317, active: true }, { x: 356, y: 317, shape: "square", active: true },
      { x: 412, y: 144, secondary: true }, { x: 418, y: 317 }, { x: 490, y: 271, active: true }, { x: 557, y: 271, active: true }
    ],
    markers: [{ x: 292, y: 301, label: "SELECT" }, { x: 570, y: 255, label: "01" }]
  },
  bracket: {
    viewBox: "0 0 260 620",
    paths: [
      { d: "M74 24H24v118h50M24 84h93" },
      { d: "M186 104h50v112h-50M236 160h-93", secondary: true },
      { d: "M74 226H24v120h50M24 286h93" },
      { d: "M186 306h50v116h-50M236 364h-93" },
      { d: "M74 430H24v148h50M24 504h93", secondary: true },
      { d: "M117 84v202c0 24 26 24 26 48v30", active: true },
      { d: "M143 364v140h93", active: true }
    ],
    nodes: [
      { x: 117, y: 84 }, { x: 143, y: 160, secondary: true }, { x: 117, y: 286, shape: "square" },
      { x: 143, y: 364, active: true }, { x: 117, y: 504 }, { x: 236, y: 504, active: true }
    ],
    markers: [{ x: 38, y: 72, label: "B1" }, { x: 199, y: 352, label: "B2" }]
  }
};

function DrawPath({ path, index, count, progress, reducedMotion }: { path: PathSpec; index: number; count: number; progress: MotionValue<number>; reducedMotion: boolean | null }) {
  const start = 0.05 + index * (0.42 / Math.max(1, count - 1));
  const pathLength = useTransform(progress, [start, Math.min(start + 0.34, 0.92)], [0, 1]);
  return (
    <motion.path
      className={`${path.active ? "is-active" : ""} ${path.secondary ? "is-secondary" : ""}`}
      d={path.d}
      pathLength={1}
      style={{ pathLength: reducedMotion ? 1 : pathLength }}
    />
  );
}

function DrawNode({ node, index, progress, reducedMotion }: { node: NodeSpec; index: number; progress: MotionValue<number>; reducedMotion: boolean | null }) {
  const opacity = useTransform(progress, [0.24 + index * 0.035, 0.34 + index * 0.035], [0, 1]);
  const scale = useTransform(progress, [0.24 + index * 0.035, 0.38 + index * 0.035], [0.35, 1]);
  const className = `${node.active ? "is-active" : ""} ${node.secondary ? "is-secondary" : ""}`;
  return node.shape === "square" ? (
    <motion.rect className={className} height="11" style={{ opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale }} width="11" x={node.x - 5.5} y={node.y - 5.5} />
  ) : (
    <motion.circle className={className} cx={node.x} cy={node.y} r="5" style={{ opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale }} />
  );
}

export function SectionSvgSystem({ kind, className = "" }: { kind: SectionSystemKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const spec = systems[kind];

  return (
    <motion.div
      aria-hidden="true"
      className={`section-svg-system system-${kind} ${className}`}
      ref={ref}
      style={reducedMotion ? undefined : { y: drift }}
    >
      <svg preserveAspectRatio="xMidYMid meet" viewBox={spec.viewBox}>
        <g className="system-paths">
          {spec.paths.map((path, index) => <DrawPath count={spec.paths.length} index={index} key={`${kind}-path-${index}`} path={path} progress={scrollYProgress} reducedMotion={reducedMotion} />)}
        </g>
        <g className="system-nodes">
          {spec.nodes.map((node, index) => <DrawNode index={index} key={`${kind}-node-${index}`} node={node} progress={scrollYProgress} reducedMotion={reducedMotion} />)}
        </g>
        {spec.markers?.map((marker) => <text key={`${marker.label}-${marker.x}`} x={marker.x} y={marker.y}>{marker.label}</text>)}
      </svg>
    </motion.div>
  );
}
