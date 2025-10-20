"use client";

import { Button } from "@/components/ui/button";
import type { USER_BY_GOOGLE_ID_QUERYResult } from "@/services/sanity/types/sanity.types";

interface AddressesTabProps {
  user: NonNullable<USER_BY_GOOGLE_ID_QUERYResult>;
}

export default function AddressesTab({ user }: AddressesTabProps) {
  const handleAddAddress = () => {
    console.log("Add address clicked");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold uppercase">Addresses</h2>

        <Button onClick={handleAddAddress}>ADD ADDRESS</Button>
      </div>
      <p>Addresses tab content will go here</p>
    </div>
  );
}
