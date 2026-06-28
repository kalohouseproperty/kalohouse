"use server";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import prisma from "../../lib/prisma";
import { authorizeRole, getAuthorizedUser } from "../../lib/auth-utils";
import { PaymentStatus, PropertyStatus, UserRole, VisitStatus } from "@/prisma/generated/client";
import crypto from "node:crypto";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

type MobileMoneyProvider = "mtn" | "airtel";

type MobileMoneyInput = {
  propertyId: number;
  provider: MobileMoneyProvider;
  phone: string;
};

function getProviderConfig(provider: MobileMoneyProvider) {
  if (provider === "mtn") {
    return {
      name: "MTN Mobile Money",
      url: process.env.MTN_MOMO_COLLECTION_URL,
      apiKey: process.env.MTN_MOMO_API_KEY,
    };
  }

  return {
    name: "Airtel Money",
    baseUrl: process.env.AIRTEL_MONEY_BASE_URL,
    clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
    clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
  };
}

async function getAirtelAccessToken(baseUrl: string, clientId: string, clientSecret: string) {
  const res = await fetch(`${baseUrl}/auth/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtel OAuth failed: ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

async function requestAirtelCollection(
  baseUrl: string,
  token: string,
  phone: string,
  amount: string,
  reference: string,
  propertyId: number,
) {
  // Normalise phone: remove + and ensure 250 prefix
  const msisdn = phone.replace(/^0+/, "").replace(/^\+?/, "");
  const formattedPhone = msisdn.startsWith("250") ? msisdn : `250${msisdn}`;

  const res = await fetch(`${baseUrl}/merchant/v1/payments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Country": "RW",
      "X-Currency": "RWF",
    },
    body: JSON.stringify({
      reference,
      subscriber: {
        country: "RW",
        currency: "RWF",
        msisdn: formattedPhone,
      },
      transaction: {
        amount,
        country: "RW",
        currency: "RWF",
        id: `prop-${propertyId}-${Date.now()}`,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Airtel Money rejected the payment request${text ? `: ${text}` : ""}`);
  }

  const data = await res.json();
  return {
    providerReference: data.transaction?.id || data.reference || data.status?.transactionId || reference,
  };
}

async function requestMtnCollection(
  url: string,
  apiKey: string,
  phone: string,
  amount: string,
  reference: string,
  propertyId: number,
) {
  const formattedPhone = phone.startsWith("+") ? phone.substring(1) : phone;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Reference-Id": reference,
      "X-Target-Environment": "sandbox",
    },
    body: JSON.stringify({
      amount,
      currency: "RWF",
      externalId: reference,
      payer: {
        partyIdType: "MSISDN",
        partyId: formattedPhone,
      },
      payerMessage: `Kalohouse property ${propertyId}`,
      payeeNote: "Kalohouse property purchase",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MTN MoMo rejected the payment request${text ? `: ${text}` : ""}`);
  }

  return { providerReference: reference };
}


async function requestMobileMoneyCollection({
  provider,
  phone,
  amount,
  reference,
  propertyId,
}: {
  provider: MobileMoneyProvider;
  phone: string;
  amount: string;
  reference: string;
  propertyId: number;
}) {
  if (provider === "mtn") {
    const config = getProviderConfig("mtn");
    if (!config.url || !config.apiKey) {
      return { configured: false, providerName: config.name, providerReference: reference };
    }
    await requestMtnCollection(config.url, config.apiKey, phone, amount, reference, propertyId);
    return { configured: true, providerName: config.name, providerReference: reference };
  }

  const config = getProviderConfig("airtel");
  if (!config.baseUrl || !config.clientId || !config.clientSecret) {
    return { configured: false, providerName: config.name, providerReference: reference };
  }

  const token = await getAirtelAccessToken(config.baseUrl, config.clientId, config.clientSecret);
  const result = await requestAirtelCollection(
    config.baseUrl, token, phone, amount, reference, propertyId,
  );
  return { configured: true, providerName: config.name, providerReference: result.providerReference };
}

export async function payBeforeVisit(propertyId: number) {
  const client = await authorizeRole([UserRole.client, UserRole.admin]);
  if (!client) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property || property.status !== PropertyStatus.published) {
    throw new Error("Only published properties can be paid for");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      property_id: propertyId,
      client_id: client.id,
      status: PaymentStatus.paid,
    },
  });

  if (existingPayment) {
    return { success: true, paymentId: existingPayment.id };
  }

  // Simulate Payment
  const payment = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.create({
      data: {
        property_id: propertyId,
        client_id: client.id,
        amount: property.final_display_price,
        status: PaymentStatus.paid,
        provider: "simulated",
        provider_reference: `sim-${crypto.randomUUID()}`,
      },
    });

    await tx.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.paid },
    });

    return p;
  });

  // Create Visit automatically after payment
  await prisma.visitRequest.create({
    data: {
      property_id: propertyId,
      client_id: client.id,
      payment_id: payment.id,
      status: VisitStatus.scheduled,
    },
  });

  revalidatePath("/dashboard/client");
  revalidatePath(`/properties/${propertyId}`);
  return { success: true, paymentId: payment.id };
}

export async function startMobileMoneyPayment(input: MobileMoneyInput) {
  const user = await getAuthorizedUser();
  if (!user) {
    return { error: "Create an account or sign in before paying." };
  }

  const phone = input.phone.replace(/[^\d+]/g, "");
  if (!phone || phone.length < 9) {
    return { error: "Enter a valid mobile money phone number." };
  }

  if (!["mtn", "airtel"].includes(input.provider)) {
    return { error: "Choose a valid payment provider." };
  }

  const property = await prisma.property.findUnique({
    where: { id: input.propertyId },
  });

  if (!property || property.status !== PropertyStatus.published) {
    return { error: "Only published properties can be purchased." };
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      property_id: input.propertyId,
      client_id: user.id,
      status: { in: [PaymentStatus.pending, PaymentStatus.paid] },
    },
    orderBy: { created_at: "desc" },
  });

  if (existingPayment) {
    return {
      success: true,
      paymentId: existingPayment.id,
      status: existingPayment.status,
      message:
        existingPayment.status === PaymentStatus.paid
          ? "This property is already paid for."
          : "A payment request is already pending.",
    };
  }

  const reference = `${input.provider}-${crypto.randomUUID()}`;
  const payment = await prisma.payment.create({
    data: {
      property_id: input.propertyId,
      client_id: user.id,
      amount: property.final_display_price,
      status: PaymentStatus.pending,
      provider: input.provider,
      provider_reference: reference,
    },
  });

  try {
    const collection = await requestMobileMoneyCollection({
      provider: input.provider,
      phone,
      amount: property.final_display_price.toString(),
      reference,
      propertyId: input.propertyId,
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        provider_reference: collection.providerReference,
      },
    });

    revalidatePath("/dashboard/client");
    revalidatePath(`/properties/${input.propertyId}`);

    return {
      success: true,
      paymentId: payment.id,
      status: PaymentStatus.pending,
      message: collection.configured
        ? `Payment request sent through ${collection.providerName}. Approve it on your phone.`
        : `${collection.providerName} API is not configured yet, so the payment was saved as pending.`,
    };
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.failed },
    });

    console.error("Mobile money payment error:", error);
    return { error: error instanceof Error ? error.message : "Payment request failed." };
  }
}

export async function decideVisit(visitId: number, decision: "accepted" | "cancelled") {
  const client = await authorizeRole([UserRole.client, UserRole.admin]);
  if (!client) throw new Error("Unauthorized");

  const visit = await prisma.visitRequest.findUnique({
    where: { id: visitId },
    include: { property: true },
  });

  if (!visit || visit.client_id !== client.id) {
    throw new Error("Visit not found");
  }

  const status = decision === "accepted" ? VisitStatus.accepted : VisitStatus.cancelled;

  await prisma.$transaction(async (tx) => {
    await tx.visitRequest.update({
      where: { id: visitId },
      data: { status },
    });

    if (decision === "accepted") {
      // Create Payout
      await tx.payout.create({
        data: {
          property_id: visit.property_id,
          owner_id: visit.property.owner_id,
          payment_id: visit.payment_id!,
          amount: visit.property.owner_price,
          status: "pending",
        },
      });

      await tx.property.update({
        where: { id: visit.property_id },
        data: { status: PropertyStatus.completed },
      });
    } else {
      // Create Refund Request
      await tx.refund.create({
        data: {
          property_id: visit.property_id,
          payment_id: visit.payment_id!,
          client_id: client.id,
          amount: visit.property.final_display_price,
          status: "requested",
          reason: "Client cancelled after visit",
        },
      });
    }
  });

  revalidatePath("/dashboard/client");
  return { success: true };
}

export async function payCommissionToUnlockContact(propertyId: number) {
  const user = await getAuthorizedUser();
  if (!user) {
    return { error: "Create an account or sign in first." };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property || property.status !== PropertyStatus.published) {
    return { error: "Property not found or not available." };
  }

  if (property.is_owner_verified) {
    return { error: "This property is already verified. Contact info is visible." };
  }

  const existingUnlock = await prisma.payment.findFirst({
    where: {
      property_id: propertyId,
      client_id: user.id,
      provider: "commission_unlock",
      status: PaymentStatus.paid,
    },
  });

  if (existingUnlock) {
    return { success: true, message: "Contact info already unlocked." };
  }

  const payment = await prisma.payment.create({
    data: {
      property_id: propertyId,
      client_id: user.id,
      amount: property.commission_amount,
      status: PaymentStatus.paid,
      provider: "commission_unlock",
      provider_reference: `unlock-${crypto.randomUUID()}`,
    },
  });

  revalidatePath(`/properties/${propertyId}`);
  return { success: true, paymentId: payment.id };
}

export async function purchaseMapAccess() {
  const user = await getAuthorizedUser();
  if (!user) {
    return { error: "Create an account or sign in to purchase map access." };
  }

  if (user.map_access_paid) {
    return { success: true, message: "Map access already purchased." };
  }

  const existingPaidPayment = await prisma.payment.findFirst({
    where: { client_id: user.id, status: PaymentStatus.paid },
  });

  if (existingPaidPayment) {
    await prisma.user.update({
      where: { id: user.id },
      data: { map_access_paid: true },
    });
    revalidatePath("/map");
    return { success: true, message: "Map access granted based on your purchase history." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { map_access_paid: true },
  });

  revalidatePath("/map");
  return { success: true, message: "Map access purchased successfully for RWF 5,000!" };
}

export async function requestRefund(paymentId: number, reason?: string) {
  const client = await authorizeRole([UserRole.client, UserRole.admin]);
  if (!client) throw new Error("Unauthorized");

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { refund: true },
  });

  if (!payment || payment.client_id !== client.id) {
    throw new Error("Payment not found");
  }

  if (payment.status !== PaymentStatus.paid) {
    throw new Error("Only paid payments can be refunded");
  }

  if (payment.refund) {
    throw new Error("A refund request already exists for this payment");
  }

  await prisma.refund.create({
    data: {
      property_id: payment.property_id,
      payment_id: payment.id,
      client_id: client.id,
      amount: payment.amount,
      status: "requested",
      reason: reason || "Client requested refund",
    },
  });

  revalidatePath("/dashboard/client");
  return { success: true };
}

export async function createStripeCheckoutSession(propertyId: number) {
  const user = await getAuthorizedUser();
  if (!user) {
    return { error: "Create an account or sign in before paying." };
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property || property.status !== PropertyStatus.published) {
    return { error: "Only published properties can be purchased." };
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      property_id: propertyId,
      client_id: user.id,
      status: { in: [PaymentStatus.pending, PaymentStatus.paid] },
    },
    orderBy: { created_at: "desc" },
  });

  if (existingPayment) {
    if (existingPayment.status === PaymentStatus.paid) {
      return { success: true, message: "This property is already paid for." };
    }
    return { success: true, message: "A payment request is already pending." };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { error: "Card payments are not configured yet. Try mobile money instead." };
  }

  const reference = `stripe-${crypto.randomUUID()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "rwf",
          product_data: {
            name: property.title,
            description: `Property #${property.id} in ${property.district}`,
          },
          unit_amount: Math.round(Number(property.final_display_price)),
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/api/stripe-callback?session_id={CHECKOUT_SESSION_ID}&property_id=${propertyId}`,
    cancel_url: `${appUrl}/payments/${propertyId}`,
    metadata: {
      property_id: String(propertyId),
      client_id: String(user.id),
      reference,
    },
  });

  await prisma.payment.create({
    data: {
      property_id: propertyId,
      client_id: user.id,
      amount: property.final_display_price,
      status: PaymentStatus.pending,
      provider: "stripe",
      provider_reference: session.id,
    },
  });

  revalidatePath("/dashboard/client");
  revalidatePath(`/properties/${propertyId}`);

  return { checkoutUrl: session.url };
}
