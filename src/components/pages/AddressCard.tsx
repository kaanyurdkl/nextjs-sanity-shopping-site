// COMPONENTS
import { Button } from "@/components/ui/button";
// TYPES
import type { Address } from "@/services/sanity/types/sanity.types";
// UTILS
import { formatCanadianPhoneNumber } from "@/lib/utils/format";

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isDisabled?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDisabled = false,
}: AddressCardProps) {
  return (
    <div className="border p-6">
      {/* Header with nickname and default badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">{address.nickname}</h3>
          {address.isDefault && (
            <span className="bg-black text-white text-xs px-2 py-1 font-semibold">
              Default
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {!address.isDefault && (
            <Button
              onClick={onSetDefault}
              variant="outline"
              size="sm"
              disabled={isDisabled}
            >
              Set Default
            </Button>
          )}
          <Button onClick={onEdit} variant="outline" size="sm" disabled={isDisabled}>
            Edit
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm" disabled={isDisabled}>
            Delete
          </Button>
        </div>
      </div>

      {/* Address details */}
      <div className="space-y-1 text-sm">
        <p>
          {address.firstName} {address.lastName}
        </p>
        <p>
          {address.streetAddress}
          {address.aptUnit && `, ${address.aptUnit}`}
        </p>
        <p>
          {address.city}, {address.province}, {address.postalCode},{" "}
          {address.country || "Canada"}
        </p>
        {address.phoneNumber && (
          <p>{formatCanadianPhoneNumber(address.phoneNumber)}</p>
        )}
      </div>
    </div>
  );
}
