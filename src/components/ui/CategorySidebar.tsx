import CategorySidebarItem from "./CategorySidebarItem";
import ColorFilter from "./ColorFilter";
import { getCategoryChildren } from "@/sanity/lib/utils";
import type {
  CATEGORY_BY_SLUG_QUERYResult,
  CATEGORY_FILTER_VALUES_QUERYResult
} from "@/sanity/types/sanity.types";

interface CategorySidebarProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  filterData: CATEGORY_FILTER_VALUES_QUERYResult;
  searchParams?: { page?: string; colors?: string };
}

export default async function CategorySidebar({
  category,
  filterData,
  searchParams,
}: CategorySidebarProps) {
  // Fetch children of current category
  const children = await getCategoryChildren(category._id);

  // Parse currently selected color names from URL
  const selectedColorNames = searchParams?.colors
    ? searchParams.colors.split(',').map(name => name.trim().toLowerCase())
    : [];

  // The categories to show and the "View All" URL
  let sidebarCategories;
  let viewAllUrl;
  let isViewAllActive;

  // If current category has no children, show parent's children (siblings), else show current category children
  if (children.length === 0 && category.parent) {
    // Fetch siblings using parent data that's already available
    sidebarCategories = await getCategoryChildren(category.parent._id);

    // "View All" should point to parent category
    viewAllUrl = "/" + category.parent.slug;

    // Since the current category has no children, a leaf category must be selected, not the view all
    isViewAllActive = false;
  } else {
    // The categories should be the direct children of current category
    sidebarCategories = children;

    // "View All" should point to current category
    viewAllUrl = "/" + category.slug;

    // Since the current category has children, a parent category must be selected, which is represented by the view all link
    isViewAllActive = true;
  }

  return (
    <aside className="w-48 flex-shrink-0">
      <div className="mb-8">
        <h3 className="font-bold mb-4 uppercase">Categories</h3>
        <nav>
          <ul className="space-y-2">
            {/* View All link */}
            <CategorySidebarItem
              label="View All"
              href={viewAllUrl}
              isActive={isViewAllActive}
            />

            {/* Categories (either children or siblings) */}
            {sidebarCategories.map((child) => (
              <CategorySidebarItem
                key={child._id}
                label={child.title}
                href={`/${child.slug}`}
                isActive={child.slug === category.slug}
              />
            ))}
          </ul>
        </nav>
      </div>
      {/* Additional Filters Sidebar */}
      {(category.enableColorFilter ||
        category.enableSizeFilter ||
        category.enablePriceFilter) && (
        <div>
          <h3 className="font-bold mb-2 uppercase">Filters</h3>
          <div className="space-y-4">
            {/* Color Filter */}
            {category.enableColorFilter && filterData.availableColors.length > 0 && (
              <ColorFilter
                colors={filterData.availableColors}
                selectedColorNames={selectedColorNames}
              />
            )}

            {/* Size Filter Placeholder */}
            {category.enableSizeFilter && <p className="text-gray-500 text-sm">Size filter component...</p>}

            {/* Price Filter Placeholder */}
            {category.enablePriceFilter && <p className="text-gray-500 text-sm">Price filter component...</p>}
          </div>
        </div>
      )}
    </aside>
  );
}
