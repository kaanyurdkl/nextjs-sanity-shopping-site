import { defineField, defineType } from 'sanity'

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
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    // Address Identification
    defineField({
      name: 'nickname',
      title: 'Address Nickname',
      type: 'string',
      description: 'User-defined name (e.g., "Home", "Office")',
      validation: (rule) => rule.required().max(50),
    }),

    // Recipient Information
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required().max(50),
    }),

    // Address Details
    defineField({
      name: 'streetAddress',
      title: 'Street Address',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'aptUnit',
      title: 'Apartment/Unit',
      type: 'string',
      description: 'Optional apartment or unit number',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: 'province',
      title: 'Province',
      type: 'string',
      options: {
        list: [
          { title: 'Alberta', value: 'AB' },
          { title: 'British Columbia', value: 'BC' },
          { title: 'Manitoba', value: 'MB' },
          { title: 'New Brunswick', value: 'NB' },
          { title: 'Newfoundland and Labrador', value: 'NL' },
          { title: 'Northwest Territories', value: 'NT' },
          { title: 'Nova Scotia', value: 'NS' },
          { title: 'Nunavut', value: 'NU' },
          { title: 'Ontario', value: 'ON' },
          { title: 'Prince Edward Island', value: 'PE' },
          { title: 'Quebec', value: 'QC' },
          { title: 'Saskatchewan', value: 'SK' },
          { title: 'Yukon', value: 'YT' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      description: 'Canadian postal code (A1A 1A1 format)',
      validation: (rule) => 
        rule.required().custom((postalCode) => {
          if (!postalCode) return 'Postal code is required'
          const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
          return canadianPostalRegex.test(postalCode) || 'Please enter a valid Canadian postal code (A1A 1A1)'
        }),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Canada',
      readOnly: true,
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Contact phone number for this address (optional)',
      validation: (rule) => 
        rule.custom((phone) => {
          if (!phone) return true // Optional field
          const canadianPhoneRegex = /^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
          return canadianPhoneRegex.test(phone) || 'Please enter a valid Canadian phone number'
        }),
    }),

    // Address Settings
    defineField({
      name: 'isDefault',
      title: 'Default Address',
      type: 'boolean',
      description: 'Mark as default shipping address',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      nickname: 'nickname',
      streetAddress: 'streetAddress',
      city: 'city',
      province: 'province',
      phoneNumber: 'phoneNumber',
      isDefault: 'isDefault',
    },
    prepare({ nickname, streetAddress, city, province, phoneNumber, isDefault }) {
      const phoneInfo = phoneNumber ? ` • ${phoneNumber}` : '';
      return {
        title: nickname + (isDefault ? ' (Default)' : ''),
        subtitle: `${streetAddress}, ${city}, ${province}${phoneInfo}`,
      }
    },
  },
})