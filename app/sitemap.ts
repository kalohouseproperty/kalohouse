import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kalohouse.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/buyer-protection`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/escrow-services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookie-settings`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/anti-fraud`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let propertyPages: MetadataRoute.Sitemap = [];

  try {
    if (!process.env.DATABASE_URL) return staticPages;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB timeout")), 5000)
    );

    const dbPromise = prisma.property.findMany({
      where: { status: "published" },
      select: { id: true, updated_at: true },
      orderBy: { updated_at: "desc" },
      take: 5000,
    });

    const properties = await Promise.race([dbPromise, timeoutPromise]);

    propertyPages = properties.map((p) => ({
      url: `${baseUrl}/properties/${p.id}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error("Failed to generate property sitemap entries:", e);
  }

  return [...staticPages, ...propertyPages];
}
