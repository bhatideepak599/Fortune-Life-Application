import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Form, Button, Container, Row, Col, Nav } from "react-bootstrap";
import { logout, updateAdminDetails, verifyUser } from "../../../../services/authService";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";

const AdminProfile = ({ admin ,flag ,setFlag}) => {
  const [adminDetails, setAdminDetails] = useState(admin);

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: adminDetails.userDto?.id || "",
    username: adminDetails.userDto?.username || "",
    firstName: adminDetails.userDto?.firstName || "",
    lastName: adminDetails.userDto?.lastName || "",
    gender: adminDetails.userDto?.gender || "",
    email: adminDetails.userDto?.email || "",
    dateOfBirth: adminDetails.userDto?.dateOfBirth || "",
    mobileNumber: adminDetails.userDto?.mobileNumber || "",
    addressDto: {
      id: adminDetails.userDto?.addressDto?.id || 0,
      houseNumber: adminDetails.userDto?.addressDto?.houseNumber || "",
      apartment: adminDetails.userDto?.addressDto?.apartment || "",
      city: adminDetails.userDto?.addressDto?.city || "",
      state: adminDetails.userDto?.addressDto?.state || "",
      pinCode: adminDetails.userDto?.addressDto?.pinCode || "",
    },
  });

  useEffect(() => {
    if (!accessToken || !verifyUser(accessToken, "admin")) {
      navigate("/");
    }
    setAdminDetails(admin);
  }, [accessToken, navigate, admin]);

  const handleSaveChanges = async () => {
    try {
      const response = await updateAdminDetails(formData);
      if (response && response.data) {
        setAdminDetails((prevState) => ({
          ...prevState,
          userDto: {
            ...prevState.userDto,
            ...response.data,
            addressDto: {
              ...prevState.userDto.addressDto,
              ...response.data.addressDto,
            },
          },
        }));
        successToast("Updated Successfully.");
        setFlag(!flag)
        setIsEditing(false);
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };
  const handleLogout = () => {
    try {
      const response = logout();
      console.log("response" + response);

      if (response) {
        successToast("Logged Out Successfully.");
      } else warnToast("Login First!");
      navigate("/");
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };
  const handleDiscardChanges = () => {
    setFormData({
      id: adminDetails.userDto?.id || "",
      username: adminDetails.userDto?.username || "",
      firstName: adminDetails.userDto?.firstName || "",
      lastName: adminDetails.userDto?.lastName || "",
      gender: adminDetails.userDto?.gender || "",
      email: adminDetails.userDto?.email || "",
      dateOfBirth: adminDetails.userDto?.dateOfBirth || "",
      mobileNumber: adminDetails.userDto?.mobileNumber || "",
      addressDto: {
        id: adminDetails.userDto?.addressDto?.id || 0,
        houseNumber: adminDetails.userDto?.addressDto?.houseNumber || "",
        apartment: adminDetails.userDto?.addressDto?.apartment || "",
        city: adminDetails.userDto?.addressDto?.city || "",
        state: adminDetails.userDto?.addressDto?.state || "",
        pinCode: adminDetails.userDto?.addressDto?.pinCode || "",
      },
    });
    setIsEditing(false);
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("addressDto.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        addressDto: {
          ...prevData.addressDto,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "70px",
      }}
    >
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Nav.Link href="/admin-dashboard" className="text-light d-flex align-items-center">
            Home
          </Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Brand className="mx-auto" href="#home">
              Your Profile Details
            </Navbar.Brand>
            <Nav className="ml-auto">
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {adminDetails.userDto ? (
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="id">
                  <Form.Label>Admin ID</Form.Label>
                  <Form.Control type="Number" defaultValue={adminDetails.id} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Control type="Text" defaultValue={adminDetails.id ? "Active" : "Inactive"} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" defaultValue={adminDetails.userDto.username} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Control type="text" name="gender" defaultValue={formData.gender} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" defaultValue={adminDetails.userDto.email} readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="mobileNumber">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control type="text" name="mobileNumber" defaultValue={formData.mobileNumber} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="addressDto">
                  <Form.Label>Address</Form.Label>
                  <Row>
                    <Col md={6}>
                      <Form.Control type="text" name="addressDto.houseNumber" value={formData.addressDto.houseNumber} onChange={handleInputChange} placeholder="House Number" className="mb-2" disabled={!isEditing} />
                    </Col>
                    <Col md={6}>
                      <Form.Control type="text" name="addressDto.apartment" value={formData.addressDto.apartment} onChange={handleInputChange} placeholder="Apartment" className="mb-2" disabled={!isEditing} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Control type="text" name="addressDto.city" value={formData.addressDto.city} onChange={handleInputChange} placeholder="City" className="mb-2" disabled={!isEditing} />
                    </Col>
                    <Col md={6}>
                      <Form.Control type="text" name="addressDto.state" value={formData.addressDto.state} onChange={handleInputChange} placeholder="State" className="mb-2" disabled={!isEditing} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Control type="text" name="addressDto.pinCode" value={formData.addressDto.pinCode} onChange={handleInputChange} placeholder="Pin Code" className="mb-2" disabled={!isEditing} />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              {!isEditing ? (
                <>
                  <Button variant="info" onClick={handleUpdate} className="me-2 ">
                    Update
                  </Button>
                  <Button variant="secondary" onClick={handleBack} className="me-2">
                    Back
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="info" onClick={handleSaveChanges} className="me-2 ">
                    Save Changes
                  </Button>
                  <Button variant="danger" onClick={handleDiscardChanges} className="me-2">
                    Discard Changes
                  </Button>
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                </>
              )}
            </div>
          </Form>
        ) : (
          <div>
            <p>No admin details available</p>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AdminProfile;
