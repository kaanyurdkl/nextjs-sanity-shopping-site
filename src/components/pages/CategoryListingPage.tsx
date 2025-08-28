import type { CATEGORY_BY_SLUG_QUERYResult } from "@/sanity/types/sanity.types";

interface CategoryListingPageProps {
  category: NonNullable<CATEGORY_BY_SLUG_QUERYResult>;
}

export default function CategoryListingPage({ category }: CategoryListingPageProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumbs placeholder */}
      <nav className="mb-6">
        <p className="text-sm text-gray-600">
          Breadcrumbs will be here... / {category.title}
        </p>
      </nav>
      
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="mb-8">
            <h3 className="font-semibold text-black mb-4">Categories</h3>
            <div className="text-gray-500 text-sm">
              <p>VIEW ALL</p>
              <p>Category navigation...</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-semibold text-black mb-4">Filters</h3>
            <div className="text-gray-500 text-sm space-y-2">
              <p>Size filters...</p>
              <p>Color filters...</p>
              <p>Price range...</p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">{category.title}</h1>
            <p className="text-gray-600">Products will be loaded here...</p>
            <p className="text-sm text-gray-400 mt-1">Category ID: {category._id}</p>
          </div>
          
          {/* Sort and View Options */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing X products</p>
            <select className="border border-gray-300 rounded px-3 py-2">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
          
          {/* Product Grid Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Product {item}</p>
              </div>
            ))}
          </div>
          
          {/* Pagination Placeholder */}
          <div className="mt-12 text-center">
            <p className="text-gray-500">Pagination will be here...</p>
          </div>
        </main>
      </div>
    </div>
  );
}