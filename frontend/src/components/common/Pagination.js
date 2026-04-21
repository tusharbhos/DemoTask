import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, total, limit }) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end   = Math.min(currentPage * limit, total);

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let from = Math.max(2, currentPage - 1);
      let to   = Math.min(totalPages - 1, currentPage + 1);
      if (from > 2) pages.push('...');
      for (let i = from; i <= to; i++) pages.push(i);
      if (to < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
      <div style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
        Showing <strong>{start}</strong> to <strong>{end}</strong> of <strong>{total}</strong> entries
      </div>

      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              ‹ Prev
            </button>
          </li>

          {getPages().map((page, idx) =>
            page === '...' ? (
              <li key={`ellipsis-${idx}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(page)}>
                  {page}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Next ›
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
