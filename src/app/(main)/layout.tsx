import Navbar from "@/components/navbar";
import AuthProvider from "@/components/auth-provider";
import { getServerAuthSession } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <AuthProvider session={session}>
      <div>
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  );
}
