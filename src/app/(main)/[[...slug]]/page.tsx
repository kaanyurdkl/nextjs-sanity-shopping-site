import { notFound } from "next/navigation";
import {
  HomePage,
  CategoryLandingPage,
  CategoryListingPage,
} from "@/components/pages";
import { getCategoryBySlugPath } from "@/sanity/lib/utils";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

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
    return <CategoryLandingPage category={category} slugArray={slug} />;
  }

  return <CategoryListingPage category={category} slugArray={slug} searchParams={resolvedSearchParams} />;
}
