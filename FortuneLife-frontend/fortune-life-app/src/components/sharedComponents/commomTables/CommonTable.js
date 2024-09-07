import React from 'react';

import  "../commomTables/commonTables.css"
const CommonTable = ({ data, actions }) => {
    if (!data || !data.length) return <div>No data available</div>;

    const headers = Object.keys(data[0]);
    const primaryKey = headers[0];
  return (
    <div className="table-container" >
      <table className="styled-table"
      >
        <thead>
          <tr>
          {headers.map((header) => (
            <th  key={header}>{formatHeader(header)}</th>
          ))}
          {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody style={{
                    background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
                  }}>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td style={{
                background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
              }} key={header}>
                {header === "active"
                  ? row[header]
                    ? "Active"
                    : "Inactive"
                  : typeof row[header] === "object"
                  ? JSON.stringify(row[header])
                  : row[header]}
              </td>
            ))}
            {actions && (
              <td>
                {row.active ? (
                  <>
                    {actions.update && (
                      <button
                        className="btn btn-primary"
                        onClick={() => actions.update(row)}
                      >
                        Update
                      </button>
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
                      className="btn btn-success"
                      onClick={() => actions.activate(row)}
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