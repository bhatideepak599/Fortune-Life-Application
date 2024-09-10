import React from "react";
import Table from "react-bootstrap/Table";

const ViewCities = ({ scheme, onClose }) => {
  return (
    <div>
      <h3>{scheme.schemeName}</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Pincode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {scheme.citiesDto.map((city, index) => (
            <tr key={index}>
              <td>{city.name}</td>
              <td>{city.pincode}</td>

              <td>{city.active ? "Active" : "In Active"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewCities;
