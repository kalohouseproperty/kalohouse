"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";
import { getAuthorizedUser, authorizeRole } from "../../lib/auth-utils";
import { PropertyStatus, VerificationStatus, UserRole } from "@/prisma/generated/client";
import { toPrismaPropertyPurpose } from "@/lib/dal";
import { validatePropertyNumericFields } from "@/lib/property-limits";
import { getOrCreateSectorId } from "@/lib/sectors";
import { Prisma } from "@/prisma/generated/client/client";

export async function submitProperty(formData: FormData) {
  try {
    const user = await getAuthorizedUser();
    if (!user) {
      return { success: false, error: "Unauthorized: Please log in" };
    }

    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const purposeRaw = formData.get("purpose") as string;
    const purpose = toPrismaPropertyPurpose(purposeRaw);
    if (!purpose) {
      return {
        success: false,
        error: "Invalid listing purpose. Choose Rent or Sale.",
      };
    }
    const propertyType = formData.get("propertyType") as string;
    const ownerPriceStr = formData.get("ownerPrice") as string;
    const district = formData.get("district") as string;
    const sector = formData.get("sector") as string;
    const cell = formData.get("cell") as string | null;
    const address = formData.get("address") as string;

    // Spaces
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const kitchens = parseInt(formData.get("kitchens") as string) || 0;
    const livingRooms = parseInt(formData.get("livingRooms") as string) || 0;
    const sizeSqMStr = formData.get("sizeSqM") as string;
    const parkingCapacity = parseInt(formData.get("parkingCapacity") as string) || 0;

    // Amenities
    const hasFence = formData.get("hasFence") === "true";
    const hasCctv = formData.get("hasCctv") === "true";
    const hasSecurityGuard = formData.get("hasSecurityGuard") === "true";
    const isGatedCommunity = formData.get("isGatedCommunity") === "true";
    const hasFiber = formData.get("hasFiber") === "true";

    // Location
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;

    // Owner info
    const ownerFullName = formData.get("ownerFullName") as string;
    const ownerPhone = formData.get("ownerPhone") as string;
    const ownerEmail = formData.get("ownerEmail") as string;
    const ownerWhatsapp = formData.get("ownerWhatsapp") as string;
    const ownerAltPhone = formData.get("ownerAltPhone") as string;

    const bedroomsRaw = formData.get("bedrooms") as string;
    const bathroomsRaw = formData.get("bathrooms") as string;
    const kitchensRaw = formData.get("kitchens") as string;
    const livingRoomsRaw = formData.get("livingRooms") as string;

    // Validate required fields (room counts may be 0)
    if (
      !title.trim() ||
      !description.trim() ||
      !ownerPriceStr ||
      !propertyType ||
      bedroomsRaw === null ||
      bedroomsRaw === "" ||
      bathroomsRaw === null ||
      bathroomsRaw === "" ||
      kitchensRaw === null ||
      kitchensRaw === "" ||
      livingRoomsRaw === null ||
      livingRoomsRaw === "" ||
      !sizeSqMStr ||
      !district ||
      !sector ||
      !cell?.trim() ||
      !address.trim() ||
      !ownerFullName.trim() ||
      !ownerPhone.trim() ||
      !ownerEmail.trim()
    ) {
      return { success: false, error: "All required fields must be filled" };
    }

    const numericError = validatePropertyNumericFields(ownerPriceStr, sizeSqMStr);
    if (numericError) {
      return { success: false, error: numericError };
    }

    // Parse numbers (within DB Decimal limits)
    const ownerPrice = new Prisma.Decimal(ownerPriceStr);
    const sizeSqM = new Prisma.Decimal(sizeSqMStr);

    // Read Cloudinary URLs (uploaded directly from browser)
    const imageUrls = formData.getAll("imageUrl") as string[];
    const imagePublicIds = formData.getAll("imagePublicId") as string[];
    const imageEntries: { url: string; label?: string; publicId?: string }[] = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const label = formData.get(`imageLabel_${i}`) as string | null;
      imageEntries.push({
        url: imageUrls[i],
        label: label?.trim() || undefined,
        publicId: imagePublicIds[i] || undefined,
      });
    }

    const videoUrl = formData.get("videoUrl") as string | null;
    const videoPublicId = formData.get("videoPublicId") as string | undefined;

    if (imageEntries.length < 9) {
      return {
        success: false,
        error: "All 9 property images are required",
      };
    }

    const sectorId = await getOrCreateSectorId(district, sector);
    const commissionRate = new Prisma.Decimal("0.10"); // 10% default
    const commissionAmount = ownerPrice.mul(commissionRate).toDecimalPlaces(2);
    const finalDisplayPrice = ownerPrice.add(commissionAmount);

    // Create property in database
    const property = await prisma.property.create({
      data: {
        title,
        description,
        purpose,
        district,
        sector,
        sector_id: sectorId,
        cell: cell || "",
        address,
        property_type: propertyType,
        bedrooms,
        bathrooms,
        kitchens,
        living_rooms: livingRooms,
        size_sq_m: sizeSqM,
        parking_capacity: parkingCapacity,
        has_fence: hasFence,
        has_cctv: hasCctv,
        has_security_guard: hasSecurityGuard,
        is_gated_community: isGatedCommunity,
        has_fiber: hasFiber,
        owner_full_name: ownerFullName,
        owner_phone: ownerPhone,
        owner_whatsapp: ownerWhatsapp || "",
        owner_email: ownerEmail,
        owner_alt_phone: ownerAltPhone || "",
        owner_price: ownerPrice,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        final_display_price: finalDisplayPrice,
        contact_info: `${ownerFullName} - ${ownerPhone}`,
        status: PropertyStatus.pending_verification,
        owner_id: user.id,
        latitude: latitude ? new Prisma.Decimal(latitude) : null,
        longitude: longitude ? new Prisma.Decimal(longitude) : null,
      },
    });

    // Create PropertyMedia records for images
    for (const entry of imageEntries) {
      await prisma.propertyMedia.create({
        data: {
          property_id: property.id,
          uploaded_by_id: user.id,
          media_type: "image",
          url: entry.url,
          label: entry.label,
          storage_provider: "cloudinary",
          public_id: entry.publicId,
        },
      });
    }

    // Create PropertyMedia record for video (if uploaded)
    if (videoUrl) {
      await prisma.propertyMedia.create({
        data: {
          property_id: property.id,
          uploaded_by_id: user.id,
          media_type: "video",
          url: videoUrl,
          storage_provider: "cloudinary",
          public_id: videoPublicId,
        },
      });
    }

    revalidatePath("/dashboard/owner");
    revalidatePath("/");

    return {
      success: true,
      propertyId: property.id,
    };
  } catch (error) {
    console.error("Submit property error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2020") {
        return {
          success: false,
          error:
            "Price or size is too large. Use a realistic amount (max price 9,999,999,999.99 RWF).",
        };
      }
      if (error.code === "P2003") {
        return {
          success: false,
          error:
            "Could not link property to the selected sector. Please re-select district and sector.",
        };
      }
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit property",
    };
  }
}

export async function verifyProperty(propertyId: number, approved: boolean, notes?: string, rejectionReason?: string) {
  const agent = await authorizeRole([UserRole.agent, UserRole.admin]);
  if (!agent) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (agent.role !== UserRole.admin && property.assigned_agent_id !== agent.id) {
    throw new Error("Property is not assigned to you");
  }

  const status = approved ? PropertyStatus.published : PropertyStatus.rejected;

  await prisma.$transaction([
    prisma.property.update({
      where: { id: propertyId },
      data: { 
        status,
        rejection_reason: rejectionReason || null,
        assigned_agent_id: agent.id, // Record the person who performed the verification
        is_owner_verified: approved ? true : undefined,
      },
    }),
    prisma.verification.upsert({
      where: { property_id: propertyId },
      update: {
        status: approved ? VerificationStatus.approved : VerificationStatus.rejected,
        notes: notes || null,
        rejection_reason: rejectionReason || null,
        agent_id: agent.id,
      },
      create: {
        property_id: propertyId,
        agent_id: agent.id,
        status: approved ? VerificationStatus.approved : VerificationStatus.rejected,
        notes: notes || null,
        rejection_reason: rejectionReason || null,
      },
    }),
  ]);

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/properties");
  revalidatePath("/dashboard/agent");
  revalidatePath("/");
}

export async function toggleSaveProperty(propertyId: number) {
  const user = await getAuthorizedUser();

  return { success: true };
}

export async function getPendingPropertiesForAdmin() {
  const admin = await authorizeRole([UserRole.admin]);
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }

  const pendingProperties = await prisma.property.findMany({
    where: {
      status: {
        in: [PropertyStatus.pending_verification, PropertyStatus.agent_assigned],
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          full_name: true,
          email: true,
        }
      },
      verification: true,
      media: {
        where: {
          media_type: "image"
        },
        orderBy: {
          created_at: "asc"
        }
      }
    },
    orderBy: {
      created_at: "desc"
    }
  });

  // Convert Decimal fields to numbers and ensure media is properly serialized
  return pendingProperties.map(property => {
    return {
      ...property,
      owner_price: property.owner_price ? Number(property.owner_price) : 0,
      commission_rate: property.commission_rate ? Number(property.commission_rate) : 0,
      commission_amount: property.commission_amount ? Number(property.commission_amount) : 0,
      final_display_price: property.final_display_price ? Number(property.final_display_price) : 0,
      size_sq_m: property.size_sq_m ? Number(property.size_sq_m) : null,
      latitude: property.latitude ? Number(property.latitude) : null,
      longitude: property.longitude ? Number(property.longitude) : null,
      media: property.media || [],
    };
  });
}
