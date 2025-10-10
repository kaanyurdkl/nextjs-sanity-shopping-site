import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PortableText } from "@portabletext/react";
import { getProductById } from "@/sanity/lib/utils";

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
          <div>Image carousel</div>
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
