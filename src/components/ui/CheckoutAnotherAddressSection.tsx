import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/services/sanity/types/sanity.types";

export default function CheckoutAnotherAddressSection({
  value,
  onChange,
}: {
  value: Address | null;
  onChange: (address: Address) => void;
}) {
  const address = value || {
    _type: "address" as const,
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    province: "QC" as const,
    postalCode: "",
    phoneNumber: "",
  };

  const handleChange = (field: keyof Address, fieldValue: string) => {
    onChange({
      ...address,
      [field]: fieldValue,
    });
  };

  return (
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
            value={address.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
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
          <Input
            value={address.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            id="shippingLastName"
            type="text"
            placeholder="Doe"
          />
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
          value={address.streetAddress || ""}
          onChange={(e) => handleChange("streetAddress", e.target.value)}
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
          <Input
            value={address.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            id="shippingCity"
            type="text"
            placeholder="Montreal"
          />
        </div>
        <div>
          <Label
            className="mb-1 uppercase font-bold text-xs"
            htmlFor="shippingProvince"
          >
            Province
          </Label>
          <Input
            value={address.province || ""}
            onChange={(e) => handleChange("province", e.target.value)}
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
            value={address.postalCode || ""}
            onChange={(e) => handleChange("postalCode", e.target.value)}
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
          value={address.phoneNumber || ""}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          id="shippingPhone"
          type="phone"
          placeholder="+1 (514) 555-0123"
        />
      </div>
    </div>
  );
}
