import React, { useState } from 'react';
import { Navbar, Nav, Container, Card, Button, Row, Col, Dropdown, Image } from 'react-bootstrap';
import Logo from '../../../images/fortunelife.png'; 
import './EmployeeDashboard.css'; 
import { logout } from '../../../services/authService';
import { successToast } from '../../../utils/Toast';
import { useNavigate } from 'react-router-dom';
import Modal from '../../sharedComponents/modal/Modal';
import AddAgent from '../agent/AddAgent';

const EmployeeDashboard = () => {
const navigate=useNavigate()
const [addAgentModal,setAddAgentModal]=useState(false)



  const handleAddAgentClick = () => {
    setAddAgentModal(true)
  };
  const handleEditCustomer=()=>{
    navigate("/all-customers")
  }
  const handleEditAgent=()=>{
    navigate("/all-agents")
  }
  const handleLogout = () => {
    logout();
    successToast("Logged Out.");
    navigate("/");
  };
  return (
    <div className="dashboard-background">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#">
            <img
              src={Logo}
              height="40"
              className="d-inline-block align-top"
              alt="FortuneLife logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto d-flex align-items-center">
              <Dropdown align="end" className="mr-3">
                <Dropdown.Toggle variant="dark" id="dropdown-basic" className="d-flex align-items-center">
                  <Image
                    src="https://via.placeholder.com/40"
                    roundedCircle
                    className="mr-2"
                  />
                  <span>Profile</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">View Profile</Dropdown.Item>
                  <Dropdown.Item href="#">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Content */}
      <Container className="content-container" style={{ paddingTop: '100px' }}>
        <h2 className="text-center mb-5">Welcome to Your Dashboard!</h2>
        <Row className="g-4 justify-content-center">
          {/* Card 1: Agent Registration */}
          <Col md={6} lg={4}>
          <Card className="dashboard-card shadow-sm h-100">
        <Card.Body className="d-flex flex-column text-center">
          <i className="bi bi-person-plus-fill mb-3" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          <Card.Title>Agent Registration</Card.Title>
          <Card.Text className="flex-grow-1">
            Register a new agent to the company.
          </Card.Text>
          <Button variant="primary" className="mt-auto" onClick={handleAddAgentClick}>Register Agent</Button>
        </Card.Body>
      </Card>
          </Col>

          {/* Card 2: Manage Profile */}
          <Col md={6} lg={4}>
            <Card className="dashboard-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column text-center">
                <i className="bi bi-person-lines-fill mb-3" style={{ fontSize: '2rem', color: '#007bff' }}></i>
                <Card.Title>Manage Profile</Card.Title>
                <Card.Text className="flex-grow-1">
                  Update and manage your profile details.
                </Card.Text>
                <Button variant="primary" className="mt-auto">Manage Profile</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3: Edit Customer Details */}
          <Col md={6} lg={4}>
            <Card className="dashboard-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column text-center">
                <i className="bi bi-person-fill mb-3" style={{ fontSize: '2rem', color: '#007bff' }}></i>
                <Card.Title>Edit Customer Details</Card.Title>
                <Card.Text className="flex-grow-1">
                  Edit and update customer details.
                </Card.Text>
                <Button variant="primary" className="mt-auto" onClick={handleEditCustomer}>Edit Customer</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 4: Edit Agent Details */}
          <Col md={6} lg={4}>
            <Card className="dashboard-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column text-center">
                <i className="bi bi-people-fill mb-3" style={{ fontSize: '2rem', color: '#007bff' }}></i>
                <Card.Title>Edit Agent Details</Card.Title>
                <Card.Text className="flex-grow-1">
                  Edit and update agent details.
                </Card.Text>
                <Button variant="primary" className="mt-auto" onClick={handleEditAgent}>Edit Agent</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 5: View Commission Reports */}
          <Col md={6} lg={4}>
            <Card className="dashboard-card shadow-sm h-100">
              <Card.Body className="d-flex flex-column text-center">
                <i className="bi bi-graph-up mb-3" style={{ fontSize: '2rem', color: '#007bff' }}></i>
                <Card.Title>View Commission Reports</Card.Title>
                <Card.Text className="flex-grow-1">
                  View reports on agent commissions.
                </Card.Text>
                <Button variant="primary" className="mt-auto">View Reports</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-5">
        <Container>
          <p>&copy; 2024 Your Company. All rights reserved.</p>
          <p>
            <a href="#" className="text-light mx-2">Privacy Policy</a> | 
            <a href="#" className="text-light mx-2">Terms of Service</a> | 
            <a href="#" className="text-light mx-2">Contact Us</a>
          </p>
        </Container>
      </footer>
      <Modal
        isOpen={addAgentModal}
        onClose={() => setAddAgentModal(false)}
      >
        <AddAgent
          
          // flag={flag}
          // setFlag={setFlag}
          onClose={() => setAddAgentModal(false)}
        />
        </Modal>
    </div>
  );
};

export default EmployeeDashboard;