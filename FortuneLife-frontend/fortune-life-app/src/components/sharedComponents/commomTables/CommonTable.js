import React from "react";

import "../commomTables/commonTables.css";
const CommonTable = ({ data, actions, viewPayments }) => {
  if (!data || !data.length) return <div>No data available</div>;

  const headers = Object.keys(data[0]);
  const primaryKey = headers[0];
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{formatHeader(header)}</th>
            ))}

            {actions && <th>Actions</th>}
            {viewPayments && <th> View</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>
                  {header === "active" || header === "verified" ? (
                    <>
                      {header === "active" &&
                        (row.active ? "Active" : "Inactive")}
                      {header === "verified" &&
                        (row.verified ? "Verified" : "Unverified")}
                    </>
                  ) : typeof row[header] === "object" ? (
                    JSON.stringify(row[header])
                  ) : (
                    row[header]
                  )}
                </td>
              ))}
              {viewPayments && (
                <td style={{ textAlign: "center" }}>
                  <a
                    href="#"
                    className="text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      viewPayments.view(row[primaryKey]);
                    }}
                  >
                    View
                  </a>
                </td>
              )}
              {actions && (
                <td>
                  {row.status === "PENDING" && (
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => actions.approve(row[primaryKey])}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => actions.reject(row[primaryKey])}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {row.active ? (
                    <>
                      {actions.update && (
                        <>
                          {row.verified===false ? (
                            <button
                              className="btn btn-warning me-2"
                              onClick={() => actions.verify(row[primaryKey])}
                            >
                              Verify
                            </button>
                          ) : (
                            <button
                              className="btn btn-success me-2"
                              onClick={() => actions.update(row[primaryKey])}
                            >
                              Update
                            </button>
                          )}
                        </>
                      )}

                      {actions.delete && (
                        <button
                          className="btn btn-danger"
                          onClick={() => actions.delete(row[primaryKey])}
                        >
                          Delete
                        </button>
                      )}
                      {actions.create && (
                        <button
                          className="btn btn-primary"
                          onClick={() => actions.create(row[primaryKey])}
                        >
                          Create
                        </button>
                      )}
                      {actions.view && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => actions.view(row[primaryKey])}
                        >
                          View
                        </button>
                      )}
                    </>
                  ) : (
                    actions.activate && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => actions.activate(row[primaryKey])}
                      >
                        Activate
                      </button>
                    )
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
  return header
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to words
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()); // Capitalize the first letter
};

export default CommonTable;
