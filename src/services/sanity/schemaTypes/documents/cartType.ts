import { defineType, defineField } from "sanity";
import { ShoppingCart } from "lucide-react";

/**
 * Shopping Cart Document Type
 * Stores cart data for both guest users (via sessionId) and logged-in users (via user reference)
 * Checkout information is organized in a nested object for better Studio organization
 *
 * Guest users: sessionId is set, user is null
 * Logged-in users: user is set, sessionId is optional
 */
export const cartType = defineType({
  name: "cart",
  title: "Shopping Cart",
  type: "document",
  icon: ShoppingCart,
  fieldsets: [
    {
      name: "identification",
      title: "Cart Identification",
      description: "User/session identification and cart status",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "items",
      title: "Cart Items",
      description: "Products in the shopping cart",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "checkout",
      title: "Checkout Information",
      description: "Checkout progress and customer information",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "sessionId",
      title: "Session ID",
      type: "string",
      description: "UUID for tracking guest users (stored in cookie). NULL for logged-in users.",
      fieldset: "identification",
      validation: (Rule) =>
        Rule.custom((sessionId, context) => {
          const user = (context.document as { user?: unknown })?.user;
          if (!sessionId && !user) {
            return "Either Session ID (for guests) or User (for logged-in) must be set";
          }
          return true;
        }),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "Reference to logged-in user. NULL for guest users.",
      fieldset: "identification",
    }),
    defineField({
      name: "status",
      title: "Cart Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Abandoned", value: "abandoned" },
          { title: "Converted", value: "converted" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
      description: "Cart lifecycle status",
      fieldset: "identification",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      description: "Guest carts expire after 30 days. Logged-in user carts never expire (NULL).",
      fieldset: "identification",
    }),
    defineField({
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [{ type: "cartItem" }],
      description: "Products in the cart",
      validation: (Rule) => Rule.unique(),
      fieldset: "items",
    }),
    defineField({
      name: "checkout",
      title: "Checkout Data",
      type: "object",
      description: "All checkout-related information organized by step",
      fieldset: "checkout",
      fields: [
        defineField({
          name: "currentStep",
          title: "Current Step",
          type: "string",
          description: "The current active step in the checkout process",
          options: {
            list: [
              { title: "Contact", value: "contact" },
              { title: "Shipping", value: "shipping" },
              { title: "Payment", value: "payment" },
            ],
            layout: "radio",
          },
          initialValue: "contact",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "contact",
          title: "Contact Step",
          type: "object",
          description: "Contact information step",
          fields: [
            defineField({
              name: "email",
              title: "Email",
              type: "string",
              validation: (Rule) => Rule.email(),
            }),
          ],
        }),
        defineField({
          name: "shipping",
          title: "Shipping Step",
          type: "object",
          description: "Shipping information step",
          fields: [
            defineField({
              name: "shippingAddress",
              title: "Shipping Address",
              type: "address",
              description: "Delivery address",
            }),
            defineField({
              name: "billingAddress",
              title: "Billing Address",
              type: "address",
              description: "Billing address (if different from shipping)",
            }),
            defineField({
              name: "useSameAddressForBilling",
              title: "Same Address for Billing",
              type: "boolean",
              initialValue: true,
              description: "Whether billing address is same as shipping",
            }),
            defineField({
              name: "shippingMethod",
              title: "Shipping Method",
              type: "string",
              options: {
                list: [
                  { title: "Standard (5-7 days) - $9.99", value: "standard" },
                  { title: "Express (2-3 days) - $19.99", value: "express" },
                ],
                layout: "radio",
              },
              description: "Selected shipping method",
            }),
          ],
        }),
        defineField({
          name: "payment",
          title: "Payment Step",
          type: "object",
          description: "Payment information step (placeholder for future implementation)",
          fields: [
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "boolean",
              description: "Placeholder field - payment fields to be added later",
              hidden: true,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      userName: "user.firstName",
      userLastName: "user.lastName",
      sessionId: "sessionId",
      itemsCount: "items",
      status: "status",
      currentStep: "checkout.currentStep",
    },
    prepare({ userName, userLastName, sessionId, itemsCount, status, currentStep }) {
      const isGuest = !userName;
      const itemCount = Array.isArray(itemsCount) ? itemsCount.length : 0;

      const stepInfo = currentStep ? ` • Checkout: ${currentStep}` : "";

      return {
        title: isGuest
          ? `Guest Cart (${sessionId?.substring(0, 8)}...)`
          : `${userName} ${userLastName || ""}'s Cart`,
        subtitle: `${itemCount} item${itemCount !== 1 ? "s" : ""} • ${status}${stepInfo}`,
        media: ShoppingCart,
      };
    },
  },
  orderings: [
    {
      title: "Most Recent",
      name: "mostRecent",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "status",
      by: [
        { field: "status", direction: "asc" },
        { field: "_updatedAt", direction: "desc" },
      ],
    },
  ],
});
