import Link from "next/link";

interface CategorySidebarItemProps {
  label: string;
  href: string;
  isActive: boolean;
  isViewAll: boolean;
}

export default function CategorySidebarItem({ 
  label, 
  href, 
  isActive, 
  isViewAll 
}: CategorySidebarItemProps) {
  const baseStyles = "block py-2 text-sm transition-colors duration-200";
  
  // Style for all items (both "View All" and category items) - can be active
  const itemStyles = isActive 
    ? `${baseStyles} text-gray-900 font-medium underline`
    : `${baseStyles} text-gray-600 hover:text-gray-900 hover:underline`;
  
  return (
    <li>
      <Link 
        href={href}
        className={itemStyles}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );
}