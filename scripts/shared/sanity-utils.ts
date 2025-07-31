/**
 * Shared Sanity utilities for product scripts
 */

// Load Next.js environment variables properly for external scripts
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
import { createClient } from "next-sanity";

// Create Sanity client directly with environment variables
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-07-25",
  useCdn: true,
});

// Extend existing client for write operations
export const writeClient = client.withConfig({
  useCdn: false, // Must be false for mutations
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to .env.local
});

// Function to build full image path from product metadata and filename
function buildImagePath(product: any, filename: string): string {
  return `design/assets/product-images/${product.category}/${product.productType}/${product.subcategory}/${product.productFolder}/${filename}`;
}

// Function to upload image to Sanity
export async function uploadImageToSanity(imagePath: string): Promise<any> {
  try {
    const absolutePath = path.resolve(imagePath);

    console.log(`📸 Uploading image: ${path.basename(imagePath)}`);

    const imageBuffer = fs.readFileSync(absolutePath);
    const uploadResult = await writeClient.assets.upload("image", imageBuffer, {
      filename: path.basename(imagePath),
    });

    console.log(`✅ Uploaded: ${uploadResult.originalFilename}`);
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadResult._id,
      },
      alt: `Product image - ${path.basename(imagePath, path.extname(imagePath))}`,
    };
  } catch (error) {
    console.error(`❌ Error uploading ${imagePath}:`, error);
    throw error;
  }
}

// Function to process product images (assumes validation already done by validateImagePaths)
export async function processProductImages(productData: any) {
  const processedProduct = { ...productData };

  // Build full paths and upload thumbnail
  const thumbnailPath = buildImagePath(productData, productData.images.thumbnail);
  const thumbnailAsset = await uploadImageToSanity(thumbnailPath);
  processedProduct.thumbnail = thumbnailAsset;

  // Build full paths and upload hover image
  const hoverPath = buildImagePath(productData, productData.images.hoverImage);
  const hoverAsset = await uploadImageToSanity(hoverPath);
  processedProduct.hoverImage = hoverAsset;

  // Build full paths and upload gallery images
  const galleryAssets = [];
  for (const filename of productData.images.gallery) {
    const fullPath = buildImagePath(productData, filename);
    const asset = await uploadImageToSanity(fullPath);
    galleryAssets.push(asset);
  }
  processedProduct.images = galleryAssets;

  return processedProduct;
}

// Function to validate image paths
export function validateImagePaths(products: any[]) {
  console.log("🔍 Validating image paths...");
  let missingImages = 0;
  let totalImages = 0;

  for (const product of products) {
    if (product.images) {
      const imageFilenames = [
        product.images.thumbnail,
        product.images.hoverImage,
        ...(product.images.gallery || []),
      ].filter(Boolean);

      for (const filename of imageFilenames) {
        totalImages++;
        const fullPath = buildImagePath(product, filename);
        if (!fs.existsSync(path.resolve(fullPath))) {
          console.error(`❌ Missing: ${fullPath}`);
          missingImages++;
        }
      }
    }
  }

  console.log(
    `📊 Image validation: ${totalImages - missingImages}/${totalImages} images found`
  );

  if (missingImages > 0) {
    throw new Error(
      `${missingImages} images are missing. Please ensure all image files exist before running this script.`
    );
  } else {
    console.log("✅ All image paths are valid!");
  }
}
