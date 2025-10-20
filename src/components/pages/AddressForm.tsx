"use client";

// COMPONENETS
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
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
  return (
    <div className="border p-6">
      <h3 className="text-xl font-bold mb-6">
        {mode === "add" ? "ADD ADDRESS" : "EDIT ADDRESS"}
      </h3>

      <form className="space-y-4">
        {/* Address Name */}
        <Field>
          <FieldLabel htmlFor="addressName" className="text-sm font-semibold">
            ADDRESS NAME <span className="text-red-600">*</span>
          </FieldLabel>
          <Input
            id="addressName"
            name="addressName"
            placeholder="Home Address"
          />
        </Field>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName" className="text-sm font-semibold">
              FIRST NAME <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="firstName" name="firstName" placeholder="John" />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName" className="text-sm font-semibold">
              LAST NAME <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="lastName" name="lastName" placeholder="Doe" />
          </Field>
        </div>

        {/* Address */}
        <Field>
          <FieldLabel htmlFor="address" className="text-sm font-semibold">
            ADDRESS <span className="text-red-600">*</span>
          </FieldLabel>
          <Input id="address" name="address" placeholder="123 Main Street" />
        </Field>

        {/* Apartment/Unit */}
        <Field>
          <FieldLabel htmlFor="aptUnit" className="text-sm font-semibold">
            APARTMENT/UNIT
          </FieldLabel>
          <Input id="aptUnit" name="aptUnit" placeholder="Apt 4B" />
        </Field>

        {/* City, Province, Postal Code */}
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="city" className="text-sm font-semibold">
              CITY <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="city" name="city" placeholder="Montreal" />
          </Field>
          <Field>
            <FieldLabel htmlFor="province" className="text-sm font-semibold">
              PROVINCE <span className="text-red-600">*</span>
            </FieldLabel>
            <Select name="province">
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
          </Field>
          <Field>
            <FieldLabel htmlFor="postalCode" className="text-sm font-semibold">
              POSTAL CODE <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="postalCode" name="postalCode" placeholder="H2X 1A1" />
          </Field>
        </div>

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
              onInput={(e) => {
                const input = e.currentTarget;
                input.value = input.value.replace(/\D/g, "");
              }}
            />
          </InputGroup>
        </Field>

        {/* Set as Default */}
        <div className="flex items-center gap-2">
          <Checkbox id="isDefault" name="isDefault" />
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
          >
            CANCEL
          </Button>
          <Button type="submit" className="flex-1">
            SAVE
          </Button>
        </div>
      </form>
    </div>
  );
}
