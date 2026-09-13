# Service illustrations

Eight illustrations, one per card in the services section (`app/site-content.ts` → `services`).
`public/images/service-seo.png` is the finished reference for the **SEO Services**
card; the other seven are specified below.

## Shared style system

Every icon must read as part of the same set. Locked rules:

| Rule | Value |
| --- | --- |
| Canvas | 1024 × 1024 px, square, genuinely transparent background |
| Margin | ~8 % empty on all sides, so the art still breathes at 180 px |
| Outline | Deep navy `#0a1224`, thin, even weight, organic hand-drawn wobble — never mechanical |
| Primary fill | Amber `#ffb020`, flat, roughly 40 % of the coloured area |
| Accent | Cobalt `#1a46cc` — **exactly one** element per icon, never the hero object |
| Neutral | Porcelain `#f5f3ee` for surfaces, glass and paper |
| Object count | One hero object + one or two supporting shapes. Never more |
| Sparkles | Two or three four-point stars: one larger porcelain-filled, one or two small solid amber |
| Texture | A few short interior hatch arcs for hand-drawn shading |
| Forbidden | 3D, gradients, drop shadows, lettering, watermarks, checkerboard, card frames |

Composition follows the reference: the hero object sits slightly below centre on a gentle diagonal,
one supporting shape overlaps behind it, sparkles fill the two opposite empty corners.

## The eight icons

### 1. SEO Services — `service-seo.png` *(done — in `public/images/`)*
Hero: magnifying glass with a simple person silhouette inside. Behind: a sliced circle (pie).
Supporting: small amber cog. Cobalt: the upper pie slice.

### 2. AI Solutions — `service-ai.png`
Hero: a porcelain rounded speech bubble, and inside it three dots connected into a small
constellation — the "assistant that knows your business". Behind: an amber rounded panel offset
slightly, as if the bubble lifted off it. Cobalt: the top constellation node. Sparkles rise from the
bubble's tail. Deliberately *not* a brain and *not* a robot head — the set stays object-based.

### 3. Full Web Apps — `service-web-apps.png`
Hero: a porcelain browser window with an amber title bar, one sidebar column and one content card.
Behind: a second, smaller window rotated a few degrees, amber-filled, peeking out top-right.
Cobalt: a single short chart bar inside the content card. Sparkles bottom-left.

### 4. Marketing Design — `service-marketing-design.png`
Hero: an amber megaphone on a diagonal, pointing up-right. In front of the mouth: a small porcelain
ad card, tilted. Cobalt: a filled circle riding the sound fan. Sparkles replace the usual sound
lines, so the "broadcast" reads without motion marks.

### 5. Websites — `service-websites.png`
Hero: a porcelain browser window, wider than tall, with a large amber hero block and two thin
navy content lines under it. Behind: a phone outline showing the same block stacked, so responsive
reads instantly. Cobalt: a small cursor arrow near the hero block. Sparkles top-left.

### 6. UI/UX Design — `service-ux.png`
Hero: a porcelain artboard frame with an amber component block placed on it and four small navy
selection handles on the block's corners. Supporting: two rounded chips stacked at the frame's edge,
like a component library. Cobalt: the cursor arrow. Sparkles bottom-right.

### 7. E-commerce — `service-ecommerce.png`
Hero: an amber shopping bag with a porcelain handle and one hatch arc for volume. Behind: a
porcelain product card with a price tag. Cobalt: the tag itself. Sparkles top-right. No coins, no
credit card — those read as fintech, not retail.

### 8. Automation — `service-automation.png`
Hero: an amber arrow curving into an open loop. Inside the loop: a porcelain rounded square holding
a small lightning bolt. Two amber nodes sit on the loop path. Cobalt: the lightning bolt. Sparkles
outside the loop, bottom-left. **No cogs** — the cog belongs to the SEO icon and keeps it distinct.

## Generation prompt template

Replace `{SUBJECT}` with the Hero / Behind / Cobalt / Sparkles description above.

> Create one premium editorial PNG service illustration for the StarDust Studio website, on a
> genuinely transparent background. Use an airy hand-drawn thin outline and flat coloured geometric
> illustration language. No card, no frame, no text. Subject: {SUBJECT}. Restrained composition,
> clearly readable at 180 px, generous transparent margins of about 8 percent. Thin deep navy
> `#0a1224` organic ink outlines, amber `#ffb020` flat fills, exactly one subtle cobalt `#1a46cc`
> detail, warm porcelain `#f5f3ee` accents, and two or three delicate four-point sparkle marks.
> Sophisticated minimal editorial illustration, mostly flat with tiny hand-drawn imperfections.
> No 3D, no gradient, no shadow, no lettering, no watermark, no checkerboard. Square 1024 px image.

Generate all eight in one session where possible — outline weight and sparkle size drift between
sessions, and the grid shows the eight side by side.

## Wiring them up

Done. `Service` in `app/site-content.ts` carries an `icon` path and `OutcomesSection.tsx` renders
`service.icon`, so a card picks up its illustration as soon as the file exists at the path below.
Filenames are fixed — drop a PNG in `public/images/` under exactly this name and nothing else needs
to change:

| Card | File |
| --- | --- |
| SEO Services | `public/images/service-seo.png` |
| AI Solutions | `public/images/service-ai.png` |
| Full Web Apps | `public/images/service-web-apps.png` |
| Marketing Design | `public/images/service-marketing-design.png` |
| Websites | `public/images/service-websites.png` |
| UI/UX Design | `public/images/service-ux.png` |
| E-commerce | `public/images/service-ecommerce.png` |
| Automation | `public/images/service-automation.png` |

`next/image` renders them at `sizes="200px"` from a 1024 × 1024 source, so oversized files cost
build time rather than page weight — but keep them square or the tile crops.
