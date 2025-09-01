import { getCategoryChildren } from "@/sanity/lib/utils";
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import CategorySidebarItem from "./CategorySidebarItem";

interface CategorySidebarProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  slugArray: string[];
}

export default async function CategorySidebar({
  category,
  slugArray,
}: CategorySidebarProps) {
  // Fetch children of current category
  const children = await getCategoryChildren(category._id);

  // Determine what categories to show and the "View All" URL
  let sidebarCategories = children;
  let viewAllUrl = "/" + slugArray.join("/");

  // If current category has no children, show parent's children (siblings)
  if (children.length === 0 && category.parent) {
    // Fetch siblings using parent data that's already available
    sidebarCategories = await getCategoryChildren(category.parent._id);

    // "View All" should point to parent category
    viewAllUrl = "/" + category.parent.slug;
  }

  // Build current category slug path for active state detection
  const currentCategorySlug = slugArray.join("/");

  // Determine if "View All" should be active
  // "View All" is active when we're showing children (current category has subcategories)
  // and none of the individual child categories match the current URL
  const hasMatchingChild = sidebarCategories.some(
    (child) => child.slug === currentCategorySlug
  );
  const isViewAllActive = children.length > 0 && !hasMatchingChild;

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="mb-8">
        <h3 className="font-semibold text-black mb-4">Categories</h3>
        <nav>
          <ul className="space-y-2">
            {/* View All link */}
            <CategorySidebarItem
              label="View All"
              href={viewAllUrl}
              isActive={isViewAllActive}
              isViewAll={true}
            />

            {/* Categories (either children or siblings) */}
            {sidebarCategories.map((child) => (
              <CategorySidebarItem
                key={child._id}
                label={child.title}
                href={`/${child.slug}`}
                isActive={child.slug === currentCategorySlug}
                isViewAll={false}
              />
            ))}
          </ul>
        </nav>
      </div>
      {/* Additional Filters Sidebar */}
      <div className="mb-8">
        <h3 className="font-semibold text-black mb-4">Filters</h3>
        <div className="text-gray-500 text-sm space-y-2">
          <p>Size filters...</p>
          <p>Color filters...</p>
          <p>Price range...</p>
        </div>
      </div>
    </aside>
  );
}
