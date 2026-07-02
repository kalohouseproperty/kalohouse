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
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                <Video className="size-3.5" />
                Property videos
              </div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                House video tours in Rwanda
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary/70 sm:text-base">
                Watch videos uploaded by property owners and open any listing for photos, pricing,
                location, and full house details.
              </p>
            </div>
            {videoProperties.length > 0 && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/80">
                <Play className="size-4 text-gold-light" />
                {videoProperties.length} {videoProperties.length === 1 ? "tour" : "tours"}
              </div>
            )}
          </div>

          {videoProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {videoProperties.map((property) => (
                <article
                  key={property.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg transition-all duration-300 hover:border-gold/25 hover:shadow-xl hover:shadow-gold/5"
                >
                  <div className="relative aspect-video overflow-hidden bg-soft-bg">
                    <video
                      src={property.media.video}
                      poster={property.media.images[0]?.url}
                      controls
                      preload="metadata"
                      playsInline
                      className="size-full object-cover"
                    />
                    <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-light backdrop-blur-md">
                        <Play className="size-3 fill-current" />
                        {property.purpose}
                      </span>
                      {property.isOwnerVerified && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                          <ShieldCheck className="size-3.5 text-gold-light" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/55">
                        {property.propertyType}
                      </p>
                      <h2 className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-gold-light">
                        {property.title}
                      </h2>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary/65">
                      <MapPin className="size-4 shrink-0 text-gold/70" />
                      <span className="min-w-0 truncate">
                        {property.district}
                        {property.sector ? `, ${property.sector}` : ""}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-semibold text-white/85">
                      <span className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/[0.04] px-2">
                        <Bed className="size-4 shrink-0 text-gold/65" />
                        <span className="truncate">{property.bedrooms} bed</span>
                      </span>
                      <span className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/[0.04] px-2">
                        <Bath className="size-4 shrink-0 text-gold/65" />
                        <span className="truncate">{property.bathrooms} bath</span>
                      </span>
                      <span className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/[0.04] px-2">
                        <Square className="size-4 shrink-0 text-gold/65" />
                        <span className="truncate">
                          {property.sizeSqM ? `${property.sizeSqM} m2` : property.propertyType}
                        </span>
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-text-secondary/60">
                      {property.description}
                    </p>

                    <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary/45">
                          Price
                        </p>
                        <p className="mt-1 truncate text-xl font-black tracking-tight text-gold-light">
                          {formatMoney(property.finalDisplayPrice, property.purpose)}
                        </p>
                      </div>
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-4 text-sm font-black text-black transition-colors hover:bg-gold-light"
                      >
                        Details
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[48vh] flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-20 text-center">
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
