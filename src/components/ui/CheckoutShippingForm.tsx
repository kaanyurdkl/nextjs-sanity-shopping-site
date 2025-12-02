"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  console.log("User addresses:", userAddresses);

  // Initialize with default -> first saved -> null (show form)
  const initialAddress = defaultUserAddress || userAddresses[0] || null;
  const [selectedAddress, setSelectedAddress] =
    useState<AddressWithKey | Address | null>(initialAddress);

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
              const isSelected = selectedAddress && "_key" in selectedAddress && selectedAddress._key === userAddress._key;
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
              {userAddresses.length > 0 ? "Enter a different address" : "Enter shipping address"}
            </h4>
            <CheckoutAnotherAddressSection
              value={selectedAddress && !("_key" in selectedAddress) ? selectedAddress : null}
              onChange={setSelectedAddress}
            />
          </div>
        )}
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
