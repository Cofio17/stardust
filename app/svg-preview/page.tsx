import type { Metadata } from "next";
import { SvgConceptPreview } from "./svg-concept-preview";

export const metadata: Metadata = {
  title: "SVG concepts",
  description: "Four scroll-drawn SVG concepts for StarDust Studio."
};

export default function SvgPreviewPage() {
  return <SvgConceptPreview />;
}
