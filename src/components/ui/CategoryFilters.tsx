// COMPONENTS
import ColorFilter from "@/components/ui/ColorFilter";
// UTILS
import { getCategoryFilterData } from "@/sanity/lib/utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";
import SizeFilter from "./SizeFilter";

interface CategoryFiltersProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string };
}

export default async function CategoryFilters({
  category,
  searchParams,
}: CategoryFiltersProps) {
  const filterData = await getCategoryFilterData(category, searchParams);

  return (
    <div>
      <h3 className="font-bold mb-4 uppercase">Filters</h3>
      <div className="space-y-4 pb-0.5">
        {filterData.map((filter, index) => {
          if (filter.type === "color") {
            return <ColorFilter key={`color-${index}`} data={filter.data} />;
          } else if (filter.type === "size") {
            return <SizeFilter key={`size-${index}`} data={filter.data} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
