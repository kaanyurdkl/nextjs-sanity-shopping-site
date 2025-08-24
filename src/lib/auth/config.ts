import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/signin",
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
  },
  providers: [],
} satisfies NextAuthConfig;
