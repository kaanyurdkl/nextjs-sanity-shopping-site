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
      of: [{ type: 'address' }],
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