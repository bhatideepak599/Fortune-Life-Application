import React from "react";
import { Row, Col, Dropdown, Form, Button } from "react-bootstrap";

const SearchComponent = ({ searchType, searchParams, handleSearchTypeChange, handleSearchChange, handleSearch, handleReset }) => {
  return (
    <div className="d-flex justify-content-end mb-3 mt-5">
      <Row className="my-4 mx-5  align-items-end">
        <Col md={3}>
          <Dropdown>
            <Dropdown.Toggle variant="info" id="searchDropdown" style={{backgroundColor : "#1abc9c"}}>
              {searchType ? searchType.toUpperCase() : "Search By:"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSearchTypeChange("id")}>ID</Dropdown.Item>
              {searchParams.name === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("name")}>Name</Dropdown.Item>}
              {searchParams.userName === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("userName")}>User Name</Dropdown.Item>}

              {searchParams.mobileNumber === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("mobileNumber")}>Mobile Number</Dropdown.Item>}
              {searchParams.email === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("email")}>Email</Dropdown.Item>}
              {searchParams.active === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("active")}>Active</Dropdown.Item>}
              {searchParams.verified === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("verified")}>Verified</Dropdown.Item>}
              {searchParams.agentId === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("agentId")}>Agent Id</Dropdown.Item>}
              {searchParams.status === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("status")}>Status</Dropdown.Item>}
              {searchParams.policyId === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("policyId")}>Policy Id</Dropdown.Item>}
              {searchParams.commissionType === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("commissionType")}>Commission Type</Dropdown.Item>}
              {searchParams.customerName === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("customerName")}>customerName</Dropdown.Item>}
              {searchParams.queryResponse === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("queryResponse")}>Query Response</Dropdown.Item>}
              {searchParams.answer === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("answer")}>Answer</Dropdown.Item>}
              {searchParams.question === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("question")}>Question</Dropdown.Item>}
              {searchParams.title === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("title")}>Title</Dropdown.Item>}
              {searchParams.customerId === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("customerId")}>Customer Id</Dropdown.Item>}
              {searchParams.policyStatus === "" && <Dropdown.Item onClick={() => handleSearchTypeChange("policyStatus")}>Policy Status</Dropdown.Item>}
    
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        {/* title: "",
        question: "",
        answer: "",
        queryResponse: "", */}

        <Col md={3}>
          <Form.Group controlId="searchField">
            <Form.Control className="mx-4 align-items-end" type="text" name={searchType} placeholder="Enter Value" value={searchParams[searchType] || ""} onChange={handleSearchChange} aria-label="Search" />
          </Form.Group>
        </Col>

        <Col className="mx-5 d-flex align-items-end">
          <Button variant="success" onClick={handleSearch} className="me-2" style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
            Search
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchComponent;
