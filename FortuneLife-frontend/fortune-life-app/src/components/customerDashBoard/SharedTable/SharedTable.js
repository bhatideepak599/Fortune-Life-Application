import React from "react";
import "./SharedTable.css";

const SharedTable = ({ data, actions }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);
  const primaryKey = headers[0];

  return (
    <table className="table">
      <thead>
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
              <td key={header}>{header === "active" ? (row[header] ? "Active" : "Inactive") : typeof row[header] === "object" ? JSON.stringify(row[header]) : row[header]}</td>
            ))}
            {actions && (
              <td>
                {actions.payment && (
                  <button className="btn btn-primary me-1" onClick={() => actions.payment(row[primaryKey])} style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                    Payment
                  </button>
                )}
                {actions.claim && (row.policyStatus === "ACTIVE" || row.policyStatus === "COMPLETE") && !row.claimId && actions.claim && (
                  <button className="btn btn-secondary" onClick={() => actions.claim(row[primaryKey])}>
                    Claim
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatHeader = (header) => {
  return header
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to words
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()); // Capitalize the first letter
};

export default SharedTable;
