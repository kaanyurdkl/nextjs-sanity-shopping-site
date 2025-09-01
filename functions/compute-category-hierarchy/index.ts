import { createClient } from "@sanity/client";

export async function handler({ event }: any) {
  console.log("Function triggered with event:", JSON.stringify(event, null, 2));

  // Extract document ID - it comes as event.data (string), not event.data._id
  const documentId = event.data;

  if (!documentId || typeof documentId !== "string") {
    console.error("No document ID found in event.data:", event);
    return;
  }

  // Create Sanity client
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: "2024-01-01",
    useCdn: false,
  });

  try {
    console.log("Processing product ID:", documentId);

    // First, get the full product to access the category reference
    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0] { category }`,
      { id: documentId }
    );

    if (!product?.category?._ref) {
      console.log("No category reference found for product:", documentId);
      return;
    }

    // Build category hierarchy from the selected category
    const hierarchy = await buildCategoryHierarchy(
      client,
      product.category._ref
    );

    console.log("Computing hierarchy for product:", documentId);
    console.log("Category hierarchy:", hierarchy);

    // Update the product with the computed hierarchy
    await client
      .patch(documentId)
      .set({ categoryHierarchy: hierarchy })
      .commit();

    console.log(
      "Successfully updated category hierarchy for product:",
      documentId
    );
  } catch (error) {
    console.error("Error computing category hierarchy:", error);
    throw error;
  }
}

async function buildCategoryHierarchy(
  client: any,
  categoryId: string
): Promise<string[]> {
  const hierarchy: string[] = [];
  let currentId = categoryId;
  const visitedIds = new Set<string>(); // Prevent infinite loops

  // Traverse up the category tree to collect all parent category IDs
  while (currentId && !visitedIds.has(currentId)) {
    visitedIds.add(currentId);
    
    // Add current category ID to hierarchy
    hierarchy.push(currentId);
    
    // Get parent category
    const category = await client.fetch(
      `*[_type == "category" && _id == $id][0] { parent }`,
      { id: currentId }
    );

    if (!category) {
      console.warn("Category not found:", currentId);
      break;
    }

    // Move to parent category
    currentId = category.parent?._ref;
  }

  // Return as-is (leaf to root order) - this means product appears in all these categories
  return hierarchy;
}
