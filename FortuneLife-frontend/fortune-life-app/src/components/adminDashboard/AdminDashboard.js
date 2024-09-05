import React, { useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Image, Button } from 'react-bootstrap';
import profileImage from "./profile.jpg"; // Adjust the path as necessary
import Sidebar from './adminFunctionComponents/Sidebar';
import MainContent from './adminFunctionComponents/MainContent';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('Manage City/State');

  const handleChange = (item) => {
    setActiveItem(item);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6, #222b38)' }}>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">

          <Nav.Link href="#profile" className="text-light d-flex align-items-center">
                Profile
              </Nav.Link>
            <Nav.Link href="#profile" className="d-flex align-items-center" style={{ marginLeft: '0px' }}>
             
              <Image
                src={profileImage}  // Replace with the actual image URL
                roundedCircle
                style={{ width: '40px', height: '40px' }}
              />
            </Nav.Link>
           
          </Nav>
          <Navbar.Brand className="mx-auto" href="#home">
            Admin Dashboard
          </Navbar.Brand>
          <Nav className="ml-auto">
            {/* Logout Button on the right */}
            <Button variant="outline-light" href="#logout">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <Container fluid style={{ padding: '20px', marginTop: '51px', marginLeft: '-10px' }}>
        <Row>
          {/* Sidebar */}
          <Col md={3}>
            <Sidebar activeItem={activeItem} onItemClick={handleChange} />
          </Col>

          {/* Main Content */}
          <Col md={9} style={{ padding: '20px' }}>
            <MainContent activeItem={activeItem} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
