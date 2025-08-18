import { defineField, defineType } from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fieldsets: [
    {
      name: "profile",
      title: "Profile Information",
      description: "User's personal information and contact details",
      options: { collapsible: false }
    },
    {
      name: "addresses",
      title: "Address Management", 
      description: "Saved shipping and billing addresses",
      options: { collapsible: true, collapsed: false }
    },
    {
      name: "settings",
      title: "Account Settings",
      description: "Account status and user preferences",
      options: { collapsible: true, collapsed: false }
    },
    {
      name: "auth",
      title: "Authentication Data",
      description: "OAuth integration and technical identifiers",
      options: { collapsible: true, collapsed: true }
    }
  ],
  fields: [
    // === PROFILE INFORMATION ===
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Primary email from Google OAuth account',
      validation: (rule) => rule.required().email(),
      fieldset: 'profile',
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      description: 'User\'s first name (editable in account settings)',
      validation: (rule) => rule.required().min(1).max(50),
      fieldset: 'profile',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      description: 'User\'s last name (editable in account settings)',
      validation: (rule) => rule.required().min(1).max(50),
      fieldset: 'profile',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Optional Canadian phone number for order notifications',
      validation: (rule) => 
        rule.custom((phone) => {
          if (!phone) return true // Optional field
          const canadianPhoneRegex = /^(\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
          return canadianPhoneRegex.test(phone) || 'Please enter a valid Canadian phone number'
        }),
      fieldset: 'profile',
    }),

    // === ADDRESS MANAGEMENT ===
    defineField({
      name: 'addresses',
      title: 'Saved Addresses',
      type: 'array',
      of: [{ type: 'address' }],
      description: 'User\'s saved shipping and billing addresses with custom nicknames',
      fieldset: 'addresses',
    }),

    // === ACCOUNT SETTINGS ===
    defineField({
      name: 'isActive',
      title: 'Account Status',
      type: 'boolean',
      description: 'Enable or disable user account access',
      initialValue: true,
      fieldset: 'settings',
    }),
    defineField({
      name: 'orderEmails',
      title: 'Order Email Notifications',
      type: 'boolean',
      description: 'User consent for receiving order confirmations and shipping updates',
      initialValue: true,
      fieldset: 'settings',
    }),

    // === AUTHENTICATION DATA ===
    defineField({
      name: 'googleId',
      title: 'Google OAuth ID',
      type: 'string',
      description: 'Unique identifier from Google OAuth integration (system field)',
      validation: (rule) => rule.required(),
      fieldset: 'auth',
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      isActive: 'isActive',
      addresses: 'addresses',
    },
    prepare({ firstName, lastName, email, isActive, addresses }) {
      const fullName = `${firstName || ''} ${lastName || ''}`.trim()
      const statusIcon = isActive ? '✅' : '🚫'
      const addressInfo = addresses ? ` • ${addresses.length} address${addresses.length === 1 ? '' : 'es'}` : ' • No addresses'
      
      return {
        title: `${fullName || 'Unnamed User'} ${statusIcon}`,
        subtitle: `${email}${addressInfo}`,
        media: undefined,
      }
    },
  },
})