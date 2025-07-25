/**
 * Live content functionality for real-time updates from Sanity
 * 
 * This enables your app to automatically update when content changes in Sanity Studio
 * without requiring a page refresh. Useful for preview environments and live editing.
 * 
 * Setup required:
 * 1. Import and render <SanityLive /> in your root layout
 * 2. Use sanityFetch() instead of regular client queries for live updates
 * 
 * More info: https://github.com/sanity-io/next-sanity#live-content-api
 */
import { defineLive } from "next-sanity";
import { client } from './client'

/**
 * Live content exports:
 * - sanityFetch: Use this instead of client.fetch() for live-updating queries
 * - SanityLive: React component to render in your layout for live functionality
 */
export const { sanityFetch, SanityLive } = defineLive({ 
  client: client.withConfig({ 
    // Live content is currently only available on the experimental API
    // https://www.sanity.io/docs/api-versioning
    apiVersion: 'vX' 
  }) 
});
