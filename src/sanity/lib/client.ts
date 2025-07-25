import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Main Sanity client for fetching data from your Sanity project
 * This client is used throughout the app to query content from Sanity
 * 
 * Configuration:
 * - projectId: Your unique Sanity project identifier
 * - dataset: The dataset name (usually 'production' or 'development')
 * - apiVersion: API version to use for queries
 * - useCdn: Uses Sanity's CDN for faster read performance
 *   Set to false if using ISR, SSG, or tag-based revalidation
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
