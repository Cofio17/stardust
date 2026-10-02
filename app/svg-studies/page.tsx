import type { Metadata } from "next";
import { SvgStudies } from "./svg-studies";

export const metadata: Metadata = {
  title: "SVG / Form studies",
  description: "Šest velikih SVG akcenata za StarDust Studio."
};

export default function Page() {
  return <SvgStudies />;
}
