import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function CheckoutAnotherAddressSection() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [anotherAddress, setAnotherAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });

  return (
    <>
      {!showAddressForm && (
        <Button
          onClick={() => setShowAddressForm((prevState) => !prevState)}
          className="w-full uppercase"
        >
          Choose a different address
        </Button>
      )}
      {showAddressForm && (
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
                value={anotherAddress.firstName}
                onChange={(e) =>
                  setAnotherAddress((anotherAddress) => ({
                    ...anotherAddress,
                    firstName: e.target.value,
                  }))
                }
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
              <Input id="shippingProvince" type="text" placeholder="Quebec" />
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
      )}
    </>
  );
}
