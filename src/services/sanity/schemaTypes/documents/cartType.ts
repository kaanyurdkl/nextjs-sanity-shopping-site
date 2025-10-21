import { defineType, defineField } from "sanity";
import { ShoppingCart } from "lucide-react";

/**
 * Shopping Cart Document Type
 * Stores cart data for both guest users (via sessionId) and logged-in users (via user reference)
 *
 * Guest users: sessionId is set, user is null
 * Logged-in users: user is set, sessionId is optional
 */
export const cartType = defineType({
  name: "cart",
  title: "Shopping Cart",
  type: "document",
  icon: ShoppingCart,
  fields: [
    defineField({
      name: "sessionId",
      title: "Session ID",
      type: "string",
      description: "UUID for tracking guest users (stored in cookie). NULL for logged-in users.",
      validation: (Rule) =>
        Rule.custom((sessionId, context) => {
          const user = (context.document as { user?: unknown })?.user;
          // Either sessionId OR user must be present (not both required, but at least one)
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
    }),
    defineField({
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [{ type: "cartItem" }],
      description: "Products in the cart",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "status",
      title: "Status",
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
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      description: "Guest carts expire after 30 days. Logged-in user carts never expire (NULL).",
    }),
  ],
  preview: {
    select: {
      userName: "user.firstName",
      userLastName: "user.lastName",
      sessionId: "sessionId",
      itemsCount: "items",
      status: "status",
    },
    prepare({ userName, userLastName, sessionId, itemsCount, status }) {
      const isGuest = !userName;
      const itemCount = Array.isArray(itemsCount) ? itemsCount.length : 0;

      return {
        title: isGuest
          ? `Guest Cart (${sessionId?.substring(0, 8)}...)`
          : `${userName} ${userLastName || ""}'s Cart`,
        subtitle: `${itemCount} item${itemCount !== 1 ? "s" : ""} • ${status}`,
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
