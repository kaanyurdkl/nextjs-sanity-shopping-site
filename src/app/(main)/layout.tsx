// LIBRARIES
import { auth } from "@/services/next-auth/lib";
// COMPONENTS
import { AuthProvider } from "@/services/next-auth/components";
import { Header } from "@/components/layout";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AuthProvider session={session}>
      <div>
        <Header />
        {children}
      </div>
    </AuthProvider>
  );
}
