import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kalohouse — Rwanda's most trusted real estate marketplace. Our mission, team, and commitment to transparency.",
  openGraph: {
    title: "About Kalohouse | Rwanda's Property Marketplace",
    description:
      "Learn about Kalohouse — Rwanda's most trusted real estate marketplace.",
    images: [{ url: "/kalohouse-v2.png", width: 1200, height: 630, alt: "Kalohouse Logo" }],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
