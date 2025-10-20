import { auth } from "@/lib/auth";
import { getUserByGoogleId } from "@/sanity/lib/utils";
import AccountPage from "@/components/pages/AccountPage";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.googleId) {
    return <div>Please sign in to access your account</div>;
  }

  const user = await getUserByGoogleId(session.user.googleId);

  if (!user) {
    return <div>User not found</div>;
  }

  return <AccountPage user={user} />;
}
