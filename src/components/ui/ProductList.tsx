// COMPONENTS
import ProductListWrapper from "@/components/ui/ProductListWrapper";
// UTILS
import {
  getColorsByName,
  getSizesByCode,
  getProductsWithFilters,
  getProductsCountWithFilters,
} from "@/services/sanity/lib/utils";
// TYPES
import { CATEGORY_BY_SLUG_QUERYResult } from "@/services/sanity/types/sanity.types";
// CONSTANTS
import { PRODUCTS_PER_PAGE } from "@/constants/pagination";

interface ProductListProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
  searchParams?: { page?: string; colors?: string; sizes?: string; minPrice?: string; maxPrice?: string; sort?: string };
}

export default async function ProductList({
  category,
  searchParams,
}: ProductListProps) {
  const currentPage = Number(searchParams?.page) || 1;

  // Parse filter parameters
  let colorIds: string[] | null = null;
  let sizeIds: string[] | null = null;
  let minPrice: number | null = null;
  let maxPrice: number | null = null;
  const sortOrder = searchParams?.sort || null;

  if (searchParams?.colors) {
    const colorNames = searchParams.colors.split(",");
    const colors = await getColorsByName(colorNames);
    colorIds = colors.map((color) => color._id);
  }

  if (searchParams?.sizes) {
    const sizeCodes = searchParams.sizes.split(",");
    const sizes = await getSizesByCode(sizeCodes);
    sizeIds = sizes.map((size) => size._id);
  }

  if (searchParams?.minPrice) {
    minPrice = parseFloat(searchParams.minPrice);
  }

  if (searchParams?.maxPrice) {
    maxPrice = parseFloat(searchParams.maxPrice);
  }

  // Fetch products and count using unified filter approach
  const products = await getProductsWithFilters(
    category._id,
    currentPage,
    colorIds,
    sizeIds,
    minPrice,
    maxPrice,
    sortOrder
  );

  const productsCount = await getProductsCountWithFilters(
    category._id,
    colorIds,
    sizeIds,
    minPrice,
    maxPrice
  );

  const totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

  return (
    <ProductListWrapper
      products={products}
      productsCount={productsCount}
      totalPages={totalPages}
    />
  );
}
