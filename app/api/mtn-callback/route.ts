import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MtnCallbackBody = {
  externalId?: string;
  status?: string;
  financialTransactionId?: string;
  reason?: string;
};

function isSuccessfulStatus(status?: string) {
  return ["SUCCESSFUL", "SUCCESS", "PAID", "PAYED"].includes((status || "").toUpperCase());
}

export async function POST(request: NextRequest) {
  const callbackSecret = process.env.MTN_MOMO_CALLBACK_SECRET;
  const providedSecret =
    request.headers.get("x-kalohouse-callback-secret") ||
    request.nextUrl.searchParams.get("secret");

  if (callbackSecret && providedSecret !== callbackSecret) {
    return NextResponse.json({ error: "Invalid callback secret" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as MtnCallbackBody;
  const reference = body.externalId;

  if (!reference) {
    return NextResponse.json({ error: "Missing externalId" }, { status: 400 });
  }

  if (reference.startsWith("map-") && isSuccessfulStatus(body.status)) {
    const userId = Number(reference.split("-")[1]);

    if (!Number.isFinite(userId)) {
      return NextResponse.json({ error: "Invalid map reference" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { map_access_paid: true },
    });

    revalidatePath("/map");
  }

  return NextResponse.json({ received: true });
}
