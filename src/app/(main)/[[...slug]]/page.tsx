interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Handle homepage
  if (!slug || slug.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1>Homepage</h1>
        <p>This is the homepage</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1>Category Page</h1>
      <p>Slug: {slug.join("/")}</p>
    </div>
  );
}