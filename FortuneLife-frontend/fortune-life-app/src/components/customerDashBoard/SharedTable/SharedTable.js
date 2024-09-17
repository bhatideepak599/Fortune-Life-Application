import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SharedTable.module.css";

const SharedTable = ({ data, actions }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);
  const primaryKey = headers[0];

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered custom-table">
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
                <td key={header}>{header === "verified" ? (row[header] ? "Verified" : "Unverified") : header === "active" ? (row[header] ? "Active" : "Inactive") : header === "claimId" && row[header] === null ? "N/A" : typeof row[header] === "object" ? JSON.stringify(row[header]) : row[header]}</td>
              ))}
              {actions && (
                <td>
                  {actions.payment && (
                    <button
                      className="btn custom-btn btn-sm my-1"
                      onClick={() => actions.payment(row[primaryKey])}
                      style={{
                        backgroundColor: "hsl(245, 67%, 59%)",
                        color: "white",
                      }}
                    >
                      Payment
                    </button>
                  )}

                  {actions.claim && (
                    <button className="btn btn-secondary btn-sm custom-claim-btn my-1" onClick={() => actions.claim(row[primaryKey])} disabled={!(row.policyStatus === "ACTIVE" || row.policyStatus === "COMPLETE") || (row.claimId && row.claimStatus !== "REJECT") || (!row.verified)}>
                      Claim
                    </button>
                  )}

                  {actions.view && (
                    <button className="btn btn-secondary btn-sm custom-claim-btn my-1" onClick={() => actions.view(row[primaryKey])}>
                      View Documents
                    </button>
                  )}
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
  if (header === "verified") return "Verification Status";
  if (header === "totalAmountPaidTillDate") return "Amount Paid";
  return header
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to words
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()); // Capitalize the first letter
};

export default SharedTable;
