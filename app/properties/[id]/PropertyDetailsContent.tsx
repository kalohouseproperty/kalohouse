"use client";

import {  
  ArrowLeft, ArrowRight, Heart,  
  Bed, Bath, Utensils, Sofa, Car, Navigation,  
  Shield, Wifi, CreditCard, Video, Play,  
  CheckCircle2, XCircle, MapPinned,  
  Phone, Mail, Lock, Unlock, UserRound, RefreshCw, RotateCcw  
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { requestRefund } from "../../actions/visits";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center font-serif text-gray-400">Loading Map...</div>
});

import { PaymentProtectionCard } from "@/components/cards/PaymentProtectionCard";
import { VerifiedBadge } from "@/components/cards/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PropertyImage } from "@/components/ui/property-image";
import { formatMoney } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import type { Property, User } from "@/types/models";
import { useKalohouse } from "@/components/providers/KalohouseProvider";
import { cn } from "@/lib/utils";

interface PropertyDetailsContentProps {
  property: Property;
  verification: { notes: string | null } | null;
  hasPaid: boolean;
  hasUnlockedContact: boolean;
  currentUser: User | null;
  isSaved?: boolean;
  paymentId?: number | null;
  hasRefund?: boolean;
}

export function PropertyDetailsContent({
  property,
  hasPaid,
  hasUnlockedContact,
  currentUser,
  isSaved,
  paymentId,
  hasRefund,
}: PropertyDetailsContentProps) {
  const { toggleSaveProperty, saved_property_ids } = useKalohouse();

  const isVisitor = !currentUser;
  const isUserVerified = currentUser?.isVerified || false;
  const isOwnerVerified = property.isOwnerVerified;
  const canViewContact = isOwnerVerified || hasUnlockedContact;
  const saved = isSaved !== undefined ? isSaved : saved_property_ids.includes(property.id);
  const paymentHref = isVisitor
  ? `/auth?mode=signup&next=${encodeURIComponent(`/payments/${property.id}`)}`
  : `/payments/${property.id}`;

  const googleMapsUrl = property.latitude && property.longitude
  ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
  : "#";

  const securityFeatures = [
    { label: "Fence", status: property.hasFence },
    { label: "CCTV", status: property.hasCctv },
    { label: "Security Guard", status: property.hasSecurityGuard },
    { label: "Gated Community", status: property.isGatedCommunity },
  ];

  const internetFeatures = [
    { label: "Fiber", status: property.hasFiber },
    { label: "Canalbox", status: property.hasCanalbox },
    { label: property.otherInternet || "Other Providers", status: Boolean(property.otherInternet) },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroMedia, setHeroMedia] = useState<"video" | "image">(property.media.video ? "video" : "image");
  const [isPaused, setIsPaused] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [refundRequested, setRefundRequested] = useState(hasRefund || false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  const handleRequestRefund = async () => {
    if (!paymentId) return;
    setRefunding(true);
    try {
      await requestRefund(paymentId, refundReason || "Client requested refund via property page");
      setRefundRequested(true);
      setShowRefundModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setRefunding(false);
    }
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % property.media.images.length);
  }, [property.media.images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + property.media.images.length) % property.media.images.length);
  }, [property.media.images.length]);

  useEffect(() => {
    if (heroMedia !== "image" || property.media.images.length <= 1 || isPaused) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [heroMedia, isPaused, property.media.images.length, nextImage]);

  return (
    <main className="min-h-screen bg-main-bg text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Actions */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="secondary" className="rounded-xl border border-white/5">
              <Link href="/properties" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                Browse properties
              </Link>
            </Button>
            <LanguageSwitcher />
          </div>
          <Button
            variant={saved ? "default" : "secondary"}
            className="rounded-xl border border-white/5"
            onClick={() => toggleSaveProperty(property.id, property)}
            >
            <Heart className={cn("size-4 mr-2", saved && "fill-current")} />
            {saved ? "Saved" : "Save for later"}
          </Button>
        </div>

        {/* Hero Media + Gallery */}
        <section className="space-y-3">
          {/* Hero */}
          <div
            className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Animated Image Slideshow */}
            {heroMedia === "image" && (
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <PropertyImage
                      src={getMediaUrl(property.media.images[currentImageIndex]?.url)}
                      alt={property.media.images[currentImageIndex]?.label || "Property view"}
                      fill
                      priority
                      className="object-cover cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Arrows */}
                {property.media.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm"
                    >
                      <ArrowLeft className="size-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm"
                    >
                      <ArrowRight className="size-5" />
                    </button>

                  </>
                )}
              </div>
            )}
            {/* Video */}
            {heroMedia === "video" && property.media.video && (
              <video
                src={property.media.video}
                autoPlay
                loop
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="rounded-full bg-main-bg/70 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold border border-gold/30">
                {property.propertyType}
              </span>
              {isOwnerVerified && <VerifiedBadge />}
            </div>
            {property.media.images[currentImageIndex]?.label && (
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs text-white/80">
                  {property.media.images[currentImageIndex].label}
                </span>
              </div>
            )}
            {/* Switch to video / View Photos toggle */}
            {heroMedia === "image" && property.media.video && (
              <button
                onClick={() => setHeroMedia("video")}
                className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-gold/90 hover:bg-gold px-4 py-2 text-xs font-bold text-main-bg shadow-lg transition-all"
              >
                <Play className="size-3.5" />
                Watch Tour
              </button>
            )}
            {heroMedia === "video" && (
              <button
                onClick={() => setHeroMedia("image")}
                className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white shadow-lg transition-all"
              >
                <ArrowLeft className="size-3.5" />
                View Photos
              </button>
            )}
            {/* Image count badge (only when no video) */}
            {heroMedia === "image" && !property.media.video && (
              <div className="absolute bottom-4 right-4 z-10">
                <span className="rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs text-white/70">
                  {currentImageIndex + 1} / {property.media.images.length}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {property.media.video && (
              <button
                onClick={() => { setHeroMedia("video"); }}
                className={cn(
                  "relative shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                  heroMedia === "video" ? "border-gold ring-1 ring-gold/30" : "border-white/10 opacity-70 hover:opacity-100"
                )}
              >
                <div className="aspect-[4/3] h-20 flex items-center justify-center bg-black/80">
                  <Play className="size-6 text-gold" />
                </div>
              </button>
            )}
            {property.media.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentImageIndex(idx); setHeroMedia("image"); }}
                className={cn(
                  "relative shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                  heroMedia === "image" && currentImageIndex === idx ? "border-gold ring-1 ring-gold/30" : "border-white/10 opacity-70 hover:opacity-100"
                )}
              >
                <div className="aspect-[4/3] h-20">
                  <PropertyImage
                    src={getMediaUrl(img.url)}
                    alt={img.label || `Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {img.label && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4">
                    <span className="text-[9px] font-medium text-white/80 truncate block">{img.label}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>


        {/* Two-Column Detail Layout */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* Left Column (Full Specs) */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gold/20">
                  {property.purpose}
                </span>
                <span className="text-text-secondary font-medium">Verified by Kalohouse Agents</span>
              </div>
              <div className="mb-6">
                <h1 className="font-serif text-5xl leading-tight">{property.title}</h1>
              </div>
              <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
                {property.description}
              </p>
            </div>

            {/* Address Details */}
            <Card className="p-8 glass-card border-white/10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-serif text-2xl mb-2">Location</h3>
                  <p className="text-text-secondary">Full verified address down to the village level.</p>
                </div>
                <Button asChild variant="secondary" className="rounded-xl border-white/10">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-4 mr-2" />
                    Open in Maps
                  </a>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div><p className="text-gold font-bold uppercase tracking-widest text-[10px] mb-1">District</p><p className="font-medium">{property.district}</p></div>
                <div><p className="text-gold font-bold uppercase tracking-widest text-[10px] mb-1">Sector</p><p className="font-medium">{property.sector}</p></div>
                <div><p className="text-gold font-bold uppercase tracking-widest text-[10px] mb-1">Cell</p><p className="font-medium">{property.cell || "N/A"}</p></div>
                <div><p className="text-gold font-bold uppercase tracking-widest text-[10px] mb-1">Village</p><p className="font-medium">{property.village || "N/A"}</p></div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-gold font-bold uppercase tracking-widest text-[10px] mb-1">Street Address</p>
                <p className="text-lg font-medium">{property.street || property.address}</p>
              </div>
            </Card>

            {/* Owner Contact Card - shown when verified or unlocked */}
            {canViewContact && property.ownerFullName && (
              <Card className="p-8 glass-card border-gold/20 bg-gold/5">
                <div className="flex items-center gap-3 mb-6">
                  <UserRound className="size-5 text-gold" />
                  <h3 className="font-serif text-xl">Owner Contact</h3>
                  {isOwnerVerified ? (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      Verified Owner
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
                      <Unlock className="size-3" />
                      Contact Unlocked
                    </span>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <UserRound className="size-5 text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Name</p>
                      <p className="font-medium">{property.ownerFullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Phone className="size-5 text-gold shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Phone</p>
                      <p className="font-medium">{property.ownerPhone}</p>
                    </div>
                  </div>
                  {property.ownerEmail && (
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Mail className="size-5 text-gold shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Email</p>
                        <p className="font-medium">{property.ownerEmail}</p>
                      </div>
                    </div>
                  )}
                  {property.ownerWhatsapp && (
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Phone className="size-5 text-gold shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">WhatsApp</p>
                        <p className="font-medium">{property.ownerWhatsapp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Bedrooms", val: property.bedrooms, icon: Bed },
                { label: "Bathrooms", val: property.bathrooms, icon: Bath },
                { label: "Kitchens", val: property.kitchens, icon: Utensils },
                { label: "Living Rooms", val: property.livingRooms, icon: Sofa },
                { label: "Parking", val: `${property.parkingCapacity} Cars`, icon: Car },
              ].map((spec) => (
                <div key={spec.label} className="glass-card p-6 rounded-[2rem] border-white/5 flex flex-col items-center text-center gap-3 group hover:border-gold/30 transition-all">
                  <spec.icon className="size-6 text-gold/60 group-hover:text-gold transition-colors" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">{spec.label}</p>
                    <p className="text-xl font-black">{spec.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features Checklists */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 glass-card border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="size-5 text-gold" />
                  <h3 className="font-serif text-xl">Security Features</h3>
                </div>
                <div className="space-y-4">
                  {securityFeatures.map(f => (
                    <div key={f.label} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">{f.label}</span>
                      {f.status ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-white/10" />}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 glass-card border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Wifi className="size-5 text-gold" />
                  <h3 className="font-serif text-xl">Internet & Connectivity</h3>
                </div>
                <div className="space-y-4">
                  {internetFeatures.map(f => (
                    <div key={f.label} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">{f.label}</span>
                      {f.status ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-white/10" />}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Location Map Section */}
            <Card className="p-8 glass-card border-white/10 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Navigation className="size-5 text-gold" />
                  <h3 className="font-serif text-xl">Property Location</h3>
                </div>
                <Button asChild variant="secondary" size="sm" className="rounded-xl">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                  </a>
                </Button>
              </div>
              <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                <LeafletMap 
                  properties={[property]} 
                  center={property.latitude && property.longitude ? [Number(property.latitude), Number(property.longitude)] : undefined}
                  zoom={15}
                />
              </div>
              <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <MapPinned className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gold/80 mb-1">Precise Address</p>
                  <p className="text-sm font-medium text-text-secondary">{property.address}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            {/* Pricing Card */}
            <Card className="p-8 glass-card border-gold/30 bg-gold/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-gold px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest text-main-bg">
                {isOwnerVerified ? "Guaranteed Price" : "Listed Price"}
              </div>
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold/80 mb-2">
                  {isOwnerVerified ? "Total Display Price" : "Owner Price"}
                </p>
                <h2 className="text-5xl font-black tracking-tighter text-gold-light mb-2">
                  {formatMoney(property.ownerPrice, property.purpose)}
                </h2>
                {!isOwnerVerified && (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">+ {formatMoney(property.commissionAmount)} Commission to unlock contact</span>
                  </div>
                )}
                {isOwnerVerified && (
                  <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Final: {formatMoney(property.finalDisplayPrice, property.purpose)}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {!isOwnerVerified && !canViewContact && (
                  <Button
                    className="w-full h-16 rounded-2xl bg-gold hover:bg-gold-light text-main-bg font-black text-lg shadow-xl shadow-gold/20 transition-all active:scale-95"
                    asChild={!isVisitor}
                  >
                    {isVisitor ? (
                      <Link href={`/auth?mode=signup&next=${encodeURIComponent(`/properties/${property.id}`)}`}>
                        Create Account to Unlock Contact
                      </Link>
                    ) : (
                      <Link href={`/payments/${property.id}?type=unlock`}>
                        <Unlock className="size-5" />
                        Pay {formatMoney(property.commissionAmount)} to Contact Owner
                      </Link>
                    )}
                  </Button>
                )}
                {!isOwnerVerified && canViewContact && (
                  <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
                    <p className="text-sm font-bold text-success flex items-center gap-2">
                      <Unlock className="size-4" />
                      Contact Unlocked
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">You can now contact the owner directly.</p>
                  </div>
                )}
                {isOwnerVerified && (
                  <>
                    <Button 
                      className="w-full h-16 rounded-2xl bg-gold hover:bg-gold-light text-main-bg font-black text-lg shadow-xl shadow-gold/20 transition-all active:scale-95"
                      asChild={!hasPaid}
                      disabled={hasPaid}
                    >
                      {hasPaid ? (
                        "Already Paid"
                      ) : (
                        <Link href={paymentHref}>
                          <CreditCard className="size-5" />
                          {isVisitor ? "Create Account to Purchase" : "Purchase / Pay Now"}
                        </Link>
                      )}
                    </Button>
                    <p className="text-center text-xs leading-relaxed text-text-secondary/70">
                      Your payment goes to Nyumbanziza, commission is deducted, and the remaining is transferred to the verified owner.
                    </p>
                    {hasPaid && !refundRequested && (
                      <Button
                        variant="danger"
                        className="w-full h-14 rounded-2xl font-bold transition-all active:scale-95"
                        onClick={() => setShowRefundModal(true)}
                      >
                        <RotateCcw className="size-4 mr-2" />
                        Request Refund
                      </Button>
                    )}
                    {refundRequested && (
                      <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
                        <p className="text-sm font-bold text-warning flex items-center gap-2">
                          <RefreshCw className="size-4" />
                          Refund Requested
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">Your refund request is being reviewed. You will be notified via email.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>

            <PaymentProtectionCard />
          </aside>
        </section>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-[90vw] h-[90vh] max-w-[800px] max-h-[800px]">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close image"
            >
              <XCircle className="size-6 text-white" />
            </button>
            {/* Image */}
            <PropertyImage
              src={getMediaUrl(property.media.images[currentImageIndex]?.url)}
              alt={property.media.images[currentImageIndex]?.label || `Property image ${currentImageIndex + 1}`}
              fill
              className="object-contain rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out"
              style={{ transform: isModalOpen ? 'scale(1)' : 'scale(0.9)' }}
            />
            {/* Navigation Arrows */}
            {property.media.images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setCurrentImageIndex((prev) => (prev - 1 + property.media.images.length) % property.media.images.length);
                  }}
                  className="absolute left-4 top-[50%] -translate-y-[50%] z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="size-6 text-white" />
                </button>
                <button
                  onClick={() => {
                    setCurrentImageIndex((prev) => (prev + 1) % property.media.images.length);
                  }}
                  className="absolute right-4 top-[50%] -translate-y-[50%] z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ArrowRight className="size-6 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 max-w-lg w-[90vw] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-danger/10 flex items-center justify-center">
                  <RotateCcw className="size-5 text-danger" />
                </div>
                <h3 className="font-serif text-2xl">Request Refund</h3>
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <XCircle className="size-5 text-text-secondary" />
              </button>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              You are requesting a refund for <strong className="text-text-primary">{property.title}</strong>. Please provide a reason for your refund request.
            </p>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-text-secondary">Reason for Refund</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-colors resize-none text-sm"
                placeholder="Describe why you are requesting a refund..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 h-12 rounded-xl"
                onClick={() => setShowRefundModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1 h-12 rounded-xl font-bold"
                onClick={handleRequestRefund}
                disabled={refunding}
              >
                {refunding ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="size-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-text">
              By submitting, you agree to our <Link href="/refund-policy" className="text-gold hover:underline">Refund Policy</Link>.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
