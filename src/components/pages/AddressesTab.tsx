"use client";

// LIBRARIES
import { useState } from "react";
// COMPONENTS
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/pages/AddressForm";
// TYPES
import type { USER_BY_GOOGLE_ID_QUERYResult } from "@/services/sanity/types/sanity.types";

interface AddressesTabProps {
  user: NonNullable<USER_BY_GOOGLE_ID_QUERYResult>;
}

export default function AddressesTab({ user }: AddressesTabProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase">Addresses</h2>

        {!isAddingAddress && (
          <Button onClick={handleAddAddress}>ADD ADDRESS</Button>
        )}
      </div>

      {isAddingAddress ? (
        <AddressForm onCancel={handleCancel} mode="add" />
      ) : (
        <p>No addresses yet. Click &quot;ADD ADDRESS&quot; to create one.</p>
      )}
    </div>
  );
}
