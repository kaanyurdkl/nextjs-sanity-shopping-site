"use client";

// LIBRARIES
import { useState } from "react";
// COMPONENTS
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/pages/AddressForm";
import AddressCard from "@/components/pages/AddressCard";
// TYPES
import type { USER_BY_GOOGLE_ID_QUERYResult } from "@/services/sanity/types/sanity.types";

interface AddressesTabProps {
  user: NonNullable<USER_BY_GOOGLE_ID_QUERYResult>;
}

export default function AddressesTab({ user }: AddressesTabProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressIndex(null);
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddressIndex(null);
  };

  const handleEdit = (addressIndex: number) => {
    setEditingAddressIndex(addressIndex);
    setIsAddingAddress(false);
  };

  const handleDelete = (addressIndex: number) => {
    // TODO: Implement delete functionality
    console.log("Delete address at index:", addressIndex);
  };

  const handleSetDefault = (addressIndex: number) => {
    // TODO: Implement set default functionality
    console.log("Set default address at index:", addressIndex);
  };

  const hasAddresses = user.addresses && user.addresses.length > 0;
  const isShowingForm = isAddingAddress || editingAddressIndex !== null;
  const editingAddress =
    editingAddressIndex !== null && user.addresses
      ? user.addresses[editingAddressIndex]
      : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase">Addresses</h2>

        {!isShowingForm && (
          <Button onClick={handleAddAddress}>ADD ADDRESS</Button>
        )}
      </div>

      {isShowingForm ? (
        <AddressForm
          onCancel={handleCancel}
          mode={isAddingAddress ? "add" : "edit"}
          initialData={editingAddress || undefined}
        />
      ) : hasAddresses ? (
        <div className="space-y-4">
          {user.addresses!.map((address, index) => (
            <AddressCard
              key={address._key || index}
              address={address}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
              onSetDefault={() => handleSetDefault(index)}
            />
          ))}
        </div>
      ) : (
        <p>No addresses yet. Click &quot;ADD ADDRESS&quot; to create one.</p>
      )}
    </div>
  );
}
