import Link from "next/link";

interface PaginationArrowLinkProps {
  href?: string;
  direction: "previous" | "next";
  disabled: boolean;
}

export default function PaginationArrowLink({ href, direction, disabled }: PaginationArrowLinkProps) {
  const arrow = direction === "previous" ? "<" : ">";
  const ariaLabel = direction === "previous" ? "Previous page" : "Next page";
  
  if (disabled) {
    return (
      <span className="flex items-center justify-center w-8 h-8 text-gray-300 cursor-not-allowed">
        {arrow}
      </span>
    );
  }

  return (
    <Link
      href={href!}
      className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors"
      aria-label={ariaLabel}
    >
      {arrow}
    </Link>
  );
}