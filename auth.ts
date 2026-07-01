import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/prisma/generated/client";

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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]),
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
                role: "owner",
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
          where: { email: user.email, role: UserRole.client },
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
