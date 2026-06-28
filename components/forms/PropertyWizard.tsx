"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rwandaLocation } from "@devrw/rwanda-location";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Building2,
  LayoutGrid,
  MapPinned,
  Images,
  UserRound,
  AlertCircle,
  Loader2,
  BedDouble,
  Bath,
  UtensilsCrossed,
  Sofa,
  Car,
  Fence,
  Cctv,
  ShieldCheck,
  Building,
  Wifi,
  Sparkles,
  Trash2,
  Banknote,
  Home,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/map/LocationPicker";
import { cn } from "@/lib/utils";
import type { PropertyPurpose } from "@/types/models";
import { submitProperty } from "@/app/actions/properties";
import { uploadFileToCloudinaryFromBrowser } from "@/lib/upload-to-cloudinary";
import {
  isPropertyPriceInRange,
  isPropertySizeInRange,
  MAX_OWNER_PRICE_RWF,
  MAX_SIZE_SQM,
} from "@/lib/property-limits";

interface PropertyWizardProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type AdminUnit = { code: number | string; name: string };

const STEPS = [
  { id: 1, name: "Basics", icon: Building2 },
  { id: 2, name: "Spaces", icon: LayoutGrid },
  { id: 3, name: "Location", icon: MapPinned },
  { id: 4, name: "Photos", icon: Images },
  { id: 5, name: "Contact", icon: UserRound },
] as const;

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Studio",
  "Commercial",
  "Office",
  "Shop",
  "Warehouse",
  "Garden",
  "Event Hall",
];

const TITLE_OPTIONS = [
  "Modern Apartment",
  "Spacious Family Home",
  "Cozy Studio",
  "Luxury Villa",
  "Newly Built House",
  "Furnished Apartment",
  "Elegant Townhouse",
  "Charming Bungalow",
  "Executive Office",
  "Retail Shop Space",
  "Warehouse Facility",
  "Commercial Property",
  "Garden Event Space",
  "Duplex Home",
  "Penthouse Suite",
];

const DESC_OPTIONS = [
  "A beautiful property located in a quiet neighborhood with easy access to amenities, schools, and shopping centers.",
  "This well-maintained property offers spacious rooms, modern finishes, and a welcoming atmosphere throughout.",
  "Located in a prime area, this property is perfect for families or professionals seeking comfort and convenience.",
  "A charming property with great natural light, ample space, and a serene environment ideal for peaceful living.",
  "Recently renovated with high-quality materials, modern fixtures, and attention to detail in every room.",
  "Perfect investment opportunity in a growing neighborhood with excellent road access and nearby infrastructure.",
  "Modern living space featuring open-plan design, premium finishes, and a secure gated environment.",
  "A property that combines comfort with style, offering generous living spaces and beautiful surroundings.",
  "Ideal for those seeking a move-in ready home with all essential amenities and community features.",
  "Spacious layout with well-proportioned rooms, abundant storage, and a private outdoor area.",
];

const AMENITIES = [
  { key: "hasFence", label: "Perimeter fence", icon: Fence },
  { key: "hasCctv", label: "CCTV", icon: Cctv },
  { key: "hasSecurityGuard", label: "Security guard", icon: ShieldCheck },
  { key: "isGatedCommunity", label: "Gated community", icon: Building },
  { key: "hasFiber", label: "Fiber internet", icon: Wifi },
] as const;

const ROOM_FIELDS = [
  { key: "bedrooms", label: "Bedrooms", icon: BedDouble },
  { key: "bathrooms", label: "Bathrooms", icon: Bath },
  { key: "kitchens", label: "Kitchens", icon: UtensilsCrossed },
  { key: "livingRooms", label: "Living rooms", icon: Sofa },
] as const;

const fieldClass =
  "bg-white/5 border-white/10 text-text-primary placeholder:text-muted-text focus:border-gold/50 focus:ring-gold/15";

const DRAFT_KEY = "propertyWizardDraft";

export function PropertyWizard({ onClose, onSuccess }: PropertyWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [provinceCode, setProvinceCode] = useState<number | "">("");
  const [districtCode, setDistrictCode] = useState<number | "">("");
  const [sectorCode, setSectorCode] = useState<string>("");
  const [cellCode, setCellCode] = useState<number | "">("");

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const [images, setImages] = useState<(File | null)[]>(Array(9).fill(null));
  const [imageLabels, setImageLabels] = useState<string[]>(Array(9).fill(""));
  const [video, setVideo] = useState<File | null>(null);

  const COMMON_LABELS = [
    "Living Room", "Master Bedroom", "Bedroom", "Kitchen", "Bathroom",
    "Dining Room", "Parking", "Garden", "Exterior", "Other"
  ] as const;
  const formDefault = {
    title: "",
    description: "",
    purpose: "Rent" as PropertyPurpose,
    propertyType: "Apartment",
    ownerPrice: "",
    sizeSqM: "",
    bedrooms: "0",
    bathrooms: "0",
    kitchens: "0",
    livingRooms: "0",
    parkingCapacity: "0",
    address: "",
    latitude: "",
    longitude: "",
    ownerFullName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerWhatsapp: "",
    ownerAltPhone: "",
  };
  const [form, setForm] = useState(formDefault);

  const amenitiesDefault = {
    hasFence: false,
    hasCctv: false,
    hasSecurityGuard: false,
    isGatedCommunity: false,
    hasFiber: false,
  };
  const [amenities, setAmenities] = useState(amenitiesDefault);

  // Persist draft across refreshes
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        setStep(p.step ?? 1);
        setProvinceCode(p.provinceCode ?? "");
        setDistrictCode(p.districtCode ?? "");
        setSectorCode(p.sectorCode ?? "");
        setCellCode(p.cellCode ?? "");
        setForm((prev) => ({ ...prev, ...p.form }));
        setAmenities((prev) => ({ ...prev, ...p.amenities }));
        if (p.imageLabels) setImageLabels(p.imageLabels);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data = JSON.stringify({
      step,
      provinceCode,
      districtCode,
      sectorCode,
      cellCode,
      form,
      amenities,
      imageLabels,
    });
    sessionStorage.setItem(DRAFT_KEY, data);
  }, [step, provinceCode, districtCode, sectorCode, cellCode, form, amenities, imageLabels]);

  const provinces = useMemo(() => rwandaLocation.getProvinces() ?? [], []);
  const districts = useMemo(
    () =>
      provinceCode
        ? (rwandaLocation.getDistricts(Number(provinceCode)) ?? [])
        : [],
    [provinceCode]
  );
  const sectors = useMemo(
    () =>
      districtCode
        ? (rwandaLocation.getSectors(Number(districtCode)) ?? [])
        : [],
    [districtCode]
  );
  const cells = useMemo(
    () => (sectorCode ? (rwandaLocation.getCells(sectorCode) ?? []) : []),
    [sectorCode]
  );
  const uploadedCount = images.filter(Boolean).length;
  const progress = (step / STEPS.length) * 100;

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateAmenities = (key: keyof typeof amenities, value: boolean) =>
    setAmenities((prev) => ({ ...prev, [key]: value }));

  const handleProvinceChange = (value: string) => {
    setProvinceCode(value ? Number(value) : "");
    setDistrictCode("");
    setSectorCode("");
    setCellCode("");
  };

  const handleDistrictChange = (value: string) => {
    setDistrictCode(value ? Number(value) : "");
    setSectorCode("");
    setCellCode("");
  };

  const handleSectorChange = (value: string) => {
    setSectorCode(value);
    setCellCode("");
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError(`Image ${index + 1} exceeds the 5MB limit`);
      return;
    }
    setError("");
    setImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const handleMultiUpload = (files: FileList | null) => {
    if (!files) return;
    setError("");
    const validFiles = Array.from(files).filter((f) => {
      if (f.size > MAX_IMAGE_SIZE) {
        setError(`"${f.name}" exceeds the 5MB limit`);
        return false;
      }
      return true;
    });
    setImages((prev) => {
      const next = [...prev];
      let slot = 0;
      for (const file of validFiles) {
        while (slot < next.length && next[slot] !== null) slot++;
        if (slot >= next.length) break;
        next[slot] = file;
        slot++;
      }
      return next;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          form.title &&
          form.description &&
          form.ownerPrice.trim() &&
          isPropertyPriceInRange(Number(form.ownerPrice)) &&
          form.propertyType
        );
      case 2:
        return (
          form.sizeSqM &&
          isPropertySizeInRange(Number(form.sizeSqM)) &&
          form.bedrooms !== "" &&
          form.bathrooms !== "" &&
          form.kitchens !== "" &&
          form.livingRooms !== ""
        );
      case 3:
        return (
          provinceCode &&
          districtCode &&
          sectorCode &&
          cellCode &&
          form.address.trim()
        );
      case 4:
        return uploadedCount >= 9;
      case 5:
        return (
          form.ownerFullName.trim() &&
          form.ownerPhone.trim() &&
          form.ownerEmail.trim()
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    const totalSize = images.reduce((sum, img) => sum + (img?.size ?? 0), 0) + (video?.size ?? 0);
    if (totalSize > 95 * 1024 * 1024) {
      setError("Total file size exceeds the 95MB limit. Compress images or reduce video size.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Upload files directly to Cloudinary (bypasses server body size limits)
      const uploads = await Promise.all(
        images.filter((img): img is File => img !== null).map((img) =>
          uploadFileToCloudinaryFromBrowser(img)
        )
      );

      let videoUpload: { secure_url: string; public_id: string } | null = null;
      if (video) {
        videoUpload = await uploadFileToCloudinaryFromBrowser(video);
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));

      const districtName = districts.find((d) => d.code === districtCode)?.name ?? "";
      const sectorName = sectors.find((s) => String(s.code) === sectorCode)?.name ?? "";
      const cellName = cells.find((c) => c.code === cellCode)?.name ?? "";

      formData.append("district", districtName);
      formData.append("sector", sectorName);
      formData.append("cell", cellName);

      Object.entries(amenities).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Send Cloudinary URLs instead of raw files
      uploads.forEach(({ secure_url, public_id }) => {
        formData.append("imageUrl", secure_url);
        formData.append("imagePublicId", public_id);
      });
      imageLabels.forEach((label, i) => {
        if (label.trim()) formData.append(`imageLabel_${i}`, label.trim());
      });

      if (videoUpload) {
        formData.append("videoUrl", videoUpload.secure_url);
        formData.append("videoPublicId", videoUpload.public_id);
      }

      const result = await submitProperty(formData);

      if (result.success) {
        setSuccess(true);
        sessionStorage.removeItem(DRAFT_KEY);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1800);
      } else {
        setError(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayPrice =
    form.ownerPrice && Number(form.ownerPrice) > 0
      ? Math.round(Number(form.ownerPrice) * 1.1).toLocaleString()
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-wizard-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-card gold-ring flex h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <header className="shrink-0 border-b border-white/8 bg-card-bg/90 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                New listing
              </p>
              <h1
                id="property-wizard-title"
                className="mt-1 font-serif text-2xl text-text-primary sm:text-3xl"
              >
                List your property
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Step {step} of {STEPS.length} · {STEPS[step - 1].name}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onClose}
              aria-label="Close"
              disabled={isSubmitting}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          <nav className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Wizard steps">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => done && setStep(s.id)}
                  disabled={s.id > step}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-[10px] font-semibold transition sm:flex-row sm:justify-center sm:gap-2 sm:px-2 sm:text-xs",
                    active &&
                      "border-gold/40 bg-gold/10 text-gold-light",
                    done &&
                      "border-success/30 bg-success/10 text-success cursor-pointer",
                    !active &&
                      !done &&
                      "border-white/6 bg-white/[0.02] text-muted-text cursor-not-allowed"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <Icon className="size-4 shrink-0" />
                  )}
                  <span className="hidden sm:inline">{s.name}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex gap-3 rounded-2xl border border-danger/30 bg-danger/10 p-4"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" />
              <div>
                <p className="text-sm font-semibold text-danger">Could not continue</p>
                <p className="mt-1 text-sm text-text-secondary">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 flex gap-3 rounded-2xl border border-success/30 bg-success/10 p-4"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">Property submitted</p>
                <p className="mt-1 text-sm text-text-secondary">
                  We&apos;ll review your listing shortly.
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepPanel key="step1">
                <StepIntro
                  icon={Building2}
                  title="Basic information"
                  description="Title, type, and pricing for your listing."
                />
                <Field label="Property title" required>
                  <Select
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select a title...</option>
                    {TITLE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Description" required>
                  <Select
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">Select a description...</option>
                    {DESC_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Property type" required>
                    <Select
                      value={form.propertyType}
                      onChange={(e) => update("propertyType", e.target.value)}
                      className={fieldClass}
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Listing purpose" required>
                    <Select
                      value={form.purpose}
                      onChange={(e) =>
                        update("purpose", e.target.value as PropertyPurpose)
                      }
                      className={fieldClass}
                    >
                      <option value="Rent">For rent</option>
                      <option value="Sale">For sale</option>
                    </Select>
                  </Field>
                </div>
                <Field label="Your price (RWF)" required>
                  <div className="relative">
                    <Banknote className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-text" />
                    <Input
                      type="number"
                      min={1}
                      max={MAX_OWNER_PRICE_RWF}
                      placeholder="500000"
                      value={form.ownerPrice}
                      onChange={(e) => update("ownerPrice", e.target.value)}
                      className={cn(fieldClass, "pl-11")}
                    />
                  </div>
                  <p className="text-xs text-text-secondary">
                    Maximum {MAX_OWNER_PRICE_RWF.toLocaleString("en-US")} RWF
                  </p>
                  {displayPrice && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                      <Sparkles className="size-4 text-gold" />
                      Buyers see{" "}
                      <span className="font-semibold text-gold-light">
                        {displayPrice} RWF
                      </span>{" "}
                      (includes 10% platform fee)
                    </p>
                  )}
                </Field>
              </StepPanel>
            )}

            {step === 2 && (
              <StepPanel key="step2">
                <StepIntro
                  icon={LayoutGrid}
                  title="Spaces & amenities"
                  description="Size, rooms, parking, and security features."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Size (m²)" required>
                    <Select
                      value={form.sizeSqM}
                      onChange={(e) => update("sizeSqM", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select size...</option>
                      {[30, 50, 75, 100, 120, 150, 200, 250, 300, 400, 500].map((s) => (
                        <option key={s} value={s}>{s} m²</option>
                      ))}
                    </Select>
                    <p className="text-xs text-text-secondary">
                      Maximum {MAX_SIZE_SQM.toLocaleString("en-US")} m²
                    </p>
                  </Field>
                  <Field label="Parking spaces">
                    <div className="relative">
                      <Car className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-text" />
                      <Select
                        value={form.parkingCapacity}
                        onChange={(e) => update("parkingCapacity", e.target.value)}
                        className={cn(fieldClass, "pl-11")}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "space" : "spaces"}</option>
                        ))}
                      </Select>
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ROOM_FIELDS.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-white/8 bg-white/[0.03] p-3"
                    >
                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
                        <Icon className="size-4 text-gold" />
                        {label}
                      </div>
                      <Select
                        value={form[key]}
                        onChange={(e) => update(key, e.target.value)}
                        className={cn("text-center", fieldClass)}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </Select>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-text-primary">Amenities</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {AMENITIES.map(({ key, label, icon: Icon }) => {
                      const checked = amenities[key];
                      return (
                        <label
                          key={key}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition",
                            checked
                              ? "border-gold/40 bg-gold/10 text-gold-light"
                              : "border-white/8 bg-white/[0.02] text-text-secondary hover:border-white/14"
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={(e) => updateAmenities(key, e.target.checked)}
                          />
                          <Icon className="size-4 shrink-0" />
                          <span className="text-sm font-medium">{label}</span>
                          {checked && <CheckCircle2 className="ml-auto size-4 text-gold" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </StepPanel>
            )}

            {step === 3 && (
              <StepPanel key="step3">
                <StepIntro
                  icon={MapPinned}
                  title="Location"
                  description="Rwanda administrative divisions and street address."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Province" required>
                    <Select
                      value={provinceCode === "" ? "" : String(provinceCode)}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select province</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="District" required>
                    <Select
                      value={districtCode === "" ? "" : String(districtCode)}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      disabled={!provinceCode}
                      className={fieldClass}
                    >
                      <option value="">Select district</option>
                      {districts.map((d) => (
                        <option key={String(d.code)} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Sector" required>
                    <Select
                      value={sectorCode}
                      onChange={(e) => handleSectorChange(e.target.value)}
                      disabled={!districtCode}
                      className={fieldClass}
                    >
                      <option value="">Select sector</option>
                      {sectors.map((s) => (
                        <option key={String(s.code)} value={String(s.code)}>
                          {s.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Cell" required>
                    <Select
                      value={cellCode === "" ? "" : String(cellCode)}
                      onChange={(e) =>
                        setCellCode(e.target.value ? Number(e.target.value) : "")
                      }
                      disabled={!sectorCode}
                      className={fieldClass}
                    >
                      <option value="">
                        {sectorCode ? "Select cell" : "Select sector first"}
                      </option>
                      {cells.map((c) => (
                        <option key={String(c.code)} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                {sectorCode && cells.length === 0 && (
                  <p className="text-sm text-danger">
                    No cells found for this sector. Try re-selecting the sector.
                  </p>
                )}
                <Field label="Street address" required>
                  <Textarea
                    placeholder="KN 3 Ave, near Kigali Heights..."
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={cn(fieldClass, "min-h-[88px]")}
                  />
                </Field>
                <LocationPicker
                  latitude={form.latitude}
                  longitude={form.longitude}
                  onLocationSelect={(lat, lng) => {
                    update("latitude", lat);
                    update("longitude", lng);
                  }}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Latitude (optional)">
                    <Input
                      type="number"
                      step="any"
                      placeholder="-1.9536"
                      value={form.latitude}
                      onChange={(e) => update("latitude", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Longitude (optional)">
                    <Input
                      type="number"
                      step="any"
                      placeholder="30.8739"
                      value={form.longitude}
                      onChange={(e) => update("longitude", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                </div>
              </StepPanel>
            )}

            {step === 4 && (
              <StepPanel key="step4">
                <StepIntro
                  icon={Images}
                  title="Property photos"
                  description="Upload all 9 images for the best visibility."
                />
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Upload progress</span>
                    <span className="font-bold text-gold-light">
                      {uploadedCount} / 9
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      animate={{ width: `${(uploadedCount / 9) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 py-4 text-sm font-semibold text-gold-light transition hover:bg-gold/10 hover:border-gold/50">
                    <Upload className="size-5" />
                    Upload all photos at once
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleMultiUpload(e.target.files)}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div
                        className={cn(
                          "relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed transition",
                          img
                            ? "border-gold/50"
                            : "border-white/12 bg-white/[0.02] hover:border-gold/30"
                        )}
                      >
                        {img ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`Property ${idx + 1}`}
                              className="size-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleImageUpload(idx, null)}
                              className="absolute right-2 top-2 rounded-lg bg-main-bg/80 p-1.5 text-danger backdrop-blur hover:bg-danger/20"
                              aria-label={`Remove image ${idx + 1}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
                        ) : (
                          <label className="flex size-full cursor-pointer flex-col items-center justify-center gap-1 p-2">
                            <Upload className="size-6 text-muted-text" />
                            <span className="text-xs text-text-secondary">Photo {idx + 1}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(idx, e.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                        )}
                      </div>
                      <select
                        value={imageLabels[idx]}
                        onChange={(e) => {
                          const next = [...imageLabels];
                          next[idx] = e.target.value;
                          setImageLabels(next);
                        }}
                        disabled={!img}
                        className={cn(
                          "w-full rounded-lg border bg-white/5 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 appearance-none",
                          img
                            ? "border-white/10 text-white/70 focus:border-gold/50 focus:ring-gold/20 cursor-pointer"
                            : "border-white/5 text-white/20"
                        )}
                      >
                        <option value="">{img ? "Select label..." : "Awaiting image"}</option>
                        {COMMON_LABELS.map((lbl) => (
                          <option key={lbl} value={lbl}>{lbl}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Video Upload */}
                <div className="pt-2">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Video className="size-4 text-gold" />
                    Property video <span className="text-text-secondary font-normal">(optional)</span>
                  </p>
                  <div
                    className={cn(
                      "rounded-2xl border-2 border-dashed transition",
                      video
                        ? "border-gold/40 bg-gold/5"
                        : "border-white/12 hover:border-gold/30"
                    )}
                  >
                    {video ? (
                      <div className="flex items-center gap-4 p-5">
                        <div className="rounded-xl bg-gold/20 p-3">
                          <Video className="size-6 text-gold-light" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-text-primary">
                            {video.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {(video.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setVideo(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center gap-2 p-8">
                        <Video className="size-8 text-muted-text" />
                        <span className="font-medium text-text-primary">
                          Upload a video tour
                        </span>
                        <span className="text-xs text-text-secondary">
                          MP4, WebM, or MOV (max 100MB)
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            if (file && file.size > MAX_VIDEO_SIZE) {
                              setError("Video exceeds the 100MB limit");
                              return;
                            }
                            setError("");
                            setVideo(file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </StepPanel>
            )}

            {step === 5 && (
              <StepPanel key="step5">
                <StepIntro
                  icon={UserRound}
                  title="Owner contact"
                  description="How buyers reach you."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <Input
                      placeholder="Jean Bosco"
                      value={form.ownerFullName}
                      onChange={(e) => update("ownerFullName", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Email" required>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.ownerEmail}
                      onChange={(e) => update("ownerEmail", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Phone" required>
                    <Input
                      placeholder="+250 788 123 456"
                      value={form.ownerPhone}
                      onChange={(e) => update("ownerPhone", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="WhatsApp">
                    <Input
                      placeholder="+250 788 123 456"
                      value={form.ownerWhatsapp}
                      onChange={(e) => update("ownerWhatsapp", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Alt. phone">
                    <Input
                      placeholder="+250 722 987 654"
                      value={form.ownerAltPhone}
                      onChange={(e) => update("ownerAltPhone", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                </div>

              </StepPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/8 bg-card-bg/90 px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1 || isSubmitting}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {step < STEPS.length ? (
            <Button
              type="button"
              onClick={() => {
                if (!canProceed()) {
                  setError("Please complete all required fields on this step.");
                  return;
                }
                setError("");
                setStep((s) => Math.min(s + 1, STEPS.length));
              }}
              disabled={isSubmitting}
            >
              Continue
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting || success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Home className="size-4" />
                  Submit property
                </>
              )}
            </Button>
          )}
        </footer>
      </motion.div>
    </div>
  );
}

function StepPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-2xl space-y-5"
    >
      {children}
    </motion.div>
  );
}

function StepIntro({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
        <Icon className="size-5 text-gold-light" />
      </div>
      <div>
        <h2 className="font-serif text-xl text-text-primary">{title}</h2>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
