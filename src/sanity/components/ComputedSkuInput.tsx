import React from "react";
import { StringInputProps, useFormValue, useClient, set } from "sanity";
import { Button, Stack, TextInput, useToast } from "@sanity/ui";

export function ComputedSkuInput(props: StringInputProps) {
  const { onChange, value, path } = props;

  // Get the full document value to access product name
  const document = useFormValue([]) as any;

  // Get the parent variant path by removing the last segment (which is 'sku')
  const variantPath = path.slice(0, -1);

  // Access sibling fields within this variant
  const variantColor = useFormValue([...variantPath, "color"]) as any;
  const variantSize = useFormValue([...variantPath, "size"]) as any;

  // Get Sanity client from context with API version
  const client = useClient({ apiVersion: "2025-01-14" });

  // Get toast hook for user notifications
  const toast = useToast();

  // Function to get next sequence number from existing SKUs
  const getNextSequenceNumber = (existingSkus: string[]): string => {
    // Extract sequence numbers from matching SKUs
    const sequenceNumbers = existingSkus
      .map((sku: string) => {
        // Extract the sequence part after the last dash
        const parts = sku.split("-");
        const sequencePart = parts[parts.length - 1];
        // Parse as number, return 0 if invalid
        return parseInt(sequencePart, 10) || 0;
      })
      .filter((num: number) => num > 0); // Only keep valid numbers

    // Find the highest sequence number and add 1
    const highestSequence =
      sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) : 0;

    const nextSequence = highestSequence + 1;

    // Return as 3-digit padded string
    return nextSequence.toString().padStart(3, "0");
  };

  // Function to generate SKU
  const generateSku = async () => {
    // If SKU already exists don't regenerate
    if (value) {
      return;
    }
    try {
      // Get product code from product name
      const productName = document.name;
      const productCode = productName.substring(0, 3).toUpperCase();

      // Batch query: Get all required data in a single API call
      const data = await client.fetch(
        `{
          "colorCode": *[_type == "color" && _id == $colorRef][0].code,
          "sizeCode": *[_type == "size" && _id == $sizeRef][0].code,
          "existingSkus": array::compact(*[_type == "product"].variants[].sku[string::startsWith(@, $productPrefix)])
        }`,
        {
          colorRef: variantColor._ref,
          sizeRef: variantSize._ref,
          productPrefix: productCode + "-",
        }
      );

      // Extract data from batch response
      const colorCode = data.colorCode;
      const sizeCode = data.sizeCode;

      // Create the exact SKU prefix and filter existing SKUs
      const skuPrefix = `${productCode}-${colorCode}-${sizeCode}-`;

      const matchingSkus = data.existingSkus.filter((sku: string) =>
        sku.startsWith(skuPrefix)
      );

      // Generate sequence number
      const sequenceNumber = getNextSequenceNumber(matchingSkus);

      // Create final SKU
      const sku = `${productCode}-${colorCode}-${sizeCode}-${sequenceNumber}`;

      // Update the field value using Sanity's set patch
      onChange(set(sku));
    } catch (error) {
      console.error("Error generating SKU:", error);
      // Don't generate invalid SKUs - show error toast to user
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Please ensure all required fields are filled correctly.";

      toast.push({
        status: "error",
        title: "SKU Generation Failed",
        description: errorMessage,
      });
    }
  };

  return (
    <Stack space={2}>
      <TextInput
        {...props.elementProps}
        value={value || ""}
        onChange={(event) => onChange(set(event.currentTarget.value))}
        readOnly={true}
      />
      <Button
        mode="default"
        tone="primary"
        text="Generate SKU"
        onClick={generateSku}
        disabled={
          !document?.name ||
          !variantColor?._ref ||
          !variantSize?._ref ||
          !document?.productType?._ref
        }
      />
    </Stack>
  );
}
