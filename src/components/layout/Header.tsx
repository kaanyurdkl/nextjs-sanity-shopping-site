import Link from "next/link";
import { Search, User, ShoppingCart, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { getNavbarCategories } from "@/services/sanity/lib/utils";
import { MegaMenu } from "./MegaMenu";

export default async function Header() {
  const session = await auth();

  const categories = await getNavbarCategories();

  return (
    <header className="relative h-16 bg-white border-b border-gray-100 flex items-center">
      <nav
        className="px-6 grow flex items-center justify-between self-stretch"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-medium text-black"
          aria-label="Home - Logo"
        >
          Logo
        </Link>

        <div className="flex self-stretch space-x-8">
          <ul className="flex items-center h-full text-sm font-medium">
            {/* Navigation Links - Dynamic Categories with Mega Menu */}
            <MegaMenu categories={categories} />

            {/* Static Navigation Items */}
            <li className="hover:[&>a]:underline h-full flex items-center">
              <Link
                className="px-4 transition-colors uppercase"
                href="/new-arrivals"
              >
                NEW ARRIVALS
              </Link>
            </li>
            <li className="hover:[&>a]:underline h-full flex items-center">
              <Link className="px-4 transition-colors uppercase" href="/deals">
                DEALS
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4" aria-label="User actions">
          <button
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            aria-label="Search products"
            type="button"
          >
            <Search size={20} className="text-black" aria-hidden="true" />
          </button>
          {session ? (
            <>
              <Link
                href="/account"
                className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="User account"
              >
                <User size={20} className="text-black" aria-hidden="true" />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  className="p-2 hover:bg-gray-50 rounded-md transition-colors"
                  aria-label="Sign out"
                  type="submit"
                >
                  <LogOut size={20} className="text-black" aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/account"
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
            <ShoppingCart size={20} className="text-black" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
