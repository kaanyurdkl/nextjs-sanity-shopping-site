import { auth } from "@/lib/auth";
import { readClient } from "@/sanity/lib/client";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>Please sign in to access your account</div>;
  }

  // Fetch user data from Sanity
  const user = await readClient.fetch(
    `*[_type == "user" && email == $email][0]{
      firstName,
      lastName,
      email
    }`,
    { email: session.user.email }
  );

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : session.user.name || session.user.email;

  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
    </div>
  );
}
