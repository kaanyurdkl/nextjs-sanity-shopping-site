import { notFound } from "next/navigation";
import {
  HomePage,
  CategoryLandingPage,
  CategoryListingPage,
} from "@/components/pages";
import { getCategoryBySlug } from "@/sanity/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Handle homepage
  if (!slug || slug.length === 0) {
    return <HomePage />;
  }

  // Fetch category data
  const category = await getCategoryBySlug(slug);

  // Handle 404 if category not found
  if (!category) {
    notFound();
  }

  // Render appropriate page component based on pageType
  if (category.pageType === "landing") {
    return (
      <>
        <div className="max-w-8xl mx-auto px-6 pt-8">
          <Breadcrumbs slug={slug} />
        </div>
        <CategoryLandingPage category={category} />
      </>
    );
  }

  return (
    <>
      <div className="max-w-8xl mx-auto px-6 pt-8">
        <Breadcrumbs slug={slug} />
      </div>
      <CategoryListingPage
        category={category}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}
