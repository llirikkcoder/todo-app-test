import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = currentPage > 3;
  const showEndEllipsis = currentPage < totalPages - 2;
  const showFirstPage = currentPage > 3;
  const showLastPage = currentPage < totalPages - 2;
  const showStartDots = currentPage > 4;
  const showEndDots = currentPage < totalPages - 3;

  const getPageButtonClassName = (page: number) => {
    return currentPage === page ? 'pagination-btn active' : 'pagination-btn';
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      {showStartEllipsis && (
        <>
          {showFirstPage && (
            <button className="pagination-btn" onClick={() => onPageChange(1)}>
              1
            </button>
          )}
          {showStartDots && <span className="pagination-dots">...</span>}
        </>
      )}

      {pageNumbers.map(page => (
        <button
          key={page}
          className={getPageButtonClassName(page)}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showEndEllipsis && (
        <>
          {showEndDots && <span className="pagination-dots">...</span>}
          {showLastPage && (
            <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          )}
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;