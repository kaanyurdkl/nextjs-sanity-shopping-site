// LIBRARIES
import { redirect } from "next/navigation";
// COMPONENTS
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CheckoutContactSection from "@/components/layout/CheckoutContactSection";
import CheckoutShippingSection from "@/components/layout/CheckoutShippingSection";
// UTILS
import { getCartWithDetails } from "@/services/sanity/utils/cart-utils";
// AUTH
import { auth } from "@/services/next-auth/lib";
import PaymentSection from "@/components/ui/PaymentSection";

export default async function CheckoutPage() {
  const cart = await getCartWithDetails();

  if (!cart || !cart.items) {
    redirect("/cart");
  }

  const session = await auth();

  return (
    <main className="px-6">
      <Breadcrumbs slug={["cart", "checkout"]} />
      <h1 className="mb-12 font-bold uppercase text-4xl">Checkout</h1>

      <CheckoutContactSection
        session={session}
        currentStep={cart.checkout?.currentStep || "contact"}
        email={cart.checkout?.contact?.email}
      />

      <CheckoutShippingSection
        session={session}
        currentStep={cart.checkout?.currentStep}
        data={cart.checkout?.shipping}
      />

      <PaymentSection
        session={session}
        currentStep={cart.checkout?.currentStep}
      />
    </main>
  );
}
