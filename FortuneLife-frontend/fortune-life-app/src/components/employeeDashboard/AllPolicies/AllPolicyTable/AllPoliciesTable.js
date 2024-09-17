import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllPoliciesTable.module.css";

const AllPoliciesTable = ({ data, actions }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);
  const primaryKey = "policyId";

  
  const headerMapping = {
    policyId: "Policy ID",
    customerId: "Customer ID",
    customerName: "Customer Name",
    agentId: "Agent ID",
    agentName: "Agent Name",
    schemeName: "Scheme Name",
    policyStatus: "Policy Status",
    verificationStatus: "Verification Status",
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered custom-table">
        <thead className="custom-table-header">
          <tr>
            {headers.map((header) => (
              <th key={header}>{headerMapping[header] || formatHeader(header)}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row[primaryKey] || index}>
              {headers.map((header) => (
                <td key={header}>
                  {typeof row[header] === "object" && row[header] !== null
                    ? JSON.stringify(row[header])
                    : row[header]}
                </td>
              ))}
              {actions && (
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => actions.view(row[primaryKey])}>
                    View Documents
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

const formatHeader = (header) => {
  return header
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
};

export default AllPoliciesTable;
