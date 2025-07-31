/**
 * Script to add example products to Sanity with image uploads
 *
 * This script demonstrates the new productType field and dynamic sizing system.
 * It also uploads product images to Sanity's asset CDN.
 *
 * Run with: npx tsx scripts/add-products.ts
 *
 * Make sure to install tsx first: npm install -D tsx
 */

import {
  writeClient,
  processProductImages,
  validateImagePaths,
} from "./shared/sanity-utils";
import exampleProducts from "./example-products.json";

// Function to create products with images
async function createExampleProducts() {
  console.log("🚀 Starting to create example products with images...");
  console.log("📁 Image upload may take a few minutes...\n");

  try {
    for (const productData of exampleProducts) {
      console.log(`\n📦 Processing product: ${productData.name}`);

      // Process and upload images
      const productWithImages = await processProductImages(productData);

      // Create the product in Sanity with auto-generated array keys
      const result = await writeClient.create(productWithImages, {
        autoGenerateArrayKeys: true,
      });
      console.log(`✅ Created product: ${result.name} (ID: ${result._id})`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("\n🎉 All example products created successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Visit http://localhost:3000/studio to see your products");
    console.log("2. Images are automatically uploaded and linked");
    console.log("3. Test the dynamic sizing based on productType");
    console.log("4. Review product variants and stock quantities");
  } catch (error) {
    console.error("❌ Error creating products:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    // Validate image paths first
    validateImagePaths(exampleProducts);

    // Create new products
    await createExampleProducts();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { createExampleProducts };
