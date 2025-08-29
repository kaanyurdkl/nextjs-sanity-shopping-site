import { notFound } from "next/navigation";
import {
  HomePage,
  CategoryLandingPage,
  CategoryListingPage,
} from "@/components/pages";
import { getCategoryBySlugPath } from "@/sanity/queries/categories";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
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

  console.log("category", category);
  console.log("slug", slug);

  // Render appropriate page component based on pageType
  if (category.pageType === "landing") {
    return <CategoryLandingPage category={category} slugArray={slug} />;
  }

  return <CategoryListingPage category={category} slugArray={slug} />;
}
