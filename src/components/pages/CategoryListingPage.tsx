import type {
  CATEGORY_BY_SLUG_QUERYResult,
  PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult,
} from "@/sanity/types/sanity.types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CategorySidebar from "@/components/ui/CategorySidebar";
import ProductGrid from "@/components/ui/ProductGrid";
import { getProductsByCategory } from "@/sanity/lib/utils";

type Products = PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult;

interface CategoryListingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  slugArray: string[];
}

export default async function CategoryListingPage({
  category,
  slugArray,
}: CategoryListingPageProps) {
  // Fetch products for this category using optimized slug-based approach
  const categorySlug = slugArray.join("/");
  const products: Products = await getProductsByCategory(categorySlug);

  return (
    <div className="max-w-8xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs slugArray={slugArray} />

      <div className="flex gap-8">
        {/* Category Sidebar */}
        <CategorySidebar category={category} slugArray={slugArray} />

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              {category.title}
            </h1>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
