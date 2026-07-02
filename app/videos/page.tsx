import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight, Bath, Bed, Home, MapPin, Play, ShieldCheck, Square, Video } from "lucide-react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPublishedProperties } from "@/lib/dal";
import { formatMoney } from "@/lib/format";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import type { User, UserRole } from "@/types/models";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "House Video Tours in Rwanda",
  description:
    "Watch uploaded video tours for verified Kalohouse properties and open each listing for full details, photos, pricing, and location.",
};

export default async function VideosPage() {
  noStore();

  const [properties, session] = await Promise.all([getPublishedProperties(), auth()]);
  const videoProperties = properties.filter((property) => Boolean(property.media.video));
  let currentUser: User | null = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      currentUser = {
        id: String(user.id),
        name: user.full_name,
        email: user.email,
        role: user.role as UserRole,
        status: user.is_active ? "active" : "suspended",
        isVerified: user.is_verified,
        mapAccessPaid: user.map_access_paid,
        saved_property_ids: [],
        createdAt: user.created_at.toISOString(),
      };
    }
  }

  return (
    <>
      <LandingNavbar currentUser={currentUser} />
      <main className="min-h-screen bg-black pt-16">
        <section className="h-[calc(100vh-4rem)] overflow-y-auto snap-y snap-mandatory bg-black">
          {videoProperties.length > 0 ? (
            <div>
              {videoProperties.map((property) => (
                <article
                  key={property.id}
                  className="relative min-h-[calc(100vh-4rem)] snap-start overflow-hidden bg-black"
                >
                  <video
                    src={property.media.video}
                    poster={property.media.images[0]?.url}
                    controls
                    preload="metadata"
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.12)_100%)]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent" />

                  <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:left-6 sm:top-6">
                    <Video className="size-3.5 text-gold-light" />
                    {videoProperties.length} tours
                  </div>

                  <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-end px-4 pb-7 pt-20 sm:px-6 sm:pb-10 lg:px-12">
                    <div className="w-full max-w-2xl">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-light backdrop-blur-md">
                          <Play className="size-3 fill-current" />
                          {property.purpose}
                        </span>
                        {property.isOwnerVerified && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                            <ShieldCheck className="size-3.5 text-gold-light" />
                            Verified owner
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold text-white/70">
                        {property.ownerFullName || "Kalohouse owner"}
                      </p>
                      <h1 className="mt-2 max-w-xl font-serif text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {property.title}
                      </h1>

                      <div className="mt-4 flex items-center gap-2 text-sm text-white/75">
                        <MapPin className="size-4 shrink-0 text-gold-light" />
                        <span>
                          {property.district}
                          {property.sector ? `, ${property.sector}` : ""}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-white">
                        <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 backdrop-blur-md">
                          <Bed className="size-4 text-gold-light" />
                          {property.bedrooms} bed
                        </span>
                        <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 backdrop-blur-md">
                          <Bath className="size-4 text-gold-light" />
                          {property.bathrooms} bath
                        </span>
                        <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 backdrop-blur-md">
                          <Square className="size-4 text-gold-light" />
                          {property.sizeSqM ? `${property.sizeSqM} m2` : property.propertyType}
                        </span>
                      </div>

                      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                            Price
                          </p>
                          <p className="mt-1 text-2xl font-black tracking-tight text-gold-light sm:text-3xl">
                            {formatMoney(property.finalDisplayPrice, property.purpose)}
                          </p>
                        </div>
                        <Link
                          href={`/properties/${property.id}`}
                          className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-black transition-colors hover:bg-gold-light"
                        >
                          View details
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>

                      <p className="mt-5 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/60">
                        {property.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.04]">
                <Home className="size-8 text-text-secondary/40" />
              </div>
              <h2 className="font-serif text-2xl text-white">No property videos yet</h2>
              <p className="mt-2 max-w-md text-sm text-text-secondary/60">
                Uploaded house videos will appear here once listings with video tours are published.
              </p>
              <Link
                href="/properties"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
              >
                Browse properties
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
