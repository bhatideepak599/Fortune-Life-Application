import React from "react";

const ClaimTable = ({ data, actions }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);
  const primaryKey = headers[0];
  return (
    <div className="table-responsive">
      <table className="table custom-table">
        <thead className="custom-table-header">
          <tr>
            {headers.map((header) => (
              <th key={header}>{formatHeader(header)}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={`${index}-${header}`}>{row[header]}</td>
              ))}
              {actions && (
                <td>
                  <button className="btn btn-sm me-1" onClick={() => actions.approve(row)} style={{ backgroundColor: "#1abc9c", color: "white" }}>
                    Approve
                  </button>
                  <button className="btn btn-sm me-1" onClick={() => actions.reject(row)} style={{ backgroundColor: "#FF597B", color: "white" }}>
                    Reject
                  </button>
                 {row.remarks!=="N/A" && <button className="btn btn-sm mt-1" onClick={() => actions.view(row)} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                    Remarks
                  </button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatHeader = (header) => {
  return header
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to words
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()); // Capitalize the first letter
};
export default ClaimTable;
