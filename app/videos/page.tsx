import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight, Bath, Bed, Home, MapPin, Play, Square, Video } from "lucide-react";

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
      <main className="min-h-screen bg-main-bg pt-16">
        <section className="border-b border-white/[0.04]">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 sm:px-6 lg:px-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
              <Video className="size-3.5" />
              House video tours
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Watch homes before you visit
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary/70">
                  Browse all uploaded property videos from verified listings, then open the details page for photos, pricing, rooms, and visit options.
                </p>
              </div>
              <div className="rounded-xl border border-gold/20 bg-gold/5 px-5 py-3 sm:text-right">
                <p className="text-3xl font-bold tracking-tighter text-gold-light">{videoProperties.length}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  videos available
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {videoProperties.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {videoProperties.map((property) => (
                <article
                  key={property.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.06] bg-card-bg transition-all duration-300 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5"
                >
                  <div className="relative aspect-video bg-soft-bg">
                    <video
                      src={property.media.video}
                      poster={property.media.images[0]?.url}
                      controls
                      preload="metadata"
                      playsInline
                      className="size-full object-cover"
                    />
                    <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <Play className="size-3.5 fill-current" />
                      {property.purpose}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold/60">
                        {property.propertyType}
                      </p>
                      <h2 className="mt-1.5 line-clamp-1 text-lg font-bold text-white">
                        {property.title}
                      </h2>
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary/60">
                        <MapPin className="size-4 shrink-0 text-gold/50" />
                        <span className="truncate">
                          {property.district}
                          {property.sector ? `, ${property.sector}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-sm text-text-secondary/70">
                      <span className="flex items-center gap-1.5">
                        <Bed className="size-4 text-gold/50" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="size-4 text-gold/50" />
                        {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Square className="size-4 text-gold/50" />
                        {property.sizeSqM ? `${property.sizeSqM}m2` : "-"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary/40">
                          Price
                        </p>
                        <p className="text-lg font-bold text-gold-light">
                          {formatMoney(property.finalDisplayPrice, property.purpose)}
                        </p>
                      </div>
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-gold px-4 text-sm font-black text-black transition-colors hover:bg-gold-light"
                      >
                        View details
                        <ArrowRight className="size-4" />
                      </Link>
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
