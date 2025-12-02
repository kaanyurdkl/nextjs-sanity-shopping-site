// COMPONENTS
import CheckoutShippingForm from "@/components/ui/CheckoutShippingForm";
import { USER_BY_GOOGLE_ID_QUERYResult } from "@/services/sanity/types/sanity.types";
// UTILS
import { getUserByGoogleId } from "@/services/sanity/utils/user-utils";
//TYPES
import { type Session } from "next-auth";

type CheckoutStep = "contact" | "shipping" | "payment";

export default async function CheckoutShippingSection({
  session,
  currentStep,
  data,
}: {
  session: Session | null;
  currentStep: CheckoutStep;
  data: any;
}) {
  // Determine rendering state
  const isCompleted = !!data?.shippingAddress && currentStep !== "shipping";
  const isCurrent = currentStep === "shipping";

  // Don't render if we haven't reached this step
  if (!data?.shippingAddress && !isCurrent) {
    return null;
  }

  let user: USER_BY_GOOGLE_ID_QUERYResult = null;

  if (session?.user?.googleId) {
    user = await getUserByGoogleId(session?.user?.googleId);
  }

  // Show summary if completed
  if (isCompleted) {
    return (
      <div className="mt-6">
        <div className="border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold uppercase text-sm">Shipping</h2>
            <button className="text-sm underline">Edit</button>
          </div>
          <div className="text-sm space-y-2">
            <div>
              <p className="font-medium">Shipping Address</p>
              <p className="text-gray-600">
                {data.shippingAddress.firstName} {data.shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{data.shippingAddress.streetAddress}</p>
              <p className="text-gray-600">
                {data.shippingAddress.city}, {data.shippingAddress.province}{" "}
                {data.shippingAddress.postalCode}
              </p>
            </div>
            <div>
              <p className="font-medium">Shipping Method</p>
              <p className="text-gray-600">
                {data.shippingMethod === "standard"
                  ? "Standard Shipping - $9.99"
                  : "Express Shipping - $19.99"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show form if current
  return (
    <div className="mt-6">
      <h2 className="font-bold uppercase text-xl mb-4">Shipping Information</h2>
      <CheckoutShippingForm user={user} />
    </div>
  );
}
