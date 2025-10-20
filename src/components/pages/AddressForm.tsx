"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ACTIONS
import { addAddressAction } from "@/app/(main)/account/actions";

// COMPONENTS
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  onCancel: () => void;
  mode: "add" | "edit";
}

export default function AddressForm({ onCancel, mode }: AddressFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addAddressAction, {});

  // Handle successful submission
  useEffect(() => {
    if (state.success) {
      toast.success(state.message || "Address added successfully");
      onCancel(); // Close the form
      router.refresh(); // Refresh to show new address
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onCancel, router]);

  return (
    <div className="border p-6">
      <h3 className="text-xl font-bold mb-6">
        {mode === "add" ? "ADD ADDRESS" : "EDIT ADDRESS"}
      </h3>

      <form action={formAction} className="space-y-4">
        {/* Address Name */}
        <Field>
          <FieldLabel htmlFor="addressName" className="text-sm font-semibold">
            ADDRESS NAME <span className="text-red-600">*</span>
          </FieldLabel>
          <Input
            id="addressName"
            name="addressName"
            placeholder="Home Address"
            disabled={isPending}
          />
          {state.errors?.nickname && (
            <FieldError>{state.errors.nickname[0]}</FieldError>
          )}
        </Field>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName" className="text-sm font-semibold">
              FIRST NAME <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              disabled={isPending}
            />
            {state.errors?.firstName && (
              <FieldError>{state.errors.firstName[0]}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName" className="text-sm font-semibold">
              LAST NAME <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              disabled={isPending}
            />
            {state.errors?.lastName && (
              <FieldError>{state.errors.lastName[0]}</FieldError>
            )}
          </Field>
        </div>

        {/* Address */}
        <Field>
          <FieldLabel htmlFor="address" className="text-sm font-semibold">
            ADDRESS <span className="text-red-600">*</span>
          </FieldLabel>
          <Input
            id="address"
            name="address"
            placeholder="123 Main Street"
            disabled={isPending}
          />
          {state.errors?.streetAddress && (
            <FieldError>{state.errors.streetAddress[0]}</FieldError>
          )}
        </Field>

        {/* Apartment/Unit */}
        <Field>
          <FieldLabel htmlFor="aptUnit" className="text-sm font-semibold">
            APARTMENT/UNIT
          </FieldLabel>
          <Input
            id="aptUnit"
            name="aptUnit"
            placeholder="Apt 4B"
            disabled={isPending}
          />
          {state.errors?.aptUnit && (
            <FieldError>{state.errors.aptUnit[0]}</FieldError>
          )}
        </Field>

        {/* City, Province, Postal Code */}
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="city" className="text-sm font-semibold">
              CITY <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="city"
              name="city"
              placeholder="Montreal"
              disabled={isPending}
            />
            {state.errors?.city && (
              <FieldError>{state.errors.city[0]}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="province" className="text-sm font-semibold">
              PROVINCE <span className="text-red-600">*</span>
            </FieldLabel>
            <Select name="province" disabled={isPending}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AB">Alberta</SelectItem>
                <SelectItem value="BC">British Columbia</SelectItem>
                <SelectItem value="MB">Manitoba</SelectItem>
                <SelectItem value="NB">New Brunswick</SelectItem>
                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                <SelectItem value="NT">Northwest Territories</SelectItem>
                <SelectItem value="NS">Nova Scotia</SelectItem>
                <SelectItem value="NU">Nunavut</SelectItem>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="PE">Prince Edward Island</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
                <SelectItem value="SK">Saskatchewan</SelectItem>
                <SelectItem value="YT">Yukon</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.province && (
              <FieldError>{state.errors.province[0]}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="postalCode" className="text-sm font-semibold">
              POSTAL CODE <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="postalCode"
              name="postalCode"
              className="uppercase"
              placeholder="H2X 1A1"
              disabled={isPending}
            />
            {state.errors?.postalCode && (
              <FieldError>{state.errors.postalCode[0]}</FieldError>
            )}
          </Field>
        </div>

        {/* Country */}
        <Field>
          <FieldLabel htmlFor="country" className="text-sm font-semibold">
            COUNTRY <span className="text-red-600">*</span>
          </FieldLabel>
          <Select disabled defaultValue="Canada">
            <SelectTrigger id="country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Phone */}
        <Field>
          <FieldLabel htmlFor="phoneNumber" className="text-sm font-semibold">
            PHONE
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>+1</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="5555555555"
              maxLength={10}
              inputMode="numeric"
              disabled={isPending}
              onInput={(e) => {
                const input = e.currentTarget;
                input.value = input.value.replace(/\D/g, "");
              }}
            />
          </InputGroup>
          {state.errors?.phoneNumber && (
            <FieldError>{state.errors.phoneNumber[0]}</FieldError>
          )}
        </Field>

        {/* Set as Default */}
        <div className="flex items-center gap-2">
          <Checkbox id="isDefault" name="isDefault" disabled={isPending} />
          <Label htmlFor="isDefault" className="text-sm">
            Set as default address
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isPending}
          >
            CANCEL
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? "SAVING..." : "SAVE"}
          </Button>
        </div>
      </form>
    </div>
  );
}
