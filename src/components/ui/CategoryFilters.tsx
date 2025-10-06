// COMPONENTS
import ColorFilter from "@/components/ui/ColorFilter";
// UTILS
import { getCategoryFilterValues } from "@/sanity/lib/utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface CategoryFiltersProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default async function CategoryFilters({
  category,
}: CategoryFiltersProps) {
  const filterData = category.enableColorFilter
    ? await getCategoryFilterValues(category._id)
    : { colorValues: [] };

  return (
    <div>
      <h3 className="font-bold mb-2 uppercase">Filters</h3>
      <div className="space-y-4">
        {category.enableColorFilter && filterData.colorValues.length > 0 && (
          <ColorFilter colors={filterData.colorValues} />
        )}
      </div>
    </div>
  );
}
