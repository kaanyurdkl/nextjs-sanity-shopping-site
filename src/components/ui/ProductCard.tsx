import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult } from "@/sanity/types/sanity.types";

type Product = PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult[0];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    name,
    slug,
    basePrice,
    thumbnail,
    hoverImage,
    availableColors,
    hasStock,
  } = product;

  // Get optimized image URLs
  const thumbnailUrl = thumbnail?.asset?.url
    ? urlFor(thumbnail.asset.url)
        .width(400)
        .height(500)
        .format("webp")
        .quality(85)
        .url()
    : null;

  const hoverImageUrl = hoverImage?.asset?.url
    ? urlFor(hoverImage.asset.url)
        .width(400)
        .height(500)
        .format("webp")
        .quality(85)
        .url()
    : null;

  return (
    <div className="group relative">
      <Link href={`/products/${slug}`} className="block">
        {/* Product Image Container - 4:5 aspect ratio */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <>
              {/* Main image */}
              <Image
                src={thumbnailUrl}
                alt={thumbnail?.alt || name}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Hover image */}
              {hoverImageUrl && (
                <Image
                  src={hoverImageUrl}
                  alt={hoverImage?.alt || `${name} - alternate view`}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Out of stock overlay */}
          {!hasStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="rounded bg-white px-3 py-1 text-sm font-medium text-black">
                Out of Stock
              </span>
            </div>
          )}

          {/* Add to cart icon - only show if in stock */}
          {hasStock && (
            <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-gray-50">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
            {name}
          </h3>

          {/* Available Colors */}
          {availableColors && availableColors.length > 0 && (
            <div className="flex items-center space-x-1">
              {availableColors.slice(0, 5).map((color, index) => (
                <div
                  key={`${color._id}-${index}`}
                  className="h-3 w-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              ))}
              {availableColors.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{availableColors.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <p className="text-sm font-medium text-gray-900">
            ${basePrice.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}
