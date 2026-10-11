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
