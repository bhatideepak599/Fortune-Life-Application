import React from "react";
import { Card } from "react-bootstrap";
import { FaUsers, FaUserTie, FaBriefcase, FaFileAlt, FaBalanceScale } from "react-icons/fa";

const RevenueCards = ({ report }) => {
  return (
    <div className="row mb-4">
      <h1 className="text-center mt-5" style={headerStyle}>Reports and Revenue</h1>

      <div className="col-md-4 mt-4">
        <Card className="text-center shadow-lg" style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #FAF7F0, #EDE8DC)' }}>
          <Card.Body style={cardBodyStyle}>
            <Card.Title style={titleStyle}>
              <FaUsers style={iconStyle} /> Customers
            </Card.Title>
            <Card.Text style={textStyle}>{report.customerCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-4">
        <Card className="text-center shadow-lg" style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #FAF7F0, #EDE8DC)' }}>
          <Card.Body style={cardBodyStyle}>
            <Card.Title style={titleStyle}>
              <FaUserTie style={iconStyle} /> Agents
            </Card.Title>
            <Card.Text style={textStyle}>{report.agentCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-4">
        <Card className="text-center shadow-lg" style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #FAF7F0, #EDE8DC)' }}>
          <Card.Body style={cardBodyStyle}>
            <Card.Title style={titleStyle}>
              <FaBriefcase style={iconStyle} /> Employees
            </Card.Title>
            <Card.Text style={textStyle}>{report.employeeCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-4">
        <Card className="text-center shadow-lg" style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #FAF7F0, #EDE8DC)' }}>
          <Card.Body style={cardBodyStyle}>
            <Card.Title style={titleStyle}>
              <FaFileAlt style={iconStyle} /> Policies
            </Card.Title>
            <Card.Text style={textStyle}>{report.policyCount}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4 mt-4">
        <Card className="text-center shadow-lg" style={{ ...cardStyle, backgroundImage: 'linear-gradient(135deg, #FAF7F0, #EDE8DC)' }}>
          <Card.Body style={cardBodyStyle}>
            <Card.Title style={titleStyle}>
              <FaBalanceScale style={iconStyle} /> Policy per Customer
            </Card.Title>
            <Card.Text style={textStyle}>{report.customerPolicyRatio}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const headerStyle = {

  color: '#333',
  fontWeight: 'bold',
  fontSize: '2rem',
};

const cardStyle = {
  borderRadius: '10px',
  padding: '15px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  color: '#fff',
  minHeight: '180px', // Reduced height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

const titleStyle = {
  fontSize: '1.25rem', 
  fontWeight: 'bold',
  marginBottom: '8px',
  color: 'black',
};

const textStyle = {
  fontSize: '1.5rem', // Reduced font size
  fontWeight: '600',
  color: 'black',
};

const iconStyle = {
  marginRight: '8px',
  fontSize: '1.75rem', // Reduced icon size
};

export default RevenueCards;
