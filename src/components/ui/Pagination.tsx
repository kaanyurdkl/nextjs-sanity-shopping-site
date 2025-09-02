import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/mens/tops"
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page or less
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath; // No query param for page 1
    }
    return `${basePath}?page=${page}`;
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
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In middle: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Arrow */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Previous page"
        >
          &lt;
        </Link>
      ) : (
        <span className="flex items-center justify-center w-8 h-8 text-gray-300 cursor-not-allowed">
          &lt;
        </span>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isCurrentPage = pageNumber === currentPage;

        return (
          <Link
            key={pageNumber}
            href={getPageUrl(pageNumber)}
            className={`flex items-center justify-center w-8 h-8 text-sm transition-colors ${
              isCurrentPage
                ? "bg-black text-white font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* Next Arrow */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Next page"
        >
          &gt;
        </Link>
      ) : (
        <span className="flex items-center justify-center w-8 h-8 text-gray-300 cursor-not-allowed">
          &gt;
        </span>
      )}
    </div>
  );
}