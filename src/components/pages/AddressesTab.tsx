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
  const [editingAddressKey, setEditingAddressKey] = useState<string | null>(
    null,
  );

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressKey(null);
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddressKey(null);
  };

  const handleEdit = (addressKey: string) => {
    setEditingAddressKey(addressKey);
    setIsAddingAddress(false);
  };

  const handleDelete = (addressKey: string) => {
    // TODO: Implement delete functionality
    console.log("Delete address with key:", addressKey);
  };

  const handleSetDefault = (addressKey: string) => {
    // TODO: Implement set default functionality
    console.log("Set default address with key:", addressKey);
  };

  const hasAddresses = user.addresses && user.addresses.length > 0;
  const isShowingForm = isAddingAddress || editingAddressKey !== null;
  const editingAddress =
    editingAddressKey !== null && user.addresses
      ? user.addresses.find((addr) => addr._key === editingAddressKey)
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
          {user.addresses!.map((address) => (
            <AddressCard
              key={address._key}
              address={address}
              onEdit={() => handleEdit(address._key)}
              onDelete={() => handleDelete(address._key)}
              onSetDefault={() => handleSetDefault(address._key)}
            />
          ))}
        </div>
      ) : (
        <p>No addresses yet. Click &quot;ADD ADDRESS&quot; to create one.</p>
      )}
    </div>
  );
}
