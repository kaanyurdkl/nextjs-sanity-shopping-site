import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { syncUserToSanity } from "./user-sync";
import { migrateCartOnLogin } from "./cart-migration";

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAccount = nextUrl.pathname.startsWith("/account");

      if (isOnAccount) {
        if (isLoggedIn) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile && profile.sub) {
        // Add Google ID to token
        token.googleId = profile.sub;

        try {
          // 1. Sync user to Sanity (create if doesn't exist)
          const user = await syncUserToSanity(profile);

          // 2. Migrate guest cart if exists
          if (user._id) {
            await migrateCartOnLogin(user._id);
          }
        } catch (error) {
          console.error("Error syncing user or migrating cart:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add Google ID to session
      if (token.googleId) {
        session.user.googleId = token.googleId as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
