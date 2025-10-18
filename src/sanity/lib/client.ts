import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../config/env";

/**
 * Read-only Sanity client for fetching data from your Sanity project
 * This client is used throughout the app to query content from Sanity
 *
 * Configuration:
 * - projectId: Your unique Sanity project identifier
 * - dataset: The dataset name (usually 'production' or 'development')
 * - apiVersion: API version to use for queries
 * - useCdn: Uses Sanity's CDN for faster read performance
 *   Set to false if using ISR, SSG, or tag-based revalidation
 */
export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

/**
 * Fresh read client for user-specific data
 * Bypasses CDN to get immediate updates after mutations
 * Use this for data that changes frequently and needs instant consistency
 * (e.g., user profiles, cart data, order status)
 */
export const freshReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Bypass CDN for immediate fresh data
});

/**
 * Write-enabled Sanity client for server-side operations
 * This client is used for creating, updating, and deleting documents
 *
 * Configuration:
 * - useCdn: Set to false for write operations to ensure data consistency
 * - token: API token with write permissions for authenticated operations
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for write operations
  token: process.env.SANITY_API_TOKEN, // Editor token from .env.local
});
