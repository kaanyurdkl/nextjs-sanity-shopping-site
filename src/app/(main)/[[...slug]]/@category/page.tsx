// LIBRARIES
import { notFound } from "next/navigation";
// COMPONENTS
import { CategoryLandingPage, CategoryListingPage } from "@/components/pages";
// UTILS
import { getCategoryBySlug } from "@/sanity/lib/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams?: { page?: string; colors?: string };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const isListingPage = category.pageType === "listing";

  if (isListingPage) {
    return (
      <CategoryListingPage category={category} searchParams={searchParams} />
    );
  } else {
    return <CategoryLandingPage category={category} />;
  }
}
