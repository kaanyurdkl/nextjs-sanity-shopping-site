import { defineField, defineType } from "sanity";

/**
 * Reusable address schema for shipping and billing addresses
 *
 * Used by:
 * - User saved addresses
 * - Order shipping addresses
 * - Order billing addresses
 *
 * Fields:
 * - nickname: User-defined address name (e.g., "Home", "Office")
 * - firstName/lastName: Recipient name
 * - streetAddress: Street address line
 * - aptUnit: Optional apartment/unit number
 * - city: City name
 * - province: Canadian province (dropdown)
 * - postalCode: Canadian postal code with validation
 * - country: Fixed to "Canada"
 * - isDefault: Default address flag (for user addresses)
 */
export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "object",
  fieldsets: [
    {
      name: "identification",
      title: "Address Name",
      description: "What do you want to call this address?",
      options: { collapsible: false },
    },
    {
      name: "recipient",
      title: "Recipient Details",
      description: "Who will receive deliveries at this address?",
      options: { collapsible: false },
    },
    {
      name: "location",
      title: "Location Information",
      description: "The physical address details",
      options: { collapsible: false },
    },
    {
      name: "settings",
      title: "Address Settings",
      description: "Additional options for this address",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    // === ADDRESS NAME ===
    defineField({
      name: "nickname",
      title: "Address Name",
      type: "string",
      description:
        'Give this address a memorable name (e.g., "Home", "Office", "Mom\'s House")',
      validation: (rule) => rule.max(50),
      fieldset: "identification",
    }),

    // === RECIPIENT DETAILS ===
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      description: "Recipient's first name for deliveries",
      validation: (rule) => rule.required().max(50),
      fieldset: "recipient",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      description: "Recipient's last name for deliveries",
      validation: (rule) => rule.required().max(50),
      fieldset: "recipient",
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      description: "Contact phone number for delivery (optional)",
      validation: (rule) =>
        rule.custom((phone) => {
          if (!phone) return true; // Optional field
          const canadianPhoneRegex =
            /^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
          return (
            canadianPhoneRegex.test(phone) ||
            "Please enter a valid Canadian phone number"
          );
        }),
      fieldset: "recipient",
    }),

    // === LOCATION INFORMATION ===
    defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      description: "Street number and name",
      validation: (rule) => rule.required().max(100),
      fieldset: "location",
    }),
    defineField({
      name: "aptUnit",
      title: "Apartment/Unit",
      type: "string",
      description: "Apartment, suite, or unit number (optional)",
      fieldset: "location",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required().max(50),
      fieldset: "location",
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "string",
      options: {
        list: [
          { title: "Alberta", value: "AB" },
          { title: "British Columbia", value: "BC" },
          { title: "Manitoba", value: "MB" },
          { title: "New Brunswick", value: "NB" },
          { title: "Newfoundland and Labrador", value: "NL" },
          { title: "Northwest Territories", value: "NT" },
          { title: "Nova Scotia", value: "NS" },
          { title: "Nunavut", value: "NU" },
          { title: "Ontario", value: "ON" },
          { title: "Prince Edward Island", value: "PE" },
          { title: "Quebec", value: "QC" },
          { title: "Saskatchewan", value: "SK" },
          { title: "Yukon", value: "YT" },
        ],
      },
      validation: (rule) => rule.required(),
      fieldset: "location",
    }),
    defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string",
      description: "Canadian postal code (A1A 1A1 format)",
      validation: (rule) =>
        rule.required().custom((postalCode) => {
          if (!postalCode) return "Postal code is required";
          const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
          return (
            canadianPostalRegex.test(postalCode) ||
            "Please enter a valid Canadian postal code (A1A 1A1)"
          );
        }),
      fieldset: "location",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: "Currently only shipping within Canada",
      initialValue: "Canada",
      readOnly: true,
      fieldset: "location",
    }),
    // === ADDRESS SETTINGS ===
    defineField({
      name: "isDefault",
      title: "Set as Default Address",
      type: "boolean",
      description: "Make this the default address for shipping and billing",
      initialValue: false,
      fieldset: "settings",
    }),
  ],
  preview: {
    select: {
      nickname: "nickname",
      streetAddress: "streetAddress",
      city: "city",
      province: "province",
      phoneNumber: "phoneNumber",
      isDefault: "isDefault",
    },
    prepare({
      nickname,
      streetAddress,
      city,
      province,
      phoneNumber,
      isDefault,
    }) {
      const phoneInfo = phoneNumber ? ` • ${phoneNumber}` : "";
      return {
        title: nickname + (isDefault ? " (Default)" : ""),
        subtitle: `${streetAddress}, ${city}, ${province}${phoneInfo}`,
      };
    },
  },
});
