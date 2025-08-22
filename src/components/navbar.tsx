"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <header>
      <nav
        className="bg-white border-b border-gray-100 px-6 py-4"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-medium text-black"
            aria-label="Home - Logo"
          >
            Logo
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center text-sm font-medium space-x-8">
            <li>
              <Link
                href="/womens"
                className="hover:text-red-600 transition-colors"
              >
                WOMEN
              </Link>
            </li>
            <li>
              <Link
                href="/mens"
                className="hover:text-gray-600 transition-colors"
              >
                MEN
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="hover:text-gray-600 transition-colors"
              >
                NEW ARRIVALS
              </Link>
            </li>
            <li>
              <Link
                href="/deals"
                className="hover:text-gray-600 transition-colors"
              >
                DEALS
              </Link>
            </li>
          </ul>

          {/* Right Icons */}
          <div
            className="flex items-center space-x-4"
            aria-label="User actions"
          >
            <button
              className="p-2 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="Search products"
              type="button"
            >
              <Search size={20} className="text-black" aria-hidden="true" />
            </button>
            {status === "loading" ? (
              <div className="p-2">
                <User size={20} className="text-gray-400" aria-hidden="true" />
              </div>
            ) : session ? (
              <>
                <Link
                  href="/account"
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  aria-label="User account"
                >
                  <User size={20} className="text-black" aria-hidden="true" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  aria-label="Sign out"
                  type="button"
                >
                  <LogOut size={20} className="text-black" aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link
                href="/api/auth/signin"
                className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="Sign in"
              >
                <User size={20} className="text-black" aria-hidden="true" />
              </Link>
            )}
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart
                size={20}
                className="text-black"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
