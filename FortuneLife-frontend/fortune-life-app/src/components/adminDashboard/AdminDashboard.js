import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Image,
  Button,
} from "react-bootstrap";
import profileImage from "../../images/profile.jpg"; // Adjust the path as necessary
import Sidebar from "./adminFunctionComponents/Sidebar";
import MainContent from "./adminFunctionComponents/MainContent";
import { getAdmin, logout, verifyUser } from "../../services/authService";
import { errorToast, successToast, warnToast } from "../../utils/Toast";
import { useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Manage City/State");
  const [adminDetails, setAdminDetails] = useState(null);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const validateAdmin = () => {
    if (!accessToken || !verifyUser(accessToken, "admin")) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!validateAdmin()) return;

    // Fetch the admin details
    fetchAdmin();

    // Retrieve the active item from localStorage or query parameters
    const savedActiveItem = localStorage.getItem("activeItem");
    const queryParams = new URLSearchParams(location.search);
    const initialActiveItem = queryParams.get("activeItem");

    // Set the active item state, preferring query parameter if available
    setActiveItem(initialActiveItem || savedActiveItem || "Manage City/State");
  }, [accessToken, navigate, location.search]);

  useEffect(() => {
    // Save the active item to localStorage whenever it changes
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);

  const fetchAdmin = async () => {
    try {
      const response = await getAdmin();
      setAdminDetails(response.data);
      setName(response.data.user.firstName);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleChange = (item) => {
    if (!validateAdmin()) return;

    if (item === 'Manage Tax and Scheme Deductions') {
      setShow(true);
    } else {
      setShow(false);
    }
    setActiveItem(item);
  };

  const handleLogout = () => {
    logout();
    successToast("Logged Out.");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/admin-profile", { state: { adminDetails } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6, #dcdbe1)"
      }}
    >
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                onClick={handleProfile}
                className="text-light d-flex align-items-center"
              >
                Profile
              </Nav.Link>
              <Nav.Link
                onClick={handleProfile}
                className="d-flex align-items-center"
                style={{ marginLeft: "0px" }}
              >
                <Image
                  src={profileImage} // Replace with the actual image URL
                  roundedCircle
                  style={{ width: "40px", height: "40px" }}
                />
              </Nav.Link>
            </Nav>
            <Navbar.Brand className="mx-auto" href="#home">
              Welcome {name}
            </Navbar.Brand>
            <Nav className="ml-auto">
              {/* Logout Button on the right */}
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid style={{ padding: "20px", marginTop: "51px" }}>
        <Row>
          {/* Sidebar */}
          <Col md={3} style={{ padding: 0 }}>
            <div
              style={{
                position: "fixed",
                top: "51px",
                left: 0,
                width: "22%",
                height: "70vh",
              }}
            >
              <Sidebar activeItem={activeItem} onItemClick={handleChange} />
            </div>
          </Col>
          {/* Main Content */}
          <Col
            md={{ span: 9, offset: 3 }}
            style={{ padding: "20px", marginLeft: "22%" }}
          >
            {validateAdmin() && (
              <MainContent activeItem={activeItem} show={show} setShow={setShow} setActiveItem={setActiveItem} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
