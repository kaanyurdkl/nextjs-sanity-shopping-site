/**
 * Sanity API version - determines which version of the Sanity API to use
 * Defaults to current date if not specified in environment variables
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-25'

/**
 * Sanity dataset name - typically 'production' or 'development'
 * This determines which dataset your content is stored in
 */
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

/**
 * Your unique Sanity project ID
 * This identifies your specific Sanity project
 */
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

/**
 * Utility function to ensure required environment variables are present
 * Throws an error if a required value is undefined
 * @param v - The value to check
 * @param errorMessage - Error message to throw if value is undefined
 * @returns The value if it exists
 */
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
