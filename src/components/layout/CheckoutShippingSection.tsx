// COMPONENTS
import CheckoutShippingForm from "@/components/ui/CheckoutShippingForm";
import { USER_BY_GOOGLE_ID_QUERYResult } from "@/services/sanity/types/sanity.types";
// UTILS
import { getUserByGoogleId } from "@/services/sanity/utils/user-utils";
//TYPES
import { type Session } from "next-auth";

export default async function CheckoutShippingSection({
  session,
  currentStep,
  data,
}: {
  session: Session | null;
  currentStep: string;
  data: any;
}) {
  const isCurrentStep = currentStep === "shipping";

  let user: USER_BY_GOOGLE_ID_QUERYResult = null;

  if (session?.user?.googleId) {
    user = await getUserByGoogleId(session?.user?.googleId);
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold uppercase text-xl mb-4">Shipping Information</h2>
      <CheckoutShippingForm user={user} />
    </div>
  );
}
