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
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
