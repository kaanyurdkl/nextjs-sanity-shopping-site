import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationArrowLinkProps {
  href?: string;
  direction: "previous" | "next";
  disabled: boolean;
}

export default function PaginationArrowLink({
  href,
  direction,
  disabled,
}: PaginationArrowLinkProps) {
  const arrow =
    direction === "previous" ? (
      <ChevronLeft size={24} />
    ) : (
      <ChevronRight size={24} />
    );
  const ariaLabel = direction === "previous" ? "Previous page" : "Next page";

  if (disabled) {
    return <span className="text-gray-300 cursor-not-allowed">{arrow}</span>;
  }

  return (
    <Link
      href={href!}
      className="text-gray-600 hover:text-gray-900 transition-colors"
      aria-label={ariaLabel}
    >
      {arrow}
    </Link>
  );
}
