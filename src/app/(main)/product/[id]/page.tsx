// COMPONENTS
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// UTILS
import { getProductById } from "@/sanity/lib/utils";
import { urlFor } from "@/sanity/lib/image";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  console.log(product?.description);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrumbs slug={[...product.category.slug.split("/"), product.slug]} />
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
          </div>
        </div>
      </div>
    </div>
  );
}
