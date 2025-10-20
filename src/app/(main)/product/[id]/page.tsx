// COMPONENTS
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetails from "@/components/ui/ProductDetails";
// UTILS
import { getProductById } from "@/services/sanity/lib/utils";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Breadcrumbs slug={[...product.category.slug.split("/"), product.slug]} />
      <ProductDetails product={product} />
    </div>
  );
}
