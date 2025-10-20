"use client";

// COMPONENTS
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  onCancel: () => void;
  mode: "add" | "edit";
}

export default function AddressForm({ onCancel, mode }: AddressFormProps) {
  return (
    <div className="border p-6">
      <h3 className="text-xl font-bold mb-6">
        {mode === "add" ? "ADD ADDRESS" : "EDIT ADDRESS"}
      </h3>
      <p>Address form fields will go here</p>

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          CANCEL
        </Button>
        <Button type="submit" className="flex-1">
          SAVE
        </Button>
      </div>
    </div>
  );
}
