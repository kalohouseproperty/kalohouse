import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/prisma/generated/client";
import { createAuthToken, addHours } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";

const authSecret =
  process.env.AUTH_SECRET ||
  (process.env.NODE_ENV === "development"
    ? "dev-auth-secret-change-me"
    : undefined);

const hasGoogle = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

if (!hasGoogle && process.env.NODE_ENV !== "development") {
  console.warn("[Auth] Google OAuth is not configured. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]),
  secret: authSecret,
  trustHost: true,
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;

      const existing = await prisma.user.findUnique({
        where: { email: user.email },
        select: { id: true, created_at: true, emailVerified: true },
      });

      const isNew =
        existing &&
        !existing.emailVerified &&
        Date.now() - new Date(existing.created_at).getTime() < 2 * 60_000;

      await prisma.user.updateMany({
        where: { email: user.email, emailVerified: null },
        data: { emailVerified: new Date(), is_verified: true },
      });

      if (isNew) {
        const { token, tokenHash } = createAuthToken();
        await prisma.user.update({
          where: { email: user.email },
          data: {
            email_verification_token_hash: tokenHash,
            email_verification_expires: addHours(new Date(), 24),
          },
        });
        await sendVerificationEmail(user.email, token);
      }

      await prisma.user.updateMany({
        where: { email: user.email, role: UserRole.client },
        data: { role: UserRole.owner },
      });

      return true;
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
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).createdAt = token.createdAt;
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
