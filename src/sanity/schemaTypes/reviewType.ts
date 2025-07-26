import {StarIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Review schema for customer product reviews
 * 
 * Fields:
 * - product: Product reference this review is for
 * - reviewerName: Customer name (e.g., "JESSICA M.")
 * - rating: Star rating from 1 to 5
 * - comment: Written review content
 * - isVerifiedPurchase: Verified purchase badge flag
 * - isApproved: Admin approval for public display
 * - helpfulCount: Number of helpful votes from customers
 */
export const reviewType = defineType({
  name: 'review',
  title: 'Customer Review',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: Rule => Rule.required(),
      description: 'The product this review is for'
    }),
    defineField({
      name: 'reviewerName',
      title: 'Reviewer Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Customer name (e.g., "JESSICA M.")'
    }),
    defineField({
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5).integer(),
      description: 'Rating from 1 to 5 stars'
    }),
    defineField({
      name: 'comment',
      title: 'Review Comment',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(10).max(1000),
      description: 'Written review content'
    }),
    defineField({
      name: 'isVerifiedPurchase',
      title: 'Verified Purchase',
      type: 'boolean',
      initialValue: false,
      description: 'Show "Verified Purchase" badge on review'
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      initialValue: true,
      description: 'Admin approval for displaying review publicly (auto-approved for portfolio demo)'
    }),
    defineField({
      name: 'helpfulCount',
      title: 'Helpful Votes',
      type: 'number',
      initialValue: 0,
      validation: Rule => Rule.min(0),
      description: 'Number of "helpful" votes from other customers'
    })
  ],
  preview: {
    select: {
      title: 'reviewerName',
      subtitle: 'comment',
      media: 'product.images.0',
      rating: 'rating',
      productName: 'product.name'
    },
    prepare({title, subtitle, media, rating, productName}) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0))
      return {
        title: `${title} - ${stars}`,
        subtitle: `${productName}: ${subtitle?.substring(0, 60)}...`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Review Date (Newest)',
      name: 'createdAtDesc',
      by: [
        {field: '_createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Rating (Highest)',
      name: 'ratingDesc', 
      by: [
        {field: 'rating', direction: 'desc'}
      ]
    }
  ]
})