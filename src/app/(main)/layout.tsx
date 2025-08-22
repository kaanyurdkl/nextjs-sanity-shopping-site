import Navbar from "@/components/navbar";
import AuthProvider from "@/components/auth-provider";
import { auth } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AuthProvider session={session}>
      <div>
        <Navbar />
        {children}
      </div>
    </AuthProvider>
  );
}
