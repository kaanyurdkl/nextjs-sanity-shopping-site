"use client";

// LIBRARIES
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// COMPONENTS
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/pages/AddressForm";
import AddressCard from "@/components/pages/AddressCard";
// ACTIONS
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/(main)/account/actions";
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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this address? This action cannot be undone.",
    );
    if (!confirmed) return;

    startTransition(async () => {
      toast.promise(deleteAddressAction(addressKey), {
        loading: "Deleting address...",
        success: (result) => {
          if (result.success) {
            router.refresh();
            return result.message;
          }
          throw new Error(result.message);
        },
        error: (err) => err.message || "Failed to delete address",
      });
    });
  };

  const handleSetDefault = (addressKey: string) => {
    startTransition(async () => {
      toast.promise(setDefaultAddressAction(addressKey), {
        loading: "Setting default address...",
        success: (result) => {
          if (result.success) {
            router.refresh();
            return result.message;
          }
          throw new Error(result.message);
        },
        error: (err) => err.message || "Failed to set default address",
      });
    });
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
          <Button onClick={handleAddAddress} disabled={isPending}>
            ADD ADDRESS
          </Button>
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
              isDisabled={isPending}
            />
          ))}
        </div>
      ) : (
        <p>No addresses yet. Click &quot;ADD ADDRESS&quot; to create one.</p>
      )}
    </div>
  );
}
