import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../config/env'

/**
 * Image URL builder instance configured with your Sanity project
 * This is used to generate optimized image URLs from Sanity image assets
 * https://www.sanity.io/docs/image-url
 */
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Utility function to generate optimized image URLs from Sanity image assets
 * 
 * Usage examples:
 * - urlFor(image).width(300).height(200).url() - Resize image
 * - urlFor(image).crop('center').url() - Crop image from center
 * - urlFor(image).format('webp').url() - Convert to WebP format
 * 
 * @param source - Sanity image asset or reference
 * @returns Image URL builder with chaining methods for optimization
 */
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}
