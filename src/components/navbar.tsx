import Link from 'next/link';
import { Search, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <header>
      <nav className="bg-white border-b border-gray-100 px-6 py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl font-medium text-black" aria-label="Home - Logo">
          Logo
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          <li>
            <Link href="/womens" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              WOMEN
            </Link>
          </li>
          <li>
            <Link href="/mens" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              MEN
            </Link>
          </li>
          <li>
            <Link href="/new-arrivals" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              NEW ARRIVALS
            </Link>
          </li>
          <li>
            <Link href="/deals" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
              DEALS
            </Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center space-x-4" aria-label="User actions">
          <button 
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            aria-label="Search products"
            type="button"
          >
            <Search size={20} className="text-black" aria-hidden="true" />
          </button>
          <button 
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            aria-label="User account"
            type="button"
          >
            <User size={20} className="text-black" aria-hidden="true" />
          </button>
          <button 
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            aria-label="Shopping cart"
            type="button"
          >
            <ShoppingCart size={20} className="text-black" aria-hidden="true" />
          </button>
        </div>
        </div>
      </nav>
    </header>
  );
}