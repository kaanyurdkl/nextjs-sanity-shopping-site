// TYPES
import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface CategoryLandingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default function CategoryLandingPage({
  category,
}: CategoryLandingPageProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">{category.title}</h1>
        <p className="text-lg text-gray-600">
          Discover our latest {category.title.toLowerCase()} collection
        </p>
      </div>

      {/* Category Showcase */}
      <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Explore {category.title}
        </h2>
        <p className="text-gray-600 mb-6">
          Premium quality and contemporary style for every occasion
        </p>
      </div>

      {/* Child Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
        <div className="text-gray-500 text-center py-8">
          <p>Child categories will be loaded here...</p>
          <p className="text-sm mt-2">Category ID: {category._id}</p>
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="text-gray-500 text-center py-8">
          <p>Featured products will be loaded here...</p>
        </div>
      </div>
    </div>
  );
}
