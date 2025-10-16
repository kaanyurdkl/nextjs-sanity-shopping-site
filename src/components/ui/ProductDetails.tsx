"use client";

// LIBRARIES
import { useRouter, usePathname, useSearchParams } from "next/navigation";
// COMPONENTS
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
// UTILS
import { urlFor } from "@/sanity/lib/image";
// TYPES
import { PRODUCT_BY_ID_QUERYResult } from "@/sanity/types/sanity.types";
import { useCartStore } from "@/stores/cart-store";

interface ProductDetailsProps {
  product: NonNullable<PRODUCT_BY_ID_QUERYResult>;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  console.log("ProductDetails");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addCartItem = useCartStore((state) => state.addCartItem);

  const uniqueColors = product.variants.reduce(
    (acc, variant) => {
      const colorExists = acc.find((color) => color._id === variant.color._id);

      if (!colorExists) {
        acc.push(variant.color);
      }

      return acc;
    },
    [] as NonNullable<typeof product.variants>[0]["color"][]
  );

  let selectedColor: NonNullable<typeof uniqueColors>[0] | undefined;

  if (searchParams.get("color")) {
    const searchParamsColor = searchParams.get("color")?.trim().toLowerCase();

    selectedColor = uniqueColors?.find(
      (color) => color.name.toLowerCase() === searchParamsColor
    );
  } else {
    selectedColor = product.variants[0].color;
  }

  const sizes = product.variants
    .filter((variant) => variant.color._id === selectedColor?._id)
    .map((variant) => variant.size);

  let selectedSize: (typeof sizes)[0] | undefined;

  if (searchParams.get("size")) {
    const searchParamsSize = searchParams.get("size")?.trim().toLowerCase();

    selectedSize = sizes.find(
      (size) => size.code.toLowerCase() === searchParamsSize
    );
  }

  function handleColorChange(colorName: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (params.has("size")) {
      params.delete("size");
    }

    params.set("color", colorName.toLowerCase());

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSizeChange(isChecked: boolean, sizeCode: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (isChecked) {
      params.set("size", sizeCode.toLowerCase());
    } else {
      params.delete("size");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function addToCart() {
    if (!selectedColor || !selectedSize || !product.variants) return;

    // Find the exact variant for this color/size combination
    const selectedVariant = product.variants.find(
      (variant) =>
        variant.color._id === selectedColor._id &&
        variant.size._id === selectedSize._id
    );

    if (!selectedVariant || selectedVariant.stockQuantity === 0) {
      return;
    }

    // Get the thumbnail image URL
    if (!product.thumbnail.asset?.url) return;

    const imageUrl = urlFor(product.thumbnail.asset.url)
      .width(200)
      .height(250)
      .format("webp")
      .quality(85)
      .url();

    addCartItem({
      productId: product._id,
      productName: product.name,
      variantSku: selectedVariant.sku,
      color: selectedColor.name,
      colorHex: selectedColor.hexCode,
      size: selectedSize.name,
      price: product.basePrice,
      imageUrl,
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-10">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => {
                const imageUrl = urlFor(image.asset.url)
                  .width(1600)
                  .height(1200)
                  .dpr(2)
                  .format("webp")
                  .quality(90)
                  .url();

                return (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-[5/6]">
                      <Image
                        src={imageUrl}
                        fill
                        alt={image.alt || product.name}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={90}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="text-2xl">${product.basePrice}</div>
          <PortableText value={product.description} />
          <div>
            <div>Colour</div>
            <div className="flex gap-x-4">
              {uniqueColors?.map((color) => (
                <label
                  key={color._id}
                  className={`relative flex ${color._id === selectedColor?._id ? "border" : ""} items-center justify-center cursor-pointer h-8 w-8 transition-colors`}
                >
                  <input
                    type="radio"
                    name="color"
                    checked={color._id === selectedColor?._id}
                    onChange={() => handleColorChange(color.name)}
                    className="appearance-none absolute block w-full h-full inset-0 cursor-pointer"
                  />
                  <span
                    style={{ backgroundColor: color.hexCode }}
                    className="absolute inset-0.5 flex items-center justify-center"
                  ></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div>Size</div>
            <div className="flex flex-wrap gap-x-4">
              {sizes?.map((size) => (
                <label
                  key={size._id}
                  className={`relative flex ${size._id === selectedSize?._id ? "bg-black hover:bg-gray-800 text-white" : "bg-white text-black hover:bg-gray-200"} items-center border justify-center cursor-pointer h-8 w-14 transition-colors`}
                >
                  <input
                    type="checkbox"
                    name="size"
                    checked={size._id === selectedSize?._id}
                    onChange={(e) =>
                      handleSizeChange(e.target.checked, size.code)
                    }
                    className="appearance-none absolute block w-full h-full inset-0 cursor-pointer"
                  />
                  <span className="absolute inset-0.5 flex items-center justify-center">
                    {size.code}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Button
              disabled={!selectedColor || !selectedSize}
              className="w-full"
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
