import { writeClient } from "@/services/sanity/lib/client";

/**
 * Syncs Google OAuth user profile data to Sanity CMS
 * Creates new user document if user doesn't exist, otherwise skips
 */
export async function syncUserToSanity(profile: any) {
  if (!profile?.sub || !profile?.email) {
    throw new Error("Invalid profile data: missing sub or email");
  }

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
    return newUser;
  } else {
    console.log("User already exists in Sanity:", existingUser._id);
    return existingUser;
  }
}