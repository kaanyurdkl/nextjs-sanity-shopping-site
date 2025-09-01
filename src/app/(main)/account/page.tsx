import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/sanity/lib/utils";
import type { USER_BY_EMAIL_QUERYResult } from "@/sanity/types/sanity.types";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>Please sign in to access your account</div>;
  }

  // Fetch user data from Sanity
  const user = (await getUserByEmail(
    session.user.email
  )) as USER_BY_EMAIL_QUERYResult;

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : session.user.name || session.user.email;

  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
    </div>
  );
}
