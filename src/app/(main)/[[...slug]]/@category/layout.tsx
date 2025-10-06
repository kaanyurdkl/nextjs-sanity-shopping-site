// COMPONENTS
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface CategoryLayoutProps {
  params: Promise<{ slug: string[] }>;
  children: React.ReactNode;
}

export default async function CategoryLayout({
  params,
  children,
}: CategoryLayoutProps) {
  const { slug } = await params;

  return (
    <div>
      <Breadcrumbs slug={slug} />
      {children}
    </div>
  );
}
