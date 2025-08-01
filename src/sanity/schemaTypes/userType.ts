import { defineField, defineType } from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    // Google OAuth Integration
    defineField({
      name: 'googleId',
      title: 'Google ID',
      type: 'string',
      description: 'Unique identifier from Google OAuth',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Email from Google OAuth (read-only)',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      description: 'User can edit this field',
      validation: (rule) => rule.required().min(1).max(50),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      description: 'User can edit this field',
      validation: (rule) => rule.required().min(1).max(50),
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Canadian phone number format',
      validation: (rule) => 
        rule.custom((phone) => {
          if (!phone) return true // Optional field
          const canadianPhoneRegex = /^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
          return canadianPhoneRegex.test(phone) || 'Please enter a valid Canadian phone number'
        }),
    }),

    // Address Management
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'address',
          title: 'Address',
          fields: [
            defineField({
              name: 'id',
              title: 'Address ID',
              type: 'string',
              description: 'Unique identifier for this address',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'nickname',
              title: 'Address Nickname',
              type: 'string',
              description: 'User-defined name (e.g., "Home", "Office")',
              validation: (rule) => rule.required().max(50),
            }),
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
              isDefault: 'isDefault',
            },
            prepare({ nickname, streetAddress, city, province, isDefault }) {
              return {
                title: nickname + (isDefault ? ' (Default)' : ''),
                subtitle: `${streetAddress}, ${city}, ${province}`,
              }
            },
          },
        },
      ],
      description: 'Multiple saved addresses with custom naming',
    }),

    // Account Metadata
    defineField({
      name: 'isActive',
      title: 'Account Active',
      type: 'boolean',
      description: 'Whether the account is active',
      initialValue: true,
    }),

    // Privacy and Preferences
    defineField({
      name: 'orderEmails',
      title: 'Order Emails',
      type: 'boolean',
      description: 'User consent for order-related emails',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      isActive: 'isActive',
    },
    prepare({ firstName, lastName, email, isActive }) {
      const fullName = `${firstName || ''} ${lastName || ''}`.trim()
      return {
        title: fullName || 'Unnamed User',
        subtitle: `${email}${!isActive ? ' (Inactive)' : ''}`,
        media: undefined,
      }
    },
  },
})