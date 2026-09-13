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
    default: "StarDust Studio - Websites, web apps and automation",
    template: "%s - StarDust Studio"
  },
  description:
    "We launch websites, products and stores, then stay in orbit. Design, engineering, and everything after launch.",
  keywords: ["web development", "web apps", "websites", "e-commerce", "automation", "SEO", "UI/UX design"],
  openGraph: {
    title: "StarDust Studio - Websites, web apps and automation",
    description:
      "We launch websites, products and stores. Then we stay in orbit. Same small team from the first sketch to everything after launch.",
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
