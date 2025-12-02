"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutAnotherAddressSection from "@/components/ui/CheckoutAnotherAddressSection";
import { Badge } from "@/components/ui/badge";
import { submitShippingInfoAction } from "@/app/(main)/checkout/actions";
import {
  Address,
  USER_BY_GOOGLE_ID_QUERYResult,
} from "@/services/sanity/types/sanity.types";

type AddressWithKey = Address & { _key: string };

export default function CheckoutShippingForm({
  user,
}: {
  user: USER_BY_GOOGLE_ID_QUERYResult;
}) {
  const userAddresses: AddressWithKey[] = user?.addresses || [];
  const defaultUserAddress: AddressWithKey | null =
    userAddresses?.find((address) => address.isDefault) || null;

  console.log("CheckoutShippingForm");

  // Initialize with default -> first saved -> null (show form)
  const initialAddress = defaultUserAddress || userAddresses[0] || null;
  const [selectedAddress, setSelectedAddress] = useState<
    AddressWithKey | Address | null
  >(initialAddress);

  const [useSameAddressForBilling, setUseSameAddressForBilling] =
    useState(true);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );

  async function handleSubmit(formData: FormData) {
    await submitShippingInfoAction();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="border space-y-4 p-4">
        <h3 className="font-bold text-lg">Shipping Address</h3>

        {userAddresses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Saved Addresses</h4>
            {userAddresses.map((userAddress) => {
              const isSelected =
                selectedAddress &&
                "_key" in selectedAddress &&
                selectedAddress._key === userAddress._key;
              return (
                <div
                  key={userAddress._key}
                  onClick={() => setSelectedAddress(userAddress)}
                  className={`p-4 border rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? "ring-2 ring-black" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{userAddress.nickname}</span>
                    <div className="flex gap-2">
                      {userAddress.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      {isSelected && <Badge>Selected</Badge>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {userAddress.streetAddress}, {userAddress.city},{" "}
                    {userAddress.province} {userAddress.postalCode}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {userAddresses.length > 0 && (
          <div className="flex items-center gap-x-4">
            <span className="inline-block h-0.5 w-full border-b"></span>
            <span>or</span>
            <span className="inline-block h-0.5 w-full border-b"></span>
          </div>
        )}

        {selectedAddress && "_key" in selectedAddress ? (
          <Button
            type="button"
            onClick={() => setSelectedAddress(null)}
            className="w-full uppercase"
          >
            Choose a different address
          </Button>
        ) : (
          <div>
            <h4 className="font-medium text-sm mb-2">
              {userAddresses.length > 0
                ? "Enter a different address"
                : "Enter shipping address"}
            </h4>
            <CheckoutAnotherAddressSection
              value={
                selectedAddress && !("_key" in selectedAddress)
                  ? selectedAddress
                  : null
              }
              onChange={setSelectedAddress}
            />
          </div>
        )}
      </div>
      <div className="border space-y-4 p-4">
        <h3 className="font-bold text-lg">Billing Address</h3>
        <div className="flex items-center gap-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={useSameAddressForBilling}
            onCheckedChange={(checked) => {
              setUseSameAddressForBilling(checked === true);
              if (checked === true) {
                setBillingAddress(null);
              }
            }}
          />
          <Label htmlFor="sameAsShipping">Same as shipping address</Label>
        </div>
        {!useSameAddressForBilling && (
          <CheckoutAnotherAddressSection
            value={billingAddress}
            onChange={setBillingAddress}
          />
        )}
      </div>
      <div className="border space-y-4 p-4">
        <h3 className="font-bold text-lg">Shipping Method</h3>
        <RadioGroup value={shippingMethod} onValueChange={(value) => setShippingMethod(value as "standard" | "express")}>
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
