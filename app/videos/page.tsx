import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowLeft, ArrowRight, Bath, Bed, Home, MapPin, Play, ShieldCheck, Square, Video } from "lucide-react";

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
      <main className="min-h-screen bg-[#000]">
        {/* Desktop Header */}
        <div className="hidden pt-16 lg:block">
          <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/8 bg-white/3 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:mb-8 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
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
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-white/80">
                  <Play className="size-4 text-gold-light" />
                  {videoProperties.length} {videoProperties.length === 1 ? "tour" : "tours"}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Mobile: TikTok-style centered vertical feed */}
        <div className="lg:hidden">
          {videoProperties.length > 0 ? (
            <MobileVideoFeed properties={videoProperties} />
          ) : (
            <div className="flex h-[80dvh] flex-col items-center justify-center px-4 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/6 bg-white/4">
                <Home className="size-8 text-text-secondary/40" />
              </div>
              <h2 className="font-serif text-2xl text-white">No property videos yet</h2>
              <p className="mt-2 max-w-md text-sm text-text-secondary/60">
                Uploaded house videos will appear here once listings with video tours are published.
              </p>
              <Link
                href="/properties"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/6 bg-white/4 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/8"
              >
                Browse properties
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Desktop: Card grid layout */}
        <div className="hidden lg:block">
          <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {videoProperties.length > 0 ? (
              <div className="grid gap-6 xl:grid-cols-3">
                {videoProperties.map((property) => (
                  <article
                    key={property.id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#0a0a0a] shadow-[0_16px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                  >
                    {/* Video - reduced aspect ratio */}
                    <div className="relative aspect-video overflow-hidden bg-[#111]">
                      <video
                        src={property.media.video}
                        poster={property.media.images[0]?.url}
                        autoPlay
                        loop
                        playsInline
                        muted
                        preload="metadata"
                        className="size-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

                      {/* Play indicator on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex size-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                          <Play className="size-7 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>

                      {/* Badges */}
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

                    {/* Details below video */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Property type */}
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/70">
                        {property.propertyType}
                      </p>

                      {/* Title */}
                      <h2 className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-gold-light">
                        {property.title}
                      </h2>

                      {/* Location */}
                      <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                        <MapPin className="size-4 shrink-0 text-gold/70" />
                        <span className="min-w-0 truncate">
                          {property.district}
                          {property.sector ? `, ${property.sector}` : ""}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="mt-3 grid grid-cols-3 gap-2 text-sm font-semibold text-white/85">
                        <span className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/4 px-2">
                          <Bed className="size-3.5 shrink-0 text-gold/65" />
                          <span className="truncate">{property.bedrooms} bed</span>
                        </span>
                        <span className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/4 px-2">
                          <Bath className="size-3.5 shrink-0 text-gold/65" />
                          <span className="truncate">{property.bathrooms} bath</span>
                        </span>
                        <span className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white/4 px-2">
                          <Square className="size-3.5 shrink-0 text-gold/65" />
                          <span className="truncate">
                            {property.sizeSqM ? `${property.sizeSqM} m2` : property.propertyType}
                          </span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-secondary/60">
                        {property.description}
                      </p>

                      {/* Price + Details */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary/45">
                            Price
                          </p>
                          <p className="mt-0.5 truncate text-xl font-black tracking-tight text-gold-light">
                            {formatMoney(property.finalDisplayPrice, property.purpose)}
                          </p>
                        </div>
                        <Link
                          href={`/properties/${property.id}`}
                          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-black text-black transition-colors hover:bg-gold-light"
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
              <div className="flex min-h-[48vh] flex-col items-center justify-center rounded-2xl border border-white/6 bg-white/3 px-4 py-20 text-center">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/6 bg-white/4">
                  <Home className="size-8 text-text-secondary/40" />
                </div>
                <h2 className="font-serif text-2xl text-white">No property videos yet</h2>
                <p className="mt-2 max-w-md text-sm text-text-secondary/60">
                  Uploaded house videos will appear here once listings with video tours are published.
                </p>
                <Link
                  href="/properties"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/6 bg-white/4 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/8"
                >
                  Browse properties
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function MobileVideoFeed({ properties }: { properties: any[] }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 pt-20 pb-8">
      {properties.map((property, index) => (
        <MobileVideoCard key={property.id} property={property} index={index} total={properties.length} />
      ))}
    </div>
  );
}

function MobileVideoCard({ property, index, total }: { property: any; index: number; total: number }) {
  return (
    <article className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/8 bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      {/* Video - TikTok-style 9:16 centered */}
      <div className="relative aspect-[9/16] overflow-hidden bg-[#111]">
        <video
          src={property.media.video}
          poster={property.media.images[0]?.url}
          autoPlay
          loop
          playsInline
          muted
          preload="metadata"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#000]/95 via-[#000]/10 to-[#000]/30" />

        {/* Counter */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-center px-4 pt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1.5 text-[11px] font-bold text-white/80 backdrop-blur-md">
            <Play className="size-3 fill-current text-gold-light" />
            {index + 1} / {total}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-12 z-20 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-light backdrop-blur-md">
            <Play className="size-2.5 fill-current" />
            {property.purpose}
          </span>
          {property.isOwnerVerified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#000]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <ShieldCheck className="size-3 text-gold-light" />
              Verified
            </span>
          )}
        </div>

        {/* Bottom overlay content */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4">
          {/* Property info */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/80">
            {property.propertyType}
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-white drop-shadow-lg line-clamp-2">
            {property.title}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="size-3 shrink-0 text-gold/70" />
            <span className="truncate">
              {property.district}
              {property.sector ? `, ${property.sector}` : ""}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-white/80">
            <span className="flex items-center gap-1">
              <Bed className="size-3 text-gold/60" />
              {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3 text-gold/60" />
              {property.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Square className="size-3 text-gold/60" />
              {property.sizeSqM ? `${property.sizeSqM} m2` : property.propertyType}
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 rounded-xl bg-[#000]/60 px-3 py-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-secondary/50">
                  Price
                </p>
                <p className="text-lg font-black tracking-tight text-gold-light">
                  {formatMoney(property.finalDisplayPrice, property.purpose)}
                </p>
              </div>
              <Link
                href={`/properties/${property.id}`}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gold px-4 text-xs font-black text-black transition-colors active:scale-95"
              >
                Details
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
