# Motion for the four service illustrations

`media.animation` is optional on an image and accepts `satellite`, `tailoring`,
`clarity`, or `automation`. Images without it and existing video cards retain
their existing rendering. No new runtime dependency is required.

## Artwork

The original PNGs are unchanged. `ServiceIllustration` uses the `currentSrc` of
the loaded Next image for every SVG image layer, sharing the same optimized
resource and crop. Scene masks and hinges live in
`app/components/service-illustration-scenes.ts`, in a 1254 × 1254 reference space.
They select the original raster pixels, rather than redraw the illustrations.

A stationary image mask removes moving pieces. Paper from the blank top of the
same source supplies the revealed background. A few occluded stationary edges
are repaired only inside those holes. Every moving piece returns to its source
coordinates at the cycle boundaries. The satellite body and both wings share
the same vertical displacement so the hinges stay attached.

The SVG overlay appears only after its image resource has loaded. It is fully
hidden at rest and on resource failure; the ordinary accessible Next image
remains underneath. The animated SVG is decorative and receives no input.
SVG IDs are unique per instance, including the comparison page.

## Playback

- Fine pointers: hover anywhere on a card, or visible keyboard focus, runs a
  1.6-second cycle, with a 160 ms entrance ramp. Exit returns the pieces in 400 ms. Re-entry finishes the
  interrupted cycle before starting a new full cycle.
- Coarse pointers: only the active Swiper slide plays, once per activation or
  viewport re-entry, after 180 ms with no drag or transition in progress.
- At least 60% of the artwork must be visible. Leaving the viewport, a hidden
  document, a drag, or reduced motion cancels playback and shows the original.
- Pointer and reduced-motion media queries react to preference changes. Timers,
  Motion controls, media listeners, focus listeners, and observers are cleaned
  up on unmount.
- These four originals do not use the former whole-image hover zoom.
- Frame sizing, clipping, image cover, and SVG positioning are present inline
  in the initial HTML, preventing oversized artwork while CSS loads.
- Before Swiper initializes, CSS reserves the same slide widths and gaps as
  its three responsive breakpoints, avoiding a full-width first frame.
- Wing, document, lens, gear, and stitching movements are amplified. The upper
  hand and thread share a hinge and movement to keep the sewing action connected.

## Approach illustrations

The three images in the approach section (`ParallaxSection`) use the same
component with `trigger="view"`, from `siteContent.approach[].image.animation`:
`conversation`, `prototype` and `launch`. They are not cards, so they never
loop on hover; on every device they play one cycle each time at least 60% of
the artwork scrolls into view, under the same visibility, document and
reduced-motion rules.

- `conversation` (3.2 s): the tangled line is drawn in, then the clear bubble
  lifts, the star turns, its sparks part, and the pencil slides along its own
  axis while the drawing runs. The pencil never rotates: that would uncover
  notebook edges it hides. Until it plays, the tangle waits hidden, so it is
  never seen to vanish before it is drawn.
- `prototype`: the paper wireframe lifts and turns, the two tap ripples move
  outward from the fingertip, and the star turns. The hand stays still because
  it crosses the tablet's edges.
- `launch` (10 s, `loop`): loops for as long as it stays in view. The
  satellite circles the orbit once per cycle, shrinking on the far side and
  passing behind the capsule, which is drawn after it. The capsule bobs four
  times per cycle, the stars twice. A repair continues the orbit across the
  satellite's resting place. The satellite's cutout takes in both of the line
  ends next to it, so the repair meets the line without a gap.

## Drawn ink and orbits

- `reveals` hide ink from the original and draw it back. Each stroke is a mask
  path that unrolls with `stroke-dashoffset` (`pathLength` 1) over its share
  `[from, to]` of the reveal window. The strokes are separate paths because a
  dash pattern is not reliably carried across subpaths. The tangle's strokes
  were traced from the skeleton of its ink, walking from the free end and going
  as straight as possible through each crossing. The mask is 7 units wide: just
  wider than the ink, so a stroke shows only short stubs of the lines it crosses.
- `orbit` moves a layer around an ellipse once per cycle, starting at its rest
  angle, and scales it by `depth` towards the far side. The launch ellipse is
  fitted to the drawn orbit's pixels (mean deviation about 2 units).
- `loop` and `cycles`: a looping scene repeats each pulse `cycles` times per
  cycle. Whole numbers keep the loop seamless.

## Development comparison

Open `/illustration-preview` during `next dev`. Each original sits beside its
animated counterpart. Hover or focus the right-hand image for live motion;
the frame slider permits inspection of the masks at any point in the cycle.
“Animacija uživo” restores live playback. The route returns not-found in
production and has no-index metadata.

## Validation

Verified in the browser: all four comparisons at a near-maximum frame; main
slider layout at 390 px; real pointer drag without activating the contact link;
keyboard focus and slide navigation. The browser's viewport override does not
emulate a physical phone's coarse pointer.

A separate temporary JSDOM harness exercised the actual component with image
load/error events, IntersectionObserver, media-query changes, and StrictMode:
readiness, SVG hinge movement, hover return, rapid re-entry, drag suspension,
viewport/document visibility, dynamic reduced motion, the mobile active/settled
gate, one completed cycle, reactivation, resource fallback, and unmount cleanup.
No QA dependency was added to the project.

Type checking, the production build, and ESLint on changed files pass. Full
project lint reports a pre-existing `react-hooks/set-state-in-effect` error in
`app/components/AboutIntro.tsx` at line 47.
