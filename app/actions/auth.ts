"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { addHours, createAuthToken, hashAuthToken } from "@/lib/auth-tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { UserRole } from "@/prisma/generated/client";

type RegisterUserInput = {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  nationality?: string;
  nationalId?: string;
};

type VerificationTokenUser = {
  id: number;
  email_verification_expires: Date | null;
};

type PasswordResetTokenUser = {
  id: number;
  emailVerified: Date | null;
  password_reset_expires: Date | null;
};

const allowedSignupRoles = new Set<UserRole>([
  UserRole.owner,
]);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

function getPrismaErrorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    ? String((error as { code?: unknown }).code)
    : undefined;
}

export async function registerUser(data: RegisterUserInput) {
  const email = normalizeEmail(data.email || "");
  const password = data.password || "";
  const fullName = data.fullName?.trim() || "";
  const role = data.role && allowedSignupRoles.has(data.role) ? data.role : UserRole.owner;
  const nationality = data.nationality?.trim() || "";
  const nationalId = data.nationalId?.trim() || "";

  if (!email || !password || !fullName) {
    return { error: "Missing required fields" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, tokenHash } = createAuthToken();
    const expires = addHours(new Date(), 24);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        full_name: fullName,
        role,
        ...(nationality && {
          nationality,
        }),
        ...(nationalId && {
          national_id: nationalId,
        }),
        email_verification_token_hash: tokenHash,
        email_verification_expires: expires,
      },
    });

    let emailDelivered = true;
    try {
      await sendVerificationEmail(user.email, token);
    } catch (emailError) {
      emailDelivered = false;
      console.error("Verification email error:", emailError);
    }

    // In development, include the token in the response
    const isDev = process.env.NODE_ENV === "development";
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000"}/auth/verify?token=${encodeURIComponent(token)}`;

    return {
      success: true,
      message: isDev 
        ? `Account created. We sent a verification email to ${user.email}. Verification link: ${verificationUrl}` 
        : emailDelivered
          ? `Account created. We sent a verification email to ${user.email}. Check your inbox to verify your account.`
          : "Account created, but the verification email could not be sent. Contact support to verify your account.",
      user: { id: user.id, email: user.email },
      ...(isDev && { verificationToken: token, verificationUrl }),
    };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    if (getPrismaErrorCode(error) === 'P2002') {
      return { error: "User already exists with this email" };
    }
    return { error: `Registration failed: ${getErrorMessage(error)}` };
  }
}

export async function getInviteByToken(token: string) {
  try {
    const invite = await prisma.agentInvite.findUnique({
      where: { token, status: "pending" },
      select: { name: true, email: true },
    });
    return invite ? { name: invite.name, email: invite.email } : null;
  } catch {
    return null;
  }
}

export async function registerAgentWithInvite(data: { token: string; fullName: string; password: string }) {
  const { token, fullName, password } = data;

  if (!token || !fullName || !password) {
    return { error: "Missing required fields" };
  }

  try {
    const invite = await prisma.agentInvite.findUnique({
      where: { token, status: "pending" },
      include: { sector: true }
    });

    if (!invite || new Date() > invite.expires_at) {
      return { error: "Invalid or expired invitation" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agentName = fullName || invite.name || "Agent";

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: invite.email,
          password: hashedPassword,
          full_name: agentName,
          role: UserRole.agent,
          sector_id: invite.sector_id,
          is_verified: true, // Auto-verify invited agents
        },
      });

      await tx.agentInvite.update({
        where: { id: invite.id },
        data: {
          status: "used",
          used_at: new Date(),
        },
      });

      return newUser;
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error: unknown) {
    console.error("Agent registration error:", error);
    if (getPrismaErrorCode(error) === 'P2002') return { error: "An account with this email already exists" };
    return { error: "Something went wrong during registration" };
  }
}
export async function verifyEmail(token: string) {
  const tokenHash = hashAuthToken(token || "");

  const [user] = await prisma.$queryRaw<VerificationTokenUser[]>`
    SELECT id, email_verification_expires
    FROM users
    WHERE email_verification_token_hash = ${tokenHash}
    LIMIT 1
  `;

  if (!user || !user.email_verification_expires || user.email_verification_expires < new Date()) {
    return { error: "Verification link is invalid or expired" };
  }

  await prisma.$executeRaw`
    UPDATE users
    SET email_verified = ${new Date()},
        is_verified = true,
        email_verification_token_hash = NULL,
        email_verification_expires = NULL
    WHERE id = ${user.id}
  `;

  return { success: true };
}

export async function requestPasswordReset(emailInput: string) {
  const email = normalizeEmail(emailInput || "");
  if (!email) return { error: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const { token, tokenHash } = createAuthToken();
    const expires = addHours(new Date(), 1);

    await prisma.$executeRaw`
      UPDATE users
      SET password_reset_token_hash = ${tokenHash},
          password_reset_expires = ${expires}
      WHERE id = ${user.id}
    `;

    await sendPasswordResetEmail(user.email, token);

    // In development, include the token in the response
    if (process.env.NODE_ENV === "development") {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000"}/auth/reset?token=${encodeURIComponent(token)}`;
      return {
        success: true,
        message: `Reset link: ${resetUrl}`,
        resetToken: token,
        resetUrl,
      };
    }
  }

  return {
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
  };
}

export async function resetPassword(token: string, password: string) {
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const tokenHash = hashAuthToken(token || "");
  const [user] = await prisma.$queryRaw<PasswordResetTokenUser[]>`
    SELECT id, email_verified AS "emailVerified", password_reset_expires
    FROM users
    WHERE password_reset_token_hash = ${tokenHash}
    LIMIT 1
  `;

  if (!user || !user.password_reset_expires || user.password_reset_expires < new Date()) {
    return { error: "Reset link is invalid or expired" };
  }

  await prisma.$executeRaw`
    UPDATE users
    SET password = ${await bcrypt.hash(password, 10)},
        password_reset_token_hash = NULL,
        password_reset_expires = NULL,
        email_verified = ${user.emailVerified || new Date()},
        is_verified = true
    WHERE id = ${user.id}
  `;

  return { success: true };
}
