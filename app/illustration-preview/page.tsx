import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IllustrationComparison } from "./IllustrationComparison";

export const metadata: Metadata = {
  title: "Illustration motion preview",
  robots: { index: false, follow: false },
};

export default function IllustrationPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return <IllustrationComparison />;
}
