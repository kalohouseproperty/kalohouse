import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser } from "@auth/core/adapters";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/prisma/generated/client";

type DatabaseUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;

const authSecret =
  process.env.AUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "dev-auth-secret-change-me"
    : undefined);

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET;
const hasGoogle = !!(googleClientId && googleClientSecret);

if (!hasGoogle && process.env.NODE_ENV !== "development") {
  console.warn("[Auth] Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
}

function toAdapterUser(user: DatabaseUser): AdapterUser & {
  full_name: string;
  role: UserRole;
  created_at: Date;
} {
  return {
    id: String(user.id),
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.full_name,
    image: user.image,
    full_name: user.full_name,
    role: user.role,
    created_at: user.created_at,
  };
}

const baseAdapter = PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]);

const authAdapter: Adapter = {
  ...baseAdapter,
  async createUser(user) {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        emailVerified: user.emailVerified ?? new Date(),
        full_name: user.name || user.email.split("@")[0] || "User",
        image: user.image,
        role: UserRole.owner,
        is_verified: true,
      },
    });

    return toAdapterUser(created);
  },
  async getUser(id) {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    return user ? toAdapterUser(user) : null;
  },
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? toAdapterUser(user) : null;
  },
  async getUserByAccount(providerAccountId) {
    const account = await prisma.account.findUnique({
      where: { provider_providerAccountId: providerAccountId },
      include: { user: true },
    });

    return account?.user ? toAdapterUser(account.user) : null;
  },
  async updateUser({ id, name, email, emailVerified, image }) {
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(email !== undefined ? { email } : {}),
        ...(emailVerified !== undefined ? { emailVerified } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(name !== undefined ? { full_name: name || "User" } : {}),
      },
    });

    return toAdapterUser(updated);
  },
  async linkAccount(account) {
    await prisma.account.create({
      data: {
        ...account,
        userId: Number(account.userId),
      },
    });
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: authAdapter,
  secret: authSecret,
  trustHost: true,
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
            allowDangerousEmailAccountLinking: true,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name || profile.email?.split("@")[0] || "User",
                email: profile.email,
                image: profile.picture,
                role: UserRole.owner,
              };
            },
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password || !user.emailVerified) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      try {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, created_at: true, emailVerified: true },
        });

        await prisma.user.updateMany({
          where: { email: user.email, emailVerified: null },
          data: { emailVerified: new Date(), is_verified: true },
        });

        await prisma.user.updateMany({
          where: {
            email: user.email,
            role: { notIn: [UserRole.owner, UserRole.agent, UserRole.admin] },
          },
          data: { role: UserRole.owner },
        });

        if (existing?.emailVerified === null) {
          console.info("[Auth] Google sign-in completed for new/verified user", {
            email: user.email,
            provider: account.provider,
            profileName: profile?.name || user.name,
          });
        }

        return true;
      } catch (error) {
        console.error("[Auth] Google sign-in failed", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (!user) return token;
      const u = user as typeof user & {
        full_name?: string | null;
        role?: string | null;
        created_at?: Date;
      };
      return {
        ...token,
        id: user.id,
        email: user.email,
        name: user.name || u.full_name,
        role: u.role || "owner",
        createdAt: u.created_at?.toISOString(),
      };
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
          createdAt?: string;
        };
        sessionUser.id = String(token.id);
        sessionUser.role = (token.role as string | undefined) || "owner";
        sessionUser.createdAt = (token.createdAt as string | undefined) || undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
});
