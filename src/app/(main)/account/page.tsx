import { auth } from "@/lib/auth";
import { getUserByEmail } from "@/sanity/lib/utils";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div>Please sign in to access your account</div>;
  }

  const user = await getUserByEmail(session.user.email);

  return (
    <div>
      <h1 className="uppercase text-4xl font-extrabold">Account</h1>
    </div>
  );
}
