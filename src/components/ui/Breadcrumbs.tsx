import { buildBreadcrumbs } from "@/lib/breadcrumbs";
import BreadcrumbItem from "./BreadcrumbItem";

interface BreadcrumbsProps {
  slug: string[];
}

export default function Breadcrumbs({ slug }: BreadcrumbsProps) {
  const breadcrumbItems = buildBreadcrumbs(slug);

  return (
    <nav aria-label="Breadcrumb" className="my-12">
      <ul className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem
            key={item.href}
            item={item}
            showSeparator={index > 0}
          />
        ))}
      </ul>
    </nav>
  );
}
