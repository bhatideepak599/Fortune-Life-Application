import React from "react";
import PageSize from "./PageSize";
import "./Pagination.css";

const Pagination = ({ pager,currentPage,totalPage,onChange }) => {
  if (!pager) return null;

  
  const pageNumbers = [];
  if (pager.totalPages > 0) {
    pageNumbers.push(pager.pageNumber); // Current page

    if (pager.pageNumber > 0) {
      pageNumbers.unshift(pager.pageNumber - 1); // Previous page
    }
    if (pager.pageNumber < pager.totalPages - 1) {
      pageNumbers.push(pager.pageNumber + 1); // Next page
    }
  }

  return (
    <>
      <PageSize
        class="size"
        sizer={{ pageSize: pager.pageSize, setPageSize: pager.setPageSize }}
      />
      <div className="pagination-container">
        <ul className="pagination">
          <li
            className={`page-item ${pager.pageNumber === 0 ? "disabled" : ""}`}
            onClick={() =>
              pager.pageNumber > 0 && pager.setPageNumber(pager.pageNumber - 1)
            }
          >
            <button className="page-link">Previous</button>
          </li>
          {pageNumbers.length > 0 && pageNumbers.map((page) => (
            <li
              key={page}
              className={`page-item ${
                page === pager.pageNumber ? "active" : ""
              }`}
              onClick={() => pager.setPageNumber(page)}
            >
              <button className="page-link">{page + 1}</button> {/* +1 to show page numbers starting from 1 */}
            </li>
          ))}
          <li
            className={`page-item ${
              pager.pageNumber === pager.totalPages - 1 ? "disabled" : ""
            }`}
            onClick={() =>
              pager.pageNumber < pager.totalPages - 1 &&
              pager.setPageNumber(pager.pageNumber + 1)
            }
          >
            <button className="page-link">Next</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Pagination;
