import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://firma.example"),
  title: {
    default: "StarDust Studio — Make work move",
    template: "%s — StarDust Studio"
  },
  description:
    "StarDust Studio turns slow, fragmented processes into clear, intelligent systems your teams actually use.",
  keywords: ["operations", "customer experience", "workflow", "business systems"],
  openGraph: {
    title: "StarDust Studio — Make work move",
    description:
      "Clearer processes, faster decisions, and better customer handoffs for enterprise teams.",
    type: "website",
    locale: "en_US",
    siteName: "StarDust Studio"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
