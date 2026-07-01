import { cookies } from "next/headers";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { Poppins } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { parseLanguage } from "@/lib/i18n-server";
import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "./map.css";

const poppins = Poppins({
  subsets: ["latin"], 
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kalohouse.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kalohouse — Rwanda's Trust-First Property Marketplace",
    template: "%s | Kalohouse",
  },
  description:
    "Find verified properties for sale and rent in Kigali, Rwanda. Secure escrow payments, agent-verified listings, and buyer protection on Kalohouse.",
  keywords: [
    "real estate Rwanda",
    "property for sale Kigali",
    "house for rent Kigali",
    "verified properties Rwanda",
    "Rwanda real estate marketplace",
    "property marketplace Kigali",
    "escrow payments Rwanda",
    "Kalohouse",
    "Kalohouse marketplace",
    "apartment Kigali",
    "villa Rwanda",
    "land for sale Rwanda",
  ],
  authors: [{ name: "Kalohouse" }],
  creator: "Kalohouse",
  publisher: "Kalohouse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Kalohouse",
    title: "Kalohouse — Rwanda's Trust-First Property Marketplace",
    description:
      "Find verified properties for sale and rent in Kigali, Rwanda. Secure escrow payments, agent-verified listings, and buyer protection.",
    images: [
      {
        url: "/kalohouse-v2.png",
        width: 1200,
        height: 630,
        alt: "Kalohouse — Rwanda's Property Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalohouse — Rwanda's Trust-First Property Marketplace",
    description:
      "Find verified properties for sale and rent in Kigali, Rwanda. Secure escrow payments and buyer protection.",
    images: ["/kalohouse-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/kalohouse-v2.png",
    shortcut: "/kalohouse-v2.png",
    apple: "/kalohouse-v2.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const langFromCookie = cookieStore.get("language")?.value || "en";
  const language = parseLanguage(langFromCookie);
  
  return (
    <html lang={language} className={poppins.variable}>
      <body className="antialiased">
        <AuthSessionProvider>
          <ClientLayout lang={language}>
            {children}
          </ClientLayout>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
