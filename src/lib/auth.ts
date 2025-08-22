import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Helper function to get server session with authOptions
 * Recommended by NextAuth.js documentation for consistent usage
 */
export function getServerAuthSession() {
  return getServerSession(authOptions);
}