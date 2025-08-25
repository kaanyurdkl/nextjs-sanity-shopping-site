/**
 * Auth.js configuration and exports
 * 
 * Main authentication setup using NextAuth with Google OAuth provider.
 * All configuration is centralized in ./config.ts for better organization.
 */
import NextAuth from "next-auth";
import { authConfig } from "./config";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
