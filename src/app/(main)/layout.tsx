// LIBRARIES
import { auth } from "@/lib/auth";
// COMPONENTS
import { AuthProvider } from "@/components/features/auth";
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
