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
  metadataBase: new URL("https://starduststudio.dev"),
  title: {
    default: "StarDust Studio - Custom software for small and mid-sized businesses",
    template: "%s - StarDust Studio"
  },
  description:
    "Custom software for small and mid-sized businesses. Websites, web apps, AI and automation, built by a small team from Novi Sad, Serbia.",
  keywords: ["custom software", "web development", "web apps", "websites", "AI products", "automation", "CRM", "SEO", "e-commerce", "UI/UX design"],
  openGraph: {
    title: "StarDust Studio - Custom software for small and mid-sized businesses",
    description:
      "Websites, web apps, AI and automation for small and mid-sized businesses, built by a small team from Novi Sad, Serbia.",
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
