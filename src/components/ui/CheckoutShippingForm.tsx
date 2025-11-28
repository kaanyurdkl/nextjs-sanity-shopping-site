"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutAnotherAddressSection from "@/components/ui/CheckoutAnotherAddressSection";
import {
  Address,
  USER_BY_GOOGLE_ID_QUERYResult,
} from "@/services/sanity/types/sanity.types";
import { submitShippingInfoAction } from "@/app/(main)/checkout/actions";
import { useState } from "react";

export default function CheckoutShippingForm({
  user,
}: {
  user: USER_BY_GOOGLE_ID_QUERYResult;
}) {
  const userAddresses: Address[] = user?.addresses || [];
  const defaultUserAddress: Address | null =
    userAddresses?.find((address) => address.isDefault) || null;

  const [selectedUserAddress, setSelectedUserAddress] =
    useState(defaultUserAddress);

  async function handleSubmit(formData: FormData) {
    await submitShippingInfoAction();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="border space-y-4 p-4">
        <h3 className="font-bold text-lg">Shipping Address</h3>
        {selectedUserAddress && (
          <div className="p-4 border">
            <div className="flex justify-between">
              <h4>{selectedUserAddress.nickname}</h4>
              {selectedUserAddress.isDefault && (
                <div className="p-2 bg-black text-white">Default</div>
              )}
            </div>
            <div>
              <Button>Change</Button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-x-4">
          <span className="inline-block h-0.5 w-full border-b"></span>
          <span>or</span>
          <span className="inline-block h-0.5 w-full border-b"></span>
        </div>
        <CheckoutAnotherAddressSection />
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
            <Input id="billingAddress" type="text" placeholder="1234 Main St" />
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
              <Input id="billingProvince" type="text" placeholder="Quebec" />
            </div>
            <div>
              <Label className="mb-1" htmlFor="billingPostalCode">
                Postal Code
              </Label>
              <Input id="billingPostalCode" type="text" placeholder="H2K 1A1" />
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
            <Label htmlFor="standardShipping">Standard Shipping - $9.99</Label>
          </div>
          <div className="flex items-center gap-x-2">
            <RadioGroupItem id="expressShipping" value="express" />
            <Label htmlFor="expressShipping">Express Shipping - $19.99</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full">
        Continue To Payment
      </Button>
    </form>
  );
}
