import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { PaymentStatus, PropertyStatus } from "@/prisma/generated/client";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const propertyId = request.nextUrl.searchParams.get("property_id");

  if (!sessionId || !propertyId) {
    return NextResponse.redirect(new URL("/payments/error", request.url));
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.redirect(new URL(`/payments/${propertyId}?error=stripe_not_configured`, request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await prisma.$transaction(async (tx) => {
        await tx.payment.updateMany({
          where: { provider_reference: sessionId },
          data: { status: PaymentStatus.paid },
        });

        await tx.property.update({
          where: { id: Number(propertyId) },
          data: { status: PropertyStatus.paid },
        });
      });
    }

    return NextResponse.redirect(new URL(`/properties/${propertyId}?payment=success`, request.url));
  } catch {
    return NextResponse.redirect(new URL(`/payments/${propertyId}?error=stripe_error`, request.url));
  }
}
