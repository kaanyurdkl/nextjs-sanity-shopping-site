// LIBRARIES
import { redirect } from "next/navigation";
// COMPONENTS
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// UTILS
import { getCartWithDetails } from "@/services/sanity/utils/cart-utils";
// AUTH
import { auth } from "@/services/next-auth/lib";
import CheckoutContactSection from "@/components/layout/CheckoutContactSection";

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
        status={cart.checkout?.contact?.status || "current"}
        email={cart.checkout?.contact?.email}
      />

      <div className="mt-6">
        <h2 className="font-bold uppercase text-xl mb-4">
          Shipping Information
        </h2>
        <div className="space-y-4">
          <div className="border space-y-4 p-4">
            <h3 className="font-bold text-lg">Shipping Address</h3>
            <div className="p-4 border">
              <div className="flex justify-between">
                <h4>ADDRESS NAME</h4>
                <div className="p-2 bg-black text-white">Default</div>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <span className="inline-block h-0.5 w-full border-b"></span>
              <span>or</span>
              <span className="inline-block h-0.5 w-full border-b"></span>
            </div>
            <Button className="w-full uppercase">
              Choose a different address
            </Button>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <Label
                    className="mb-1 uppercase font-bold text-xs"
                    htmlFor="shippingFirstName"
                  >
                    First Name
                  </Label>
                  <Input
                    id="shippingFirstName"
                    type="text"
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label
                    className="mb-1 uppercase font-bold text-xs"
                    htmlFor="shippingLastName"
                  >
                    Last Name
                  </Label>
                  <Input id="shippingLastName" type="text" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label
                  className="mb-1 uppercase font-bold text-xs"
                  htmlFor="shippingAddress"
                >
                  Address
                </Label>
                <Input
                  id="shippingAddress"
                  type="text"
                  placeholder="1234 Main St"
                />
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <div>
                  <Label
                    className="mb-1 uppercase font-bold text-xs"
                    htmlFor="shippingCity"
                  >
                    City
                  </Label>
                  <Input id="shippingCity" type="text" placeholder="Montreal" />
                </div>
                <div>
                  <Label
                    className="mb-1 uppercase font-bold text-xs"
                    htmlFor="shippingProvince"
                  >
                    Province
                  </Label>
                  <Input
                    id="shippingProvince"
                    type="text"
                    placeholder="Quebec"
                  />
                </div>
                <div>
                  <Label
                    className="mb-1 uppercase font-bold text-xs"
                    htmlFor="shippingPostalCode"
                  >
                    Postal Code
                  </Label>
                  <Input
                    id="shippingPostalCode"
                    type="text"
                    placeholder="H2K 1A1"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="shippingPhone"
                  className="uppercase font-bold text-xs mb-1"
                >
                  Phone
                </Label>
                <Input
                  id="shippingPhone"
                  type="phone"
                  placeholder="+1 (514) 555-0123"
                />
              </div>
            </div>
          </div>
          <div className="border space-y-4 p-4">
            <h3 className="font-bold text-lg">Billing Address</h3>
            <div className="flex items-center gap-x-2">
              <Checkbox id="sameAsShipping" />
              <Label htmlFor="sameAsShipping">Same as shipping address</Label>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <Label className="mb-1" htmlFor="billingFirstName">
                    First Name
                  </Label>
                  <Input id="billingFirstName" type="text" placeholder="John" />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="billingLastName">
                    Last Name
                  </Label>
                  <Input id="billingLastName" type="text" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label className="mb-1" htmlFor="billingAddress">
                  Address
                </Label>
                <Input
                  id="billingAddress"
                  type="text"
                  placeholder="1234 Main St"
                />
              </div>
              <div className="grid grid-cols-3 gap-x-4">
                <div>
                  <Label className="mb-1" htmlFor="billingCity">
                    City
                  </Label>
                  <Input id="billingCity" type="text" placeholder="Montreal" />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="billingProvince">
                    Province
                  </Label>
                  <Input
                    id="billingProvince"
                    type="text"
                    placeholder="Quebec"
                  />
                </div>
                <div>
                  <Label className="mb-1" htmlFor="billingPostalCode">
                    Postal Code
                  </Label>
                  <Input
                    id="billingPostalCode"
                    type="text"
                    placeholder="H2K 1A1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="billingPhone">Phone</Label>
                <Input
                  id="billingPhone"
                  type="phone"
                  placeholder="+1 (514) 555-0123"
                />
              </div>
            </div>
          </div>
          <div className="border space-y-4 p-4">
            <h3>Shipping Method</h3>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center gap-x-2">
                <RadioGroupItem id="standardShipping" value="standard" />
                <Label htmlFor="standardShipping">
                  Standard Shipping - $9.99
                </Label>
              </div>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem id="expressShipping" value="express" />
                <Label htmlFor="expressShipping">
                  Express Shipping - $19.99
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button className="w-full">Continue To Payment</Button>
        </div>
      </div>
    </main>
  );
}
