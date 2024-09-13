import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Image } from "react-bootstrap";
import { addAgent } from "../../../services/agentService";
import { errorToast, successToast } from "../../../utils/Toast";
import { uploadFile } from "../../../services/fileServices";
import './AddAgent.css';

const AddAgent = ({ onlyAgent }) => {
  const [schemeImage, setSchemeImage] = useState("");
  const [formData, setFormData] = useState({
    active: true,
    image: schemeImage,
    verified: false,
    totalCommission: 0,
    userDto: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "Male",
      active: true,
      mobileNumber: "",
      email: "",
      dateOfBirth: "",
      addressDto: {
        houseNumber: "",
        apartment: "",
        city: "",
        state: "",
        pinCode: 0,
      },
    },
    role: "Agent",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.userDto) {
      setFormData({
        ...formData,
        userDto: {
          ...formData.userDto,
          [name]: value,
        },
      });
    } else if (name in formData.userDto.addressDto) {
      setFormData({
        ...formData,
        userDto: {
          ...formData.userDto,
          addressDto: {
            ...formData.userDto.addressDto,
            [name]: value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData1 = new FormData();
      formData1.append("file", file);

      const fileLocation = await uploadFile(formData1);

      if (fileLocation && fileLocation.data) {
        setSchemeImage(fileLocation.data.name);
      } else {
        errorToast("File upload failed or no data received.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      formData.image=schemeImage;
      if (formData.role === "Agent") {
        const response = await addAgent(formData);
        console.log(response);
        
        if (response) {
          successToast("Agent Added.");
        }
      }

      setFormData({
        active: true,
        verified: false,
        
        totalCommission: 0,
        userDto: {
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          gender: "Male",
          active: true,
          mobileNumber: "",
          email: "",
          dateOfBirth: "",
          addressDto: {
            houseNumber: "",
            apartment: "",
            city: "",
            state: "",
            pinCode: 0,
          },
        },
        role: "Agent",
      });
      setSchemeImage("")
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8}> {/* Increased the width */}
          
              <h2 className="text-center mb-4">Add Agent</h2>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.userDto.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.userDto.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Gender</Form.Label>
                      <Form.Control
                        as="select"
                        name="gender"
                        value={formData.userDto.gender}
                        onChange={handleChange}
                        className="form-control-placeholder"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.userDto.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-highlight">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.userDto.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="form-control-placeholder"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="mobileNumber"
                        value={formData.userDto.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        maxLength="10"
                        pattern="\d{10}"
                        title="Mobile number must be exactly 10 digits"
                        className="form-control-placeholder"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.userDto.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="formSchemeImage">
                  <Form.Label className="form-label-highlight"><strong>Aadhar Card</strong></Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    className="form-control-placeholder"
                  />
                  {schemeImage && (
                    <div className="mt-3">
                      <Image src={schemeImage} thumbnail />
                    </div>
                  )}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={formData.userDto.dateOfBirth}
                        onChange={handleChange}
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Joining Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h4 className="mt-4">Address</h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">House Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="houseNumber"
                        value={formData.userDto.addressDto.houseNumber}
                        onChange={handleChange}
                        placeholder="Enter house number"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Apartment</Form.Label>
                      <Form.Control
                        type="text"
                        name="apartment"
                        value={formData.userDto.addressDto.apartment}
                        onChange={handleChange}
                        placeholder="Enter apartment"
                        className="form-control-placeholder"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.userDto.addressDto.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.userDto.addressDto.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-highlight">Pin Code</Form.Label>
                      <Form.Control
                        type="number"
                        name="pinCode"
                        value={formData.userDto.addressDto.pinCode}
                        onChange={handleChange}
                        placeholder="Enter pin code"
                        className="form-control-placeholder"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="success"
                  className="btn-custom w-40 mt-4 ms-5"
                >
                  Add Agent
                </Button>
              </Form>
           
        </Col>
      </Row>
    </Container>
  );
};

export default AddAgent;
