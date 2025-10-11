"use client";

// LIBRARIES
import { useSearchParams } from "next/navigation";
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
// UTILS
import { urlFor } from "@/sanity/lib/image";
// TYPES
import { PRODUCT_BY_ID_QUERYResult } from "@/sanity/types/sanity.types";

interface ProductDetailsProps {
  product: NonNullable<PRODUCT_BY_ID_QUERYResult>;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const searchParams = useSearchParams();

  const uniqueColors = product.variants?.reduce(
    (acc, variant) => {
      const colorExists = acc.find((color) => color._id === variant.color._id);

      if (!colorExists) {
        acc.push(variant.color);
      }

      return acc;
    },
    [] as NonNullable<typeof product.variants>[0]["color"][]
  );

  let selectedColor;

  if (searchParams.get("color")) {
    const searchParamsColor = searchParams.get("color")?.trim().toLowerCase();

    selectedColor = uniqueColors?.find(
      (color) => color.name.toLowerCase() === searchParamsColor
    );
  } else {
    selectedColor = product.variants[0].color;
  }

  // {  color: { name: red }, size: { code: s } }
  // {  color: { name: red }, size: { code: m } }
  // {  color: { name: red }, size: { code: l } }
  // {  color: { name: white }, size: { code: s } }
  // {  color: { name: white }, size: { code: m } }
  // {  color: { name: white }, size: { code: l } }

  // [ { name: red }, { name: white } ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-10">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images?.map((image, index) => {
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
        </div>
      </div>
    </div>
  );
}
