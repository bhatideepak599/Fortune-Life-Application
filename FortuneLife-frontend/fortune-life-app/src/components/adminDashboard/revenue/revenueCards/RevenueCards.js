import React from "react";
import { Card } from "react-bootstrap";
import { FaUsers, FaUserTie, FaBriefcase, FaFileAlt, FaBalanceScale } from "react-icons/fa"; // Importing relevant icons

const RevenueCards = ({ report }) => {
  return (
    <div className="row mb-4">
      <h1 className="text-center mt-5">Reports and Revenue</h1>

      <div className="col-md-4 mt-5">
        <Card className="text-center shadow-sm" style={cardStyle}>
          <Card.Body>
            <Card.Title style={titleStyle}>
              <FaUsers style={iconStyle} />Customers
            </Card.Title>
            <Card.Text style={textStyle}>{report.customerCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-5">
        <Card className="text-center shadow-sm" style={cardStyle}>
          <Card.Body>
            <Card.Title style={titleStyle}>
              <FaUserTie style={iconStyle} />Agents
            </Card.Title>
            <Card.Text style={textStyle}>{report.agentCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-5">
        <Card className="text-center shadow-sm" style={cardStyle}>
          <Card.Body>
            <Card.Title style={titleStyle}>
              <FaBriefcase style={iconStyle} />Employees
            </Card.Title>
            <Card.Text style={textStyle}>{report.employeeCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-5">
        <Card className="text-center shadow-sm" style={cardStyle}>
          <Card.Body>
            <Card.Title style={titleStyle}>
              <FaFileAlt style={iconStyle} />Policies
            </Card.Title>
            <Card.Text style={textStyle}>{report.policyCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-5 ">
        <Card className="text-center shadow-sm" style={cardStyle}>
          <Card.Body>
            <Card.Title style={titleStyle}>
              <FaBalanceScale style={iconStyle} />Policy per Customer
            </Card.Title>
            <Card.Text style={textStyle}>{report.customerPolicyRatio}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: '15px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#343a40',
  marginBottom: '10px',
};

const textStyle = {
  fontSize: '2rem',
  fontWeight: '600',
  color: '#009879',
};

const iconStyle = {
  marginRight: '10px',
  color: '#007bff',
  fontSize: '2rem',
};

export default RevenueCards;
