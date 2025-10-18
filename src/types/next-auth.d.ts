import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extended User interface with Google OAuth ID
   */
  interface User {
    googleId?: string;
  }

  /**
   * Extended Session interface
   * Preserves default session properties (name, email, image)
   * Adds custom googleId field from OAuth provider
   */
  interface Session {
    user: {
      googleId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT token interface
   * Stores Google OAuth ID for session persistence
   */
  interface JWT {
    googleId?: string;
  }
}
