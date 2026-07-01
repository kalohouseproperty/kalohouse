import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserRole } from "@/prisma/generated/client";
import { createAuthToken, addHours } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";

const authSecret = process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? "dev-auth-secret-change-me" : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]),
  secret: authSecret,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
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

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

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
      if (account?.provider === "google") {
        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, created_at: true, emailVerified: true },
          });

          const isNewUser =
            dbUser &&
            !dbUser.emailVerified &&
            new Date().getTime() - new Date(dbUser.created_at).getTime() < 2 * 60 * 1000;

          await prisma.user.updateMany({
            where: { email: user.email, emailVerified: null },
            data: { emailVerified: new Date(), is_verified: true },
          });

          if (isNewUser) {
            const { token, tokenHash } = createAuthToken();
            const expires = addHours(new Date(), 24);
            await prisma.user.update({
              where: { email: user.email },
              data: {
                email_verification_token_hash: tokenHash,
                email_verification_expires: expires,
              },
            });
            await sendVerificationEmail(user.email, token);
          }

          await prisma.user.updateMany({
            where: { email: user.email, role: UserRole.client },
            data: { role: UserRole.owner },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = user as typeof user & { full_name?: string | null; role?: string | null; created_at?: Date };
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || dbUser.full_name;
        token.role = dbUser.role || "owner";
        token.createdAt = dbUser.created_at?.toISOString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & { id?: string; role?: unknown; createdAt?: string };
        session.user.id = token.id as string;
        sessionUser.role = token.role;
        sessionUser.createdAt = token.createdAt as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs or URLs on the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
});
