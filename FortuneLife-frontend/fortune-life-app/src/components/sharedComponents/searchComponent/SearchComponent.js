import React from "react";
import { Row, Col, Dropdown, Form, Button } from "react-bootstrap";

const SearchComponent = ({
  searchType,
  searchParams,
  handleSearchTypeChange,
  handleSearchChange,
  handleSearch,
  handleReset
}) => {
  return (
    <div className="d-flex justify-content-end mb-3">
      <Row className="my-3 align-items-end">
        <Col md={3}>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="searchDropdown">
              {searchType ? searchType.toUpperCase() : 'Search By:'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSearchTypeChange("id")}>
                Customer ID
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("name")}>
                Name
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("userName")}>
                User Name
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("mobileNumber")}>
                Mobile Number
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("email")}>
                Email
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("active")}>
                Active
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSearchTypeChange("verified")}>
                Verified
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col md={3}>
          <Form.Group controlId="searchField">
            <Form.Label>Search</Form.Label>
            <Form.Control
              className="mx-4 align-items-end"
              type="text"
              name={searchType}
              placeholder="Enter Value"
              value={searchParams[searchType] || ""}
              onChange={handleSearchChange}
              aria-label="Search"
            />
          </Form.Group>
        </Col>

        <Col className="mx-5 d-flex align-items-end">
          <Button variant="success" onClick={handleSearch} className="me-2">
            Search
          </Button>
          <Button variant="warning" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchComponent;
