import PaginationPageLink from "./PaginationPageLink";
import PaginationArrowLink from "./PaginationArrowLink";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/mens/tops"
  searchParams?: { [key: string]: string }; // Current search parameters to preserve
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add existing search params (like colors)
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== 'page') { // Don't include current page param
          params.set(key, value);
        }
      });
    }

    // Add page param (except for page 1)
    if (page > 1) {
      params.set('page', page.toString());
    }

    // Build URL
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show: 1 ... 4 5 6 ... 10 (current page in middle)
      if (currentPage <= 4) {
        // Near beginning: 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... 7 8 9 10
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In middle: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      {/* Previous Arrow */}
      <PaginationArrowLink
        href={currentPage > 1 ? getPageUrl(currentPage - 1) : undefined}
        direction="previous"
        disabled={currentPage <= 1}
      />

      <div className="flex items-center justify-center space-x-2">
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <PaginationPageLink
              key={pageNumber}
              pageNumber={pageNumber}
              isCurrentPage={isCurrentPage}
              href={getPageUrl(pageNumber)}
            />
          );
        })}
      </div>

      {/* Next Arrow */}
      <PaginationArrowLink
        href={
          currentPage < totalPages ? getPageUrl(currentPage + 1) : undefined
        }
        direction="next"
        disabled={currentPage >= totalPages}
      />
    </div>
  );
}
