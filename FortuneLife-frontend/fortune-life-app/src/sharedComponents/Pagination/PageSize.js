import React from "react";
import './PageSize.css';

const PageSize = ({ sizer }) => {
  return (
    <div className="page-size-container">
      <label className="page-size-label">
        Page Size:&nbsp;
        <select
          className="size"
          value={sizer.pageSize} // Reflects the current page size
          onChange={(e) => sizer.setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </label>
    </div>
  );
};

export default PageSize;
