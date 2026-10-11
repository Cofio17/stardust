"use client";

import { cubicBezier, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import "./hero-gravity-field.css";

// Both families sample the same surface, so every crossing stays connected.
type Point = readonly [number, number];
// The central valley of each vertex, kept so a narrow screen can flatten it.
const valleyOf = new Map<Point, number>();

function point(u: number, depth: number): Point {
  const spread = 0.3 + 0.7 * depth;
  const x = 800 + u * 1100 * spread;
  const dip = 150 * Math.sin(Math.PI * depth) * Math.exp(-5 * u * u);
  const vertex: Point = [x, 170 + 760 * depth + dip];
  valleyOf.set(vertex, dip);
  return vertex;
}

function clipSegment(a: Point, b: Point, padding = 0): readonly [Point, Point] | null {
  if (a[0] >= -padding && a[0] <= 1600 + padding && a[1] >= -padding && a[1] <= 900 + padding
    && b[0] >= -padding && b[0] <= 1600 + padding && b[1] >= -padding && b[1] <= 900 + padding) {
    return [a, b];
  }
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  let start = 0;
  let end = 1;
  const edges = [
    [-dx, a[0] + padding], [dx, 1600 + padding - a[0]],
    [-dy, a[1] + padding], [dy, 900 + padding - a[1]]
  ];
  for (const [direction, distance] of edges) {
    if (direction === 0) {
      if (distance < 0) return null;
      continue;
    }
    const intersection = distance / direction;
    if (direction < 0) start = Math.max(start, intersection);
    else end = Math.min(end, intersection);
    if (start > end) return null;
  }
  return [
    [a[0] + dx * start, a[1] + dy * start],
    [a[0] + dx * end, a[1] + dy * end]
  ];
}

function trimSurface(points: readonly Point[]): readonly Point[] {
  let first = points.length;
  let last = 0;
  for (let index = 1; index < points.length; index++) {
    // Keep neighboring original vertices so crossings still share coordinates.
    // The extra border covers the maximum horizontal pull into the viewport.
    if (!clipSegment(points[index - 1], points[index], 200)) continue;
    first = Math.min(first, index - 1);
    last = index;
  }
  return points.slice(first, last + 1);
}

// Traces one curve from the warped vertex buffers, in device pixels. The canvas
// clips anything outside the viewport itself; only a partially drawn curve needs
// the visible length, so the entrance draws the same stretch an SVG pathLength would.
function traceCurve(
  context: CanvasRenderingContext2D,
  indices: readonly number[],
  xs: Float32Array,
  ys: Float32Array,
  scaleX: number,
  scaleY: number,
  progress: number
) {
  if (progress >= 1) {
    context.moveTo(xs[indices[0]] * scaleX, ys[indices[0]] * scaleY);
    for (let index = 1; index < indices.length; index++) {
      context.lineTo(xs[indices[index]] * scaleX, ys[indices[index]] * scaleY);
    }
    return;
  }
  const segments: (readonly [Point, Point])[] = [];
  let total = 0;
  for (let index = 1; index < indices.length; index++) {
    const segment = clipSegment(
      [xs[indices[index - 1]], ys[indices[index - 1]]],
      [xs[indices[index]], ys[indices[index]]]
    );
    if (!segment) continue;
    segments.push(segment);
    total += Math.hypot(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
  }
  let remaining = total * progress;
  let previous: Point | null = null;
  for (const [start, end] of segments) {
    if (remaining <= 0) break;
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (!previous || previous[0] !== start[0] || previous[1] !== start[1]) {
      context.moveTo(start[0] * scaleX, start[1] * scaleY);
    }
    const t = length > remaining ? remaining / length : 1;
    previous = [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
    context.lineTo(previous[0] * scaleX, previous[1] * scaleY);
    remaining -= length;
  }
}

// Keep the original column spacing (1 / 9), with enough outer columns for the
// horizontal curves to reach beyond both edges even near the horizon.
// Both line families read the same lattice, including the exact crossing vertices.
const FIELD_CENTER = 27;
const DEPTH_CELLS = 22;
const HORIZON_CELLS = 6;
const CELL_SAMPLES = 2;
const widthSamples = FIELD_CENTER * 2 * CELL_SAMPLES;
const depthSamples = DEPTH_CELLS * CELL_SAMPLES;
const horizonSamples = HORIZON_CELLS * CELL_SAMPLES;
const lattice = Array.from({ length: depthSamples + horizonSamples + 1 }, (_, row) => {
  // Perspective compresses the cells toward the horizon.
  // Continue columns above it, so their tips disappear into the existing fade.
  const position = (row - horizonSamples) / depthSamples;
  const depth = Math.sign(position) * Math.pow(Math.abs(position), 1.45);
  return Array.from({ length: widthSamples + 1 }, (_, column) =>
    point((column / CELL_SAMPLES - FIELD_CENTER) / 9, depth)
  );
});
const longitudinal = Array.from({ length: FIELD_CENTER * 2 + 1 }, (_, column) =>
  lattice.map(row => row[column * CELL_SAMPLES]).reverse()
);
// Each row is one continuous curve across the full surface, with no central seam.
const transverse = Array.from({ length: DEPTH_CELLS + HORIZON_CELLS - 1 }, (_, row) =>
  [...lattice[(row + 1) * CELL_SAMPLES]].reverse()
);
const surface = [...longitudinal, ...transverse].map(trimSurface);
// Crossings reuse lattice vertices: deform each one once instead of computing
// the same displacement separately for its row and column.
const vertices = [...new Set(surface.flat())];
const vertexIndex = new Map(vertices.map((vertex, index) => [vertex, index]));
const surfaceIndices = surface.map(points => points.map(vertex => vertexIndex.get(vertex)!));
const vertexValleys = Float32Array.from(vertices, vertex => valleyOf.get(vertex) ?? 0);
// Columns draw outward from the centre, then the rows follow together.
const drawDelays = [
  ...longitudinal.map((_, index) => 0.05 + Math.abs(index - FIELD_CENTER) * 0.035),
  ...transverse.map(() => 0.65)
];
const DRAW_DURATION = 1.3;
const DRAW_END = Math.max(...drawDelays) + DRAW_DURATION;
const drawEase = cubicBezier(0.22, 1, 0.36, 1);

// The former SVG mask, as alpha. Its fade blended black to white while the
// opacity fell from 1 to 0.4, so the luminance bows up before the midpoint.
function fadeStops(): [number, number][] {
  const stops: [number, number][] = [[0.04, 0]];
  for (let step = 1; step <= 8; step++) {
    const t = step / 8;
    stops.push([0.04 + 0.41 * t, t * (1 - 0.6 * t)]);
  }
  stops.push([1, 1]);
  return stops;
}
const FADE_STOPS = fadeStops();
const QUIET_STOPS: [number, number][] = [[0, 1], [0.35, 0.98], [0.7, 0.55], [1, 0]];
const EDGE_STOPS: [number, number][] = [[0, 0], [0.09, 1], [0.91, 1], [1, 0]];
// The 16:9 field may stretch this much on one axis to fill the hero. Past it,
// the field scales up and is cropped instead, so a portrait phone shows the
// middle of the same floor rather than a perspective squeezed four times over.
const MAX_STRETCH = 1.25;
// On a portrait screen a full-height crop is so narrow that the floor's central
// dip reads as a bowl. Shrinking it shows more columns; the top of the field is
// faded out anyway, so anchoring it to the bottom leaves no visible gap.
const PORTRAIT_SCALE = 0.82;
// The valley spans the middle third of the field; in a portrait crop it fills
// the screen and turns the floor into a bowl, so it keeps only this much there.
const PORTRAIT_VALLEY = 0.35;

// The body is a halftone sphere, like the cover of the studio deck: a hex grid
// of dots whose size follows the light, so the rim and the shadow side thin out
// on their own. Dots across the diameter; fewer reads as a pattern, more as grey.
const SPHERE_DOTS = 17;
const SPHERE_LIGHT = [-0.42, -0.5, 0.76] as const;
// How far the light leans as the body follows the cursor, at full orbit.
const SPHERE_LEAN = 0.22;

export function HeroGravityField() {
  const reducedMotion = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLCanvasElement>(null);
  // The entrance plays once, even if the motion preference re-runs the effect.
  const introStartRef = useRef<number | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const planet = planetRef.current;
    const sphere = sphereRef.current;
    const sphereContext = sphere?.getContext("2d");
    if (!layer || !hero || !canvas || !context || !planet || !sphere || !sphereContext) return;

    introStartRef.current ??= performance.now();
    const introStart = introStartRef.current;
    const copy = hero.querySelector<HTMLElement>(".hero-copy");
    // A canvas repaints the whole mesh in one raster pass; the SVG version
    // re-rasterized 80+ anti-aliased paths per frame and dropped to ~30fps.
    // Every fade (depth, side edges, quiet zone behind the copy) is baked into
    // one mask on resize, so a frame applies it in a single composite and the
    // canvas needs no CSS mask layer re-blended on every scroll frame.
    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d");
    if (!maskContext) return;
    const fade = maskContext.createLinearGradient(0, 0, 0, 900);
    FADE_STOPS.forEach(([offset, alpha]) => fade.addColorStop(offset, `rgb(0 0 0 / ${alpha})`));
    const quiet = maskContext.createRadialGradient(0, 0, 0, 0, 0, 1);
    QUIET_STOPS.forEach(([offset, alpha]) => quiet.addColorStop(offset, `rgb(0 0 0 / ${alpha})`));
    const quietZone = { cx: 800, cy: 450, rx: 700, ry: 340 };
    // CSS pixels per field unit on each axis, and where the field's origin sits.
    const field = { sx: 1, sy: 1, ox: 0, oy: 0, valley: 1 };
    const xs = new Float32Array(vertices.length);
    const ys = new Float32Array(vertices.length);

    let bounds = layer.getBoundingClientRect();
    let frame = 0;
    let previousTime = 0;
    let hovering = false;
    let onScreen = true;
    let pageTop = bounds.top + window.scrollY;
    let previousVisibleHeight = 0;
    let bodySize = 96;
    let planetLeft = 0;
    let planetTop = 0;
    let strokeColor = "#0a1224";
    let strokeOpacity = 0.147;
    let sphereLit = "#ffb020";
    let sphereShade = "#e69a12";
    // The light lean the sphere was last drawn with; NaN forces a redraw.
    let sphereLeanX = Number.NaN;
    let sphereLeanY = Number.NaN;
    let pointerX = -1;
    let pointerY = -1;
    const target = { x: 800, y: 450, strength: 0 };
    const current = { ...target };
    // Offsets and velocity are in CSS pixels, keeping the same weight on phones.
    const orbit = { x: 0, y: 0, vx: 0, vy: 0 };
    const orbitTarget = { x: 0, y: 0 };

    const introDone = (time: number) => reducedMotion || (time - introStart) / 1000 >= DRAW_END;

    function updateQuietZone() {
      if (!hero || !bounds.width || !bounds.height) return;
      const title = hero.querySelector(".hero-copy h1");
      const subtitle = hero.querySelector(".hero-copy > .reveal-mask");
      if (!title || !subtitle) return;
      // Measure the stable wrappers, so the quiet area follows the actual text
      // on every viewport without following its entrance animation.
      const titleBounds = title.getBoundingClientRect();
      const subtitleBounds = subtitle.getBoundingClientRect();
      const left = Math.min(titleBounds.left, subtitleBounds.left);
      const right = Math.max(titleBounds.right, subtitleBounds.right);
      quietZone.cx = ((left + right) / 2 - bounds.left - field.ox) / field.sx;
      quietZone.cy = ((titleBounds.top + subtitleBounds.bottom) / 2 - bounds.top - field.oy) / field.sy;
      quietZone.rx = ((right - left) / 2 + Math.min(150, bounds.width * 0.14)) / field.sx;
      quietZone.ry = ((subtitleBounds.bottom - titleBounds.top) / 2 + Math.min(130, bounds.height * 0.16)) / field.sy;
    }

    function buildMask() {
      if (!canvas || !maskContext) return;
      if (mask.width !== canvas.width || mask.height !== canvas.height) {
        mask.width = canvas.width;
        mask.height = canvas.height;
      }
      if (!mask.width || !mask.height || !bounds.width) return;
      const ratio = mask.width / bounds.width;
      const toField = () => maskContext.setTransform(
        field.sx * ratio, 0, 0, field.sy * ratio, field.ox * ratio, field.oy * ratio
      );
      // The depth fade belongs to the floor, so it lives in field space.
      toField();
      maskContext.globalCompositeOperation = "copy";
      maskContext.fillStyle = fade;
      maskContext.fillRect(0, 0, 1600, 900);
      // The side fade belongs to the screen: a cropped field still softens at
      // the edges the visitor actually sees.
      maskContext.setTransform(1, 0, 0, 1, 0, 0);
      const edges = maskContext.createLinearGradient(0, 0, mask.width, 0);
      EDGE_STOPS.forEach(([offset, alpha]) => edges.addColorStop(offset, `rgb(0 0 0 / ${alpha})`));
      maskContext.globalCompositeOperation = "destination-in";
      maskContext.fillStyle = edges;
      maskContext.fillRect(0, 0, mask.width, mask.height);
      toField();
      maskContext.globalCompositeOperation = "destination-out";
      maskContext.translate(quietZone.cx, quietZone.cy);
      maskContext.scale(quietZone.rx, quietZone.ry);
      maskContext.fillStyle = quiet;
      maskContext.fillRect(-1, -1, 2, 2);
      maskContext.globalCompositeOperation = "source-over";
    }

    function drawSphere(leanX: number, leanY: number) {
      if (!sphere || !sphereContext) return;
      if (Math.abs(leanX - sphereLeanX) < 0.002 && Math.abs(leanY - sphereLeanY) < 0.002) return;
      sphereLeanX = leanX;
      sphereLeanY = leanY;
      const size = sphere.clientWidth;
      if (!size) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixels = Math.round(size * ratio);
      if (sphere.width !== pixels || sphere.height !== pixels) {
        sphere.width = pixels;
        sphere.height = pixels;
      }
      sphereContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      sphereContext.clearRect(0, 0, size, size);

      let lightX = SPHERE_LIGHT[0] + leanX;
      let lightY = SPHERE_LIGHT[1] + leanY;
      let lightZ = SPHERE_LIGHT[2];
      const length = Math.hypot(lightX, lightY, lightZ);
      lightX /= length;
      lightY /= length;
      lightZ /= length;

      const radius = size / 2;
      const spacing = size / SPHERE_DOTS;
      const rowHeight = spacing * Math.sqrt(3) / 2;
      const rows = Math.ceil(radius / rowHeight);
      const columns = Math.ceil(radius / spacing) + 1;
      // One path per tone keeps it to two fills, however many dots there are.
      const lit = new Path2D();
      const shade = new Path2D();
      for (let row = -rows; row <= rows; row++) {
        const y = row * rowHeight;
        const offset = row % 2 === 0 ? 0 : spacing / 2;
        for (let column = -columns; column <= columns; column++) {
          const x = column * spacing + offset;
          const nx = x / radius;
          const ny = y / radius;
          const distance = nx * nx + ny * ny;
          if (distance >= 1) continue;
          const light = Math.max(0, nx * lightX + ny * lightY + Math.sqrt(1 - distance) * lightZ);
          // Never wider than the grid, so neighbouring dots never merge.
          const dot = spacing * 0.46 * (0.06 + 0.94 * Math.pow(light, 1.6));
          if (dot < 0.35) continue;
          const path = light > 0.45 ? lit : shade;
          path.moveTo(radius + x + dot, radius + y);
          path.arc(radius + x, radius + y, dot, 0, Math.PI * 2);
        }
      }
      sphereContext.fillStyle = sphereShade;
      sphereContext.fill(shade);
      sphereContext.fillStyle = sphereLit;
      sphereContext.fill(lit);
    }

    function renderField(time: number) {
      if (!bounds.width || !bounds.height || !planet || !canvas || !context) return;
      const { sx: scaleX, sy: scaleY } = field;
      const radius = Math.min(320, Math.max(180, bounds.width * 0.24));
      const fieldRadius = Math.max(bounds.width, bounds.height) * 0.65;
      const bodyX = (planetLeft + orbit.x - field.ox) / scaleX;
      // Project the sphere's weight just below it, into the plane of the mesh.
      const bodyY = (planetTop + orbit.y + bodySize * 0.12 - field.oy) / scaleY;
      const gravityRadius = bodySize * 1.65;
      const gravityDepth = bodySize * 1.15;
      planet.style.transform = `translate3d(${orbit.x.toFixed(3)}px, ${orbit.y.toFixed(3)}px, 0)`;
      // A fixed light in the scene slides across the body as it moves.
      drawSphere(-orbit.x / 72 * SPHERE_LEAN, -orbit.y / 44 * SPHERE_LEAN);

      // The nearby depression and the long-range tension act on EVERY vertex.
      // Rational falloff keeps the outer columns responsive, even away from the
      // cursor; shared crossing coordinates still receive identical displacement.
      for (let index = 0; index < vertices.length; index++) {
        const [x, y] = vertices[index];
        const dx = (x - current.x) * scaleX;
        const dy = (y - current.y) * scaleY;
        const distanceSquared = dx * dx + dy * dy;
        const pull = current.strength * Math.exp(-distanceSquared / (radius * radius));
        const tension = current.strength / (1 + distanceSquared / (fieldRadius * fieldRadius));
        const gx = (x - bodyX) * scaleX;
        const gy = (y - bodyY) * scaleY;
        const gravity = Math.exp(-(gx * gx + gy * gy) / (gravityRadius * gravityRadius));
        xs[index] = x - (x - current.x) * (0.18 * pull + 0.018 * tension) - (x - bodyX) * 0.22 * gravity;
        ys[index] = y - vertexValleys[index] * (1 - field.valley)
          + (64 * pull + 10 * tension + gravityDepth * gravity) / scaleY;
      }

      context.globalCompositeOperation = "source-over";
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      const ratio = canvas.width / bounds.width;
      context.setTransform(1, 0, 0, 1, field.ox * ratio, field.oy * ratio);
      // Stroke 1 device-pixel hairlines, which the GPU draws on a fast path; a
      // wider anti-aliased stroke rasterizes a coverage mask the size of each
      // curve's bounds and dropped the hero to ~30fps. The alpha carries the
      // ink of the old stretched 1-unit stroke in each direction instead.
      const deviceX = scaleX * ratio;
      const deviceY = scaleY * ratio;
      context.strokeStyle = strokeColor;
      context.lineWidth = 1;
      context.lineJoin = "round";
      const columnAlpha = Math.min(1, strokeOpacity * deviceX);
      const rowAlpha = Math.min(1, strokeOpacity * deviceY);
      const elapsed = (time - introStart) / 1000;
      surfaceIndices.forEach((indices, index) => {
        const linear = reducedMotion ? 1 : (elapsed - drawDelays[index]) / DRAW_DURATION;
        if (linear <= 0) return;
        // Each curve strokes on its own, so crossings keep their darker overlap.
        context.globalAlpha = index < longitudinal.length ? columnAlpha : rowAlpha;
        context.beginPath();
        traceCurve(context, indices, xs, ys, deviceX, deviceY, linear >= 1 ? 1 : drawEase(linear));
        context.stroke();
      });
      if (!mask.width || !mask.height) return;
      context.globalAlpha = 1;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.globalCompositeOperation = "destination-in";
      context.drawImage(mask, 0, 0);
      context.globalCompositeOperation = "source-over";
    }

    function draw(time: number) {
      frame = 0;
      if (!onScreen || document.hidden) return;
      const dt = Math.min((time - previousTime) / 1000 || 1 / 60, 0.05);
      previousTime = time;
      const follow = 1 - Math.exp(-dt / 0.09);
      const soften = 1 - Math.exp(-dt / 0.16);
      current.x += (target.x - current.x) * follow;
      current.y += (target.y - current.y) * follow;
      current.strength += (target.strength - current.strength) * soften;

      // A damped spring gives the planet inertia without a perpetual render loop.
      const steps = Math.ceil(dt / 0.008);
      const step = dt / steps;
      for (let index = 0; index < steps; index++) {
        orbit.vx += ((orbitTarget.x - orbit.x) * 60 - orbit.vx * 12) * step;
        orbit.vy += ((orbitTarget.y - orbit.y) * 60 - orbit.vy * 12) * step;
        orbit.x += orbit.vx * step;
        orbit.y += orbit.vy * step;
      }
      renderField(time);

      const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.1;
      const orbitMoving = Math.abs(orbitTarget.x - orbit.x) + Math.abs(orbitTarget.y - orbit.y)
        + Math.abs(orbit.vx) + Math.abs(orbit.vy) > 0.05;
      if (moving || orbitMoving || Math.abs(target.strength - current.strength) > 0.001 || !introDone(time)) {
        frame = requestAnimationFrame(draw);
      } else if (!hovering) {
        parkField();
      }
    }

    const wake = () => {
      if (!frame && onScreen && !document.hidden) {
        previousTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (!planet || !onScreen || document.hidden) return;
      // Chrome replays a stationary cursor while the page scrolls; reacting to it
      // repainted the whole field on every scroll frame.
      if (event.clientX === pointerX && event.clientY === pointerY) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      const layerTop = pageTop - window.scrollY;
      if (!bounds.width || !bounds.height) return;
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < layerTop || event.clientY > layerTop + bounds.height) {
        if (hovering) leave();
        return;
      }
      target.x = (event.clientX - bounds.left - field.ox) / field.sx;
      target.y = (event.clientY - layerTop - field.oy) / field.sy;
      orbitTarget.x = Math.tanh((event.clientX - bounds.left - planetLeft) / 380) * 72;
      orbitTarget.y = Math.tanh((event.clientY - layerTop - planetTop) / 280) * 44;
      if (!hovering) {
        current.x = target.x;
        current.y = target.y;
      }
      hovering = true;
      target.strength = 1;
      wake();
    };
    const leave = () => {
      if (!hovering && target.strength === 0 && orbitTarget.x === 0 && orbitTarget.y === 0) return;
      hovering = false;
      target.strength = 0;
      orbitTarget.x = orbitTarget.y = 0;
      wake();
    };
    const exitWindow = (event: PointerEvent) => {
      if (!event.relatedTarget) leave();
    };

    // Reset once when the visibility threshold is crossed, rather than
    // repainting the canvas on every scroll event.
    function parkField() {
      cancelAnimationFrame(frame);
      frame = 0;
      hovering = false;
      target.strength = current.strength = 0;
      orbitTarget.x = orbitTarget.y = 0;
      orbit.x = orbit.y = orbit.vx = orbit.vy = 0;
      renderField(performance.now());
    }
    function handleScroll() {
      // Cached document coordinates keep this check free of layout reads.
      const top = Math.max(pageTop, window.scrollY);
      const bottom = Math.min(pageTop + bounds.height, window.scrollY + window.innerHeight);
      updateVisibility(Math.max(0, bottom - top));
    }
    function updateVisibility(visibleHeight: number) {
      const entering = visibleHeight > previousVisibleHeight;
      const unchanged = visibleHeight === previousVisibleHeight;
      previousVisibleHeight = visibleHeight;
      // Leave at 20% visible, but resume on the first pixel returning.
      const active = visibleHeight > 0 && (
        entering || visibleHeight / bounds.height > 0.2 || (unchanged && onScreen)
      );
      if (active === onScreen) return;
      onScreen = active;
      syncVisibility();
    }
    function syncVisibility() {
      const active = onScreen && !document.hidden;
      layer?.setAttribute("data-in-view", String(active));
      if (!active) parkField();
      // An entrance interrupted off screen carries on where its clock is.
      else if (!introDone(performance.now())) wake();
    }
    function measure() {
      if (!layer || !canvas) return;
      bounds = layer.getBoundingClientRect();
      pageTop = bounds.top + window.scrollY;
      const fitX = bounds.width / 1600;
      const fitY = bounds.height / 900;
      const portrait = fitY > fitX * MAX_STRETCH;
      field.sy = portrait
        ? Math.max(fitY * PORTRAIT_SCALE, fitX * MAX_STRETCH)
        : Math.max(fitY, fitX / MAX_STRETCH);
      field.sx = Math.max(fitX, field.sy / MAX_STRETCH);
      field.ox = (bounds.width - 1600 * field.sx) / 2;
      field.oy = portrait ? bounds.height - 900 * field.sy : (bounds.height - 900 * field.sy) / 2;
      field.valley = portrait ? PORTRAIT_VALLEY : 1;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * ratio);
      const height = Math.round(bounds.height * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const style = getComputedStyle(layer);
      strokeColor = style.color;
      strokeOpacity = Number.parseFloat(style.getPropertyValue("--field-line-opacity")) || 0.147;
      sphereLit = style.getPropertyValue("--accent").trim() || sphereLit;
      sphereShade = style.getPropertyValue("--accent-strong").trim() || sphereShade;
      sphereLeanX = sphereLeanY = Number.NaN;
      bodySize = planet?.firstElementChild?.clientWidth ?? 96;
      planetLeft = planet?.offsetLeft ?? 0;
      planetTop = planet?.offsetTop ?? 0;
      updateQuietZone();
      buildMask();
      parkField();
      handleScroll();
      if (!introDone(performance.now())) wake();
    }
    const resize = new ResizeObserver(measure);
    resize.observe(layer);
    if (copy) resize.observe(copy);
    const viewObserver = new IntersectionObserver(([entry]) => {
      updateVisibility(entry.intersectionRect.height);
      syncVisibility();
    }, { threshold: [0, 0.2] });
    viewObserver.observe(hero);
    document.addEventListener("visibilitychange", syncVisibility);
    measure();
    if (reducedMotion) {
      return () => {
        resize.disconnect();
        viewObserver.disconnect();
        document.removeEventListener("visibilitychange", syncVisibility);
        planet.style.removeProperty("transform");
      };
    }
    // Capture at the window so text, buttons, and overlaid header controls cannot
    // leave dead strips in the decorative field. Bounds above limit it to hero.
    window.addEventListener("pointermove", move, { passive: true, capture: true });
    window.addEventListener("pointerout", exitWindow);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerout", exitWindow);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", syncVisibility);
      planet.style.removeProperty("transform");
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className="hero-gravity-field" ref={layerRef}>
      <canvas className="hero-gravity-grid" ref={canvasRef} />
      <div className="hero-gas-planet" ref={planetRef}>
        <canvas className="hero-dust-sphere" ref={sphereRef} />
        <div className="hero-dust-sphere-shadow" />
      </div>
    </div>
  );
}
