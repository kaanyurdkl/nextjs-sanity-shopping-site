import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./config";
import { writeClient } from "@/sanity/lib/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
    ...authConfig.callbacks,
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          // Check if user already exists in Sanity
          const existingUser = await writeClient.fetch(
            `*[_type == "user" && googleId == $googleId][0]`,
            { googleId: profile.sub }
          );

          if (!existingUser) {
            // Create new user in Sanity
            const newUser = await writeClient.create({
              _type: "user",
              googleId: profile.sub,
              email: profile.email,
              firstName: profile.given_name || "",
              lastName: profile.family_name || "",
              isActive: true,
              orderEmails: true,
            });
            
            console.log("Created new user in Sanity:", newUser._id);
          } else {
            console.log("User already exists in Sanity:", existingUser._id);
          }
        } catch (error) {
          console.error("Error creating user in Sanity:", error);
        }
      }
      
      return token;
    },
  },
});
