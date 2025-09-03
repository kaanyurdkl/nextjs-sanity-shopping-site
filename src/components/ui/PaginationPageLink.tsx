import Link from "next/link";

interface PaginationPageLinkProps {
  pageNumber: number;
  isCurrentPage: boolean;
  href: string;
}

export default function PaginationPageLink({ pageNumber, isCurrentPage, href }: PaginationPageLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center w-8 h-8 text-sm transition-colors ${
        isCurrentPage
          ? "bg-black text-white font-medium"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {pageNumber}
    </Link>
  );
}