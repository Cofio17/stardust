# Section photography

Two photo sets, one per section. Both replace existing art that is either duplicated
elsewhere on the page or cropped wrong by its container.

Unlike `service-icon-prompt.md` (flat vector illustration), these are **photographic
still-life** renders in the studio language the site already uses.

## Shared style system

Locked across both sets — the page shows several of these within one scroll, so drift is visible.

| Rule | Value |
| --- | --- |
| Medium | Photographic studio still life. Sculptural objects, not people, not screens-in-a-room |
| Camera | Single fixed lens look, ~50–85 mm, shallow but not creamy depth of field |
| Light | One soft directional key from upper left, long soft shadows, no fill flash, no rim light |
| Surface | Honed graphite stone `#0a1224` or porcelain plaster `#f5f3ee` — set per section below |
| Materials | Cast concrete, travertine, matte paper stock, frosted glass, brushed steel |
| Accent | Amber `#ffb020` — **exactly one** amber element per image, and it is never the hero object |
| Second colour | Cobalt `#1a46cc`, at most one element, matte not glossy |
| Object count | One hero object plus one or two supporting shapes. Never more |
| Forbidden | People, hands, logos, lettering, UI screenshots, lens flare, bokeh balls, HDR, tilt-shift, heavy vignette |

> **Colour note.** The photos currently on the site use a lime-green accent. The design
> system's accent token is amber `#ffb020` (`app/globals.css` → `--accent`), which is what
> the service icons use. New photography uses **amber**, so the photo set and the icon set
> finally agree. Do not reintroduce lime.

---

## Set A — service card slider

Section: `service-card-slider service-card-slider-light section-pad`
(`app/components/ServiceCardSlider.tsx`, content in `app/service-cards.ts`).

### Hard constraints

- **Portrait 4:5. Render 1600 × 2000 px.** The card is `min-height: clamp(28rem, 41vw, 38rem)`
  at up to 560 px wide, `object-fit: cover`.
- **The bottom half is destroyed on purpose.** `.service-card::before` lays down
  `linear-gradient(180deg, transparent 8%, rgb(10 18 36 / 35%) 35%, rgb(10 18 36 / 94%) 100%)`.
  By 35 % down the image is already a third buried; at the bottom it is 94 % opaque navy.
  **Put the hero object in the top 30 % of the frame.** Anything below the midline is decoration.
- **Keep the top-left corner empty.** `.service-card-number` sits at `top: 1.5rem; left: 1.5rem`
  with its own navy chip. Compose the hero slightly right of centre.
- Surface: **graphite `#0a1224`**, so the photo dissolves into the gradient instead of
  fighting it. Backdrop is a dim concrete wall in shadow.
- The card headline runs up to `2.8rem` and sits bottom-left. Do not compete with it.

### The four cards

#### A1 — `service-workflows.webp` · "Get your tools talking."
Hero: three matte concrete blocks on a graphite table, set apart with visible gaps, each at a
different height. A single taut amber cord runs through all three, entering the frame top-right
and leaving bottom-left, so the gaps read as *bridged* rather than empty. Cobalt: one small matte
disc resting beside the middle block. Shot slightly above eye level so the cord's path is legible.
Replaces `hero-route.webp`.

#### A2 — `service-custom.webp` · "Build the tool that doesn't exist."
Hero: one irregular cast-concrete form that is clearly not a standard shape — an off-angle wedge
with a single notch cut into it — standing upright in the upper third of frame. Behind it and to
the left, two ordinary cubes sit in shadow, obviously a different family of object. Amber: a thin
flat strip lying on the table, pointing at the wedge. Cobalt: none. The read is "purpose-made next
to off-the-shelf". Replaces `hero-structure.webp` in this slider.

#### A3 — `service-clarity.webp` · "See the whole picture."
Hero: four frosted glass panes stacked in a slight fan, each offset a few degrees, lit so the
overlap resolves into one continuous darker shape where all four coincide. Upper portion of frame.
Amber: one opaque chip trapped between the second and third pane. Cobalt: the bottom pane, tinted.
No paper, no clips — this is the "the answer lives in four places" image. Replaces `hero-clarity.webp`.

#### A4 — `service-automation-photo.webp` · "Let the routine run itself."
Hero: seven identical small concrete cylinders in an evenly spaced row running diagonally across
the upper frame, machined and repetitive. One cylinder near the centre is amber and sits a few
millimetres proud of the line. Cobalt: a thin rail running under the row. The read is "the
predictable part repeats, the exception stands up". **This card currently shares `process-flow.webp`
with the approach section — that duplication is the reason this image exists.**

---

## Set B — parallax approach section

Section: `parallax-section` / `shell parallax-section-inner`
(`app/components/ParallaxSection.tsx`, content in `app/site-content.ts` → `approach`).

### Hard constraints

- **Landscape 4:3. Render 2000 × 1500 px.** `.parallax-pair-media` is `aspect-ratio: 4 / 3`
  at up to 520 px wide. **All three current images are 4:5 portrait being centre-cropped into a
  landscape box** — this is the main reason to reshoot. Deliver native 4:3 and the crop disappears.
- `object-position: center 58%` — compose the subject **slightly below centre**.
- Surface: **porcelain plaster `#f5f3ee`**, light-keyed. The section background is
  `var(--porcelain)` with graphite text and **no overlay at all**, so the full frame is visible.
  `process-flow.webp` is currently a dark image dropped into a light section; the replacements
  are all high-key.
- Rounded `0.8rem` corners are applied by CSS — do not draw a frame or border.
- The frame parallaxes vertically ±15 % as a whole box; the image does not slide inside it,
  so **no extra bleed margin is needed**.

### The three steps

#### B1 — `approach-conversation.webp` · "The first conversation does the heavy lifting."
Hero: a single rough, unfinished travertine block sitting slightly below centre on a porcelain
surface, with one clean flat face freshly cut into it — the rest still raw. Beside it, a brushed
steel straightedge resting where the next cut would go. Amber: a short measuring mark on the stone.
Cobalt: none. The read is "we looked at the raw thing and found the first true edge".
Replaces `process-drag.webp`.

#### B2 — `approach-prototype.webp` · "See it before we build it."
Hero: a frosted-glass slab held a few centimetres above a matching solid concrete slab of identical
footprint, the glass casting a soft shadow onto it, so the two read as the same object in two
states. Slightly below centre, low three-quarter angle. Amber: one thin line running across the
glass and continuing, unbroken, across the concrete below. Cobalt: the lower slab's edge. The read
is "the preview and the real thing are the same shape". Replaces `process-shape.webp`.

#### B3 — `approach-launch.webp` · "Launch is the start of the useful part."
Hero: a shallow porcelain ramp or low stair climbing left to right out of the frame, with three
concrete markers set along it at increasing spacing — not a finish line, an ongoing run. Slightly
below centre. Amber: the furthest marker, the one still out ahead. Cobalt: a thin inlaid strip
running the length of the ramp. Bright, open, airy — the lightest of the three. Replaces the dark
`process-flow.webp`, which currently reads as an ending in a section about continuing.

---

## Generation prompt template

Replace `{SURFACE}`, `{RATIO}`, `{PIXELS}` and `{SUBJECT}` from the entries above.

> Editorial studio still-life photograph for a software studio website. {SUBJECT}
> Set on a {SURFACE} surface against a plain out-of-focus concrete backdrop.
> Single soft directional key light from the upper left, long soft natural shadows, no fill
> light, no rim light. Shot on a 50–85 mm lens, shallow but controlled depth of field, the hero
> object entirely sharp. Matte materials only: cast concrete, travertine, frosted glass, brushed
> steel, uncoated paper stock. Restrained palette of deep navy `#0a1224` and warm porcelain
> `#f5f3ee`, with exactly one amber `#ffb020` element and at most one matte cobalt `#1a46cc`
> element. Calm, architectural, expensive, understated. No people, no hands, no text, no logos,
> no screens, no lens flare, no HDR, no heavy vignette.
> {RATIO} aspect ratio, {PIXELS}.

| Set | `{SURFACE}` | `{RATIO}` | `{PIXELS}` |
| --- | --- | --- | --- |
| A — service cards | honed graphite stone | 4:5 portrait | 1600 × 2000 px |
| B — approach | porcelain plaster | 4:3 landscape | 2000 × 1500 px |

Generate each set in one session. Key light angle and shadow length drift between sessions, and
each set is seen as a group — the slider shows two cards at once, the approach section stacks all
three down one column.

## Wiring them up

Both sections read paths from data, so a new image is live as soon as the file exists and the path
is updated. Nothing in the components changes.

| Image | Path | Referenced in |
| --- | --- | --- |
| A1 | `public/images/service-workflows.webp` | `app/service-cards.ts` → `connected-workflows` |
| A2 | `public/images/service-custom.webp` | `app/service-cards.ts` → `custom-products` |
| A3 | `public/images/service-clarity.webp` | `app/service-cards.ts` → `clearer-decisions` |
| A4 | `public/images/service-automation-photo.webp` | `app/service-cards.ts` → `less-repeat-work` |
| B1 | `public/images/approach-conversation.webp` | `app/site-content.ts` → `approach[0]` |
| B2 | `public/images/approach-prototype.webp` | `app/site-content.ts` → `approach[1]` |
| B3 | `public/images/approach-launch.webp` | `app/site-content.ts` → `approach[2]` |

Export WebP at quality 82. The current set runs 35–135 KB per image at these dimensions, which is
the budget to stay inside. Do not commit PNG originals — the seven already in `public/images/` are
unreferenced and only add weight to the repo.

Updating the `alt` text alongside each `src` is part of the swap; the existing alt strings describe
lime thread and paper maps and will be wrong.
