export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-lg text-gray-600">
          Discover our latest fashion collections
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-100 rounded-lg p-12 text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Collections</h2>
        <p className="text-gray-600 mb-6">
          Explore our curated selection of premium fashion
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/mens"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Shop Men's
          </a>
          <a
            href="/womens"
            className="border border-black text-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition-colors"
          >
            Shop Women's
          </a>
        </div>
      </div>

      {/* Additional homepage content can be added here */}
      <div className="text-center text-gray-500">
        <p>More homepage content coming soon...</p>
      </div>
    </div>
  );
}
