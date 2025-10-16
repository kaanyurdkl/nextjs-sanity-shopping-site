// COMPONENTS
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CartDetails from "@/components/ui/CartDetails";

export default function CartPage() {
  console.log("CartPage");
  return (
    <div>
      <Breadcrumbs slug={["cart"]} />
      <CartDetails />
    </div>
  );
}
