import NextAuth from "next-auth";
import { authConfig } from "@/services/next-auth/lib/config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/account(.*)"],
};
