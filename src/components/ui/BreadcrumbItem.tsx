import Link from "next/link";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/breadcrumbs";

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  showSeparator: boolean;
}

export default function BreadcrumbItem({ item, showSeparator }: BreadcrumbItemProps) {
  return (
    <li className="flex items-center space-x-2">
      {showSeparator && (
        <span className="text-gray-400" aria-hidden="true">
          /
        </span>
      )}
      {item.isLast ? (
        <span 
          className="font-medium text-gray-900" 
          aria-current="page"
        >
          {item.label}
        </span>
      ) : (
        <Link 
          href={item.href} 
          className="hover:text-gray-900 hover:underline transition-colors duration-200"
        >
          {item.label}
        </Link>
      )}
    </li>
  );
}