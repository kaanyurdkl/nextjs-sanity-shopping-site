import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult } from "@/sanity/types/sanity.types";

type Product = PRODUCTS_BY_CATEGORY_HIERARCHY_QUERYResult[0];

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, slug, basePrice, thumbnail, hoverImage, variants, hasStock } =
    product;

  // Compute unique colors from variants
  const uniqueColors =
    variants?.reduce(
      (acc, variant) => {
        if (
          variant.color &&
          !acc.find((color) => color._id === variant.color._id)
        ) {
          acc.push(variant.color);
        }
        return acc;
      },
      [] as NonNullable<NonNullable<typeof variants>[0]["color"]>[]
    ) || [];

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
      {/* Product Image */}
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <>
              {/* Main image */}
              <Image
                src={thumbnailUrl}
                alt={thumbnail.alt || name}
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
        </div>
      </Link>
      {/* Product Info */}
      <div className="mt-4 space-y-4">
        <div className="space-y-1">
          {/* Product Name */}
          <Link href={`/products/${slug}`} className="block hover:underline">
            <h3 className="uppercase">{name}</h3>
          </Link>
          {/* Price */}
          <p className="font-bold">${basePrice.toFixed(2)}</p>
        </div>
        {/* Available Colors */}
        {uniqueColors && uniqueColors.length > 0 && (
          <div className="flex items-center space-x-1">
            {uniqueColors.slice(0, 5).map((color: any, index: number) => (
              <div
                key={`${color._id}-${index}`}
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            ))}
            {uniqueColors.length > 5 && (
              <span className="text-sm">+{uniqueColors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
