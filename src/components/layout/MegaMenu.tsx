"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  title: string;
  slug: string;
  pageType: string;
  children?: Category[];
}

interface MegaMenuProps {
  categories: Category[];
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);

  return (
    <>
      {categories.map((category) => (
        <li
          key={category._id}
          className="h-full hover:[&>a]:underline flex items-center"
          onMouseEnter={() => setHoveredCategory(category)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link
            href={`/${category.slug}`}
            className="px-4 transition-colors uppercase"
          >
            {category.title}
          </Link>

          {hoveredCategory?._id === category._id && category.children && (
            <div
              className="absolute border-t border-gray-100 top-full left-0 w-full z-50 bg-white p-6"
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="grid grid-cols-2 gap-8">
                {/* Show first 2 main categories only */}
                {category.children.slice(0, 2).map((child) => (
                  <div key={child._id} className="space-y-3">
                    <Link
                      href={`/${child.slug}`}
                      className="block text-xs text-gray-600  hover:underline font-extrabold uppercase transition-colors"
                    >
                      {child.title}
                    </Link>

                    {/* Show subcategories */}
                    {child.children && (
                      <div className="space-y-2">
                        {child.children.map((grandchild) => (
                          <Link
                            key={grandchild._id}
                            href={`/${grandchild.slug}`}
                            className="block hover:underline transition-colors"
                          >
                            {grandchild.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </li>
      ))}
    </>
  );
}
