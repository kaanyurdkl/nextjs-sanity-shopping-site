import Link from 'next/link';
import { Search, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-medium text-black">
          Logo
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/womens" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
            WOMEN
          </Link>
          <Link href="/mens" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
            MEN
          </Link>
          <Link href="/new-arrivals" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
            NEW ARRIVALS
          </Link>
          <Link href="/deals" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
            DEALS
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-50 rounded-md transition-colors">
            <Search size={20} className="text-black" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-md transition-colors">
            <User size={20} className="text-black" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-md transition-colors">
            <ShoppingCart size={20} className="text-black" />
          </button>
        </div>
      </div>
    </nav>
  );
}