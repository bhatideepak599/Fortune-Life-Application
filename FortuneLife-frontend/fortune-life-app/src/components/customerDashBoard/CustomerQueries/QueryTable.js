import React from "react";
import "./QueryModal.module.css";

const QueryTable = ({ data, onViewResponse }) => {
  if (!data || data.length === 0) {
    return <div>No queries found.</div>;
  }

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Query ID</th>
          <th>Title</th>
          <th>Query Response</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((query) => (
          <tr key={query.id}>
            <td>{query.id}</td>
            <td>{query.title}</td>
            <td>{query.queryResponse || "N/A"}</td>
            <td>
              <button className="btn btn-primary btn-sm" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={() => onViewResponse(query.id)}>
                View Response
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QueryTable;
