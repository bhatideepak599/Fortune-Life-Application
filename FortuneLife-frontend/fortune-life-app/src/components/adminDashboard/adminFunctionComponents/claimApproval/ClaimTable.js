import React from "react";

const ClaimTable = ({ data, actions }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);

  return (
    <div className="table-responsive">
      <table className="table custom-table">
        <thead className="custom-table-header">
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
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
                  <button className="btn btn-sm" onClick={() => actions.view(row)} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                    View Remarks
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimTable;
