import Link from "next/link";

interface CategorySidebarItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

export default function CategorySidebarItem({
  label,
  href,
  isActive,
}: CategorySidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`block uppercase text-sm transition-colors ${isActive ? "font-bold underline" : "hover:underline"}`}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );
}
