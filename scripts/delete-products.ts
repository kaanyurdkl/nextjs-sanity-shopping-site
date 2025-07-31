/**
 * Script to delete all products from Sanity
 *
 * This script removes all products from the Sanity dataset.
 * Use with caution as this operation cannot be undone!
 *
 * Run with: npx tsx scripts/delete-products.ts
 *
 * Make sure to install tsx first: npm install -D tsx
 */

import { writeClient } from "./shared/sanity-utils";

// Function to delete all products from Sanity - use with caution!
async function deleteAllProducts() {
  console.log("🗑️  WARNING: This will delete ALL products!");
  console.log("⏳ Fetching products...");

  let products;
  try {
    products = await writeClient.fetch('*[_type == "product"]');
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw new Error("Failed to fetch products for deletion");
  }

  console.log(`Found ${products.length} products to delete`);

  if (products.length === 0) {
    console.log("✅ No products found to delete");
    return;
  }

  let deletedCount = 0;
  for (const product of products) {
    try {
      await writeClient.delete(product._id);
      console.log(`🗑️  Deleted: ${product.name || product._id}`);
      deletedCount++;
    } catch (error) {
      console.error(
        `❌ Error deleting product ${product.name || product._id}:`,
        error
      );
      throw new Error(
        `Failed to delete product ${product.name || product._id}`
      );
    }
  }

  console.log(`🧹 Successfully deleted ${deletedCount} products!`);
  console.log("\n💡 Note: Product images remain in Sanity assets.");
  console.log(
    "   Use Sanity Studio to manually clean unused assets if needed."
  );
}

// Main execution
async function main() {
  try {
    // Confirm deletion with user
    console.log(
      "⚠️  This will permanently delete ALL products from your Sanity dataset!"
    );
    console.log("📝 Make sure you have backups if needed.");
    console.log("\n⏳ Starting deletion in 3 seconds...");

    // Give user a moment to cancel with Ctrl+C
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Delete all products
    await deleteAllProducts();
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { deleteAllProducts };
