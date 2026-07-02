import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowRight, Home, Play, Video } from "lucide-react";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getPublishedProperties } from "@/lib/dal";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { VideoCard, MobileVideoCard } from "./VideoCards";
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
        {/* Header */}
        <div className="pt-16">
          <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light">
                  <Video className="size-3.5" />
                  Video Tours
                </div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Property Videos
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary/70 sm:text-base">
                  Watch video tours uploaded by property owners
                </p>
              </div>
              {videoProperties.length > 0 && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-white/80">
                  <Play className="size-4 text-gold-light" />
                  {videoProperties.length} {videoProperties.length === 1 ? "video" : "videos"}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Video Grid */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {videoProperties.length > 0 ? (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videoProperties.map((property) => (
                  <VideoCard key={property.id} property={property as any} />
                ))}
              </div>

              {/* Mobile feed */}
              <div className="sm:hidden flex flex-col items-center gap-4 pt-4">
                {videoProperties.map((property, index) => (
                  <MobileVideoCard
                    key={property.id}
                    property={property as any}
                    index={index}
                    total={videoProperties.length}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-white/6 bg-white/3 px-4 py-20 text-center">
              <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-white/6 bg-white/4">
                <Home className="size-8 text-text-secondary/40" />
              </div>
              <h2 className="font-serif text-2xl text-white">No videos yet</h2>
              <p className="mt-2 max-w-md text-sm text-text-secondary/60">
                Property video tours will appear here once published.
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
      </main>
    </>
  );
}
