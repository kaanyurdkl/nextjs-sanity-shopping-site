import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { syncUserToSanity } from "./user-sync";

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
          await syncUserToSanity(profile);
        } catch (error) {
          console.error("Error syncing user to Sanity:", error);
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
