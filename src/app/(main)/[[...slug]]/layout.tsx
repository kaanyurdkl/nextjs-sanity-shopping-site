interface MainLayoutProps {
  home: React.ReactNode;
  category: React.ReactNode;
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}

export default async function MainLayout({
  home,
  category,
  params,
}: MainLayoutProps) {
  const { slug } = await params;

  return <main>{slug ? category : home}</main>;
}
