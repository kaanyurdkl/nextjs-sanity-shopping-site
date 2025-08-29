import {
  getCategoryChildren,
  getParentCategoryWithChildren,
} from "@/sanity/queries/categories";
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
  const children = await getCategoryChildren(category._id);

  console.log("children", children);

  // Determine what categories to show and the "View All" URL
  let sidebarCategories = children;
  let viewAllUrl = "/" + slugArray.join("/");

  // If current category has no children, show parent's children (siblings)
  if (children.length === 0 && slugArray.length > 1) {
    const { siblings } = await getParentCategoryWithChildren(slugArray);
    sidebarCategories = siblings;

    // "View All" should point to parent category
    const parentSlugArray = slugArray.slice(0, -1);
    viewAllUrl = "/" + parentSlugArray.join("/");
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
    <aside className="w-64 flex-shrink-0">
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
    </aside>
  );
}
