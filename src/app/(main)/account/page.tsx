import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/sanity/lib/utils";
import AccountPage from "@/components/pages/AccountPage";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>Please sign in to access your account</div>;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user) {
    return <div>User not found</div>;
  }

  return <AccountPage user={user} />;
}
