import type { Swiper } from "swiper";

type SlideGeometry = Pick<Swiper, "slidesGrid" | "slidesSizesGrid" | "size" | "translate" | "rtlTranslate">;

/** One-based range inside the rail, excluding the partial preview at its edge. */
export function getVisibleCardRange(swiper: SlideGeometry) {
  const start = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const end = start + swiper.size;
  let visibleStart = 0;
  let visibleEnd = 0;
  let largestOverlap = -1;
  let fallback = 1;

  swiper.slidesGrid.forEach((left, index) => {
    const width = swiper.slidesSizesGrid[index] ?? 0;
    if (width <= 0) return;
    const right = left + width;
    const overlap = Math.max(0, Math.min(right, end) - Math.max(left, start));
    if (overlap > largestOverlap) {
      largestOverlap = overlap;
      fallback = index + 1;
    }
    // Fractional slide widths can land just outside a boundary after rounding.
    if (left >= start - 1 && right <= end + 1) {
      if (!visibleStart) visibleStart = index + 1;
      visibleEnd = index + 1;
    }
  });

  return { visibleStart: visibleStart || fallback, visibleEnd: visibleEnd || fallback };
}
