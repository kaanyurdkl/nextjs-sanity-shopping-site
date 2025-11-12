import { type QueryParams } from "next-sanity";
import { readClient, noCacheReadClient } from "./client";

/**
 * Enhanced Sanity fetch function following Next.js 15 and Sanity best practices
 *
 * Features:
 * - Next.js 15 compatible explicit caching
 * - Tag-based revalidation support for fine-grained cache control
 * - Time-based revalidation support
 * - TypeScript generics for type safety
 * - Follows both Sanity and Next.js documentation recommendations
 *
 * @param query - GROQ query string
 * @param params - Query parameters
 * @param revalidate - Time-based revalidation in seconds (default: 3600 = 1 hour)
 * @param tags - Tags for cache invalidation (use revalidateTag to invalidate)
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 3600,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<QueryResponse> {
  return readClient.fetch<QueryResponse>(query, params, {
    // Next.js 15 requires explicit cache setting (defaults to 'no-store')
    cache: "force-cache",
    next: {
      // Use tags OR time-based revalidation (tags take priority)
      revalidate: tags.length ? false : revalidate,
      tags, // For tag-based cache invalidation using revalidateTag()
    },
  });
}

/**
 * Sanity fetch with no caching - for dynamic data that should always be fresh
 * Use this for user-specific data or frequently changing content
 *
 * IMPORTANT: Uses noCacheReadClient (useCdn: false) to bypass Sanity CDN
 * This ensures immediate consistency after mutations, avoiding CDN propagation delay
 */
export async function sanityFetchNoCache<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  return noCacheReadClient.fetch<QueryResponse>(query, params, {
    next: {
      tags,
    },
  });
}
