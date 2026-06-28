import { cookies } from "next/headers";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import { Poppins } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { parseLanguage } from "@/lib/i18n-server";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import "./map.css";

const poppins = Poppins({
  subsets: ["latin"], 
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Kalohouse - Trust-First Property Marketplace",
  description: "Verified properties in Kigali, Rwanda.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const searchParams = new URLSearchParams(); // This is a workaround to access query params on server
  
  // In server components, we need to use the request to get query params
  // We'll use a workaround to get the query params from the request
  const langFromCookie = cookieStore.get("language")?.value || "en";
  
  // Since we can't get the request object here, we'll rely on the cookie and assume the client has updated it
  // But we can't access the URL query params in this server component
  // So we must ensure the client updates the cookie correctly on language change
  
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <AuthSessionProvider>
          <ClientLayout lang={parseLanguage(langFromCookie)}>
            {children}
          </ClientLayout>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
