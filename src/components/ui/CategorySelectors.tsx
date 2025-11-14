// COMPONENTS
import CategorySidebarItem from "@/components/ui/CategorySidebarItem";
// UTILS
import { getCategoryChildren } from "@/services/sanity/utils/category-utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/services/sanity/types/sanity.types";

interface CategorySelectorsProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default async function CategorySelectors({
  category,
}: CategorySelectorsProps) {
  // Fetch children of current category
  const children = await getCategoryChildren(category._id);

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
  );
}
