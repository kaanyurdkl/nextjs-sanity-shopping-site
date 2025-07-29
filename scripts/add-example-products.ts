/**
 * Script to add example products to Sanity
 *
 * This script demonstrates the new productType field and dynamic sizing system.
 * Run with: npx tsx scripts/add-example-products.ts
 *
 * Make sure to install tsx first: npm install -D tsx
 */

import { client } from "../src/sanity/lib/client";
import exampleProducts from "./example-products.json";

// Extend existing client for write operations
const writeClient = client.withConfig({
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to .env.local
});

// Function to create products
async function createExampleProducts() {
  console.log("🚀 Starting to create example products...");

  try {
    for (const product of exampleProducts) {
      console.log(`📦 Creating product: ${product.name}`);

      const result = await writeClient.create(product);
      console.log(`✅ Created product: ${result.name} (ID: ${result._id})`);
    }

    console.log("🎉 All example products created successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Visit http://localhost:3000/studio to see your products");
    console.log("2. Add product images by editing each product");
    console.log("3. Test the dynamic sizing based on productType");
  } catch (error) {
    console.error("❌ Error creating products:", error);
  }
}

// Function to clean up (delete all products) - use with caution!
async function deleteAllProducts() {
  console.log("🗑️  WARNING: This will delete ALL products!");

  try {
    const products = await writeClient.fetch('*[_type == "product"]');
    console.log(`Found ${products.length} products to delete`);

    for (const product of products) {
      await writeClient.delete(product._id);
      console.log(`🗑️  Deleted: ${product.name}`);
    }

    console.log("🧹 All products deleted!");
  } catch (error) {
    console.error("❌ Error deleting products:", error);
  }
}

// Main execution
if (require.main === module) {
  // Check if SANITY_API_TOKEN is set
  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ Missing SANITY_API_TOKEN environment variable");
    console.log("💡 Add this to your .env.local file:");
    console.log("SANITY_API_TOKEN=your_token_here");
    console.log("\n🔑 Get your token from: https://sanity.io/manage");
    process.exit(1);
  }

  // Uncomment the function you want to run:
  createExampleProducts();

  // To delete all products (use with caution):
  // deleteAllProducts()
}

export { createExampleProducts, deleteAllProducts };
