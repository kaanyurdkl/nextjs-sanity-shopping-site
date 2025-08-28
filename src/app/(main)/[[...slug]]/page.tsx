import { readClient } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { HomePage, CategoryLandingPage, CategoryListingPage } from "@/components/pages";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

// Simplified type for GROQ query result
type CategoryQueryResult = {
  _id: string;
  title: string;
  slug: string;
  pageType: "landing" | "listing";
};

// Fetch category by full slug path
async function getCategoryBySlugPath(slugPath: string[]): Promise<CategoryQueryResult | null> {
  const fullSlug = slugPath.join("/");
  
  const category = await readClient.fetch<CategoryQueryResult | null>(`
    *[_type == "category" && slug.current == $slug && isActive == true][0] {
      _id,
      title,
      "slug": slug.current,
      pageType
    }
  `, { slug: fullSlug });
  
  return category;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Handle homepage
  if (!slug || slug.length === 0) {
    return <HomePage />;
  }
  
  // Fetch category data
  const category = await getCategoryBySlugPath(slug);
  
  // Handle 404 if category not found
  if (!category) {
    notFound();
  }
  
  // Render appropriate page component based on pageType
  if (category.pageType === "landing") {
    return <CategoryLandingPage category={category} />;
  }
  
  return <CategoryListingPage category={category} />;
}