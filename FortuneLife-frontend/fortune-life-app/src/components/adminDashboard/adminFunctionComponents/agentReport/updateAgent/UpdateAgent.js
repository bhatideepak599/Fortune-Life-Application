import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { errorToast, successToast } from "../../../../../utils/Toast";
import { updateAgentByAdmin } from "../../../../../services/agentService";

const UpdateAgent = ({ agent, flag, setFlag, onClose }) => {
  const [formData, setFormData] = useState({
    id: 8,
    userDto: {
      id: "",
      active: "",
      verified: "",
      totalCommission: agent.totalCommission,
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      mobileNumber: "",
      email: "",
      dateOfBirth: "",
      addressDto: {
        id: "",
        houseNumber: "",
        apartment: "",
        city: "",
        state: "",
        pinCode: "",
      },
    },
  });

 
  useEffect(() => {
    if (agent) {
      setFormData({
        id: agent.id || "",
        active: true,
        verified: true,
        totalCommission: agent.totalCommission,
        userDto: {
          id: agent.userDto.id || "", 
          username: agent.userDto.username || "",
          password: agent.password || "",
          firstName: agent.userDto.firstName || "",
          lastName: agent.userDto.lastName || "",
          gender: agent.userDto.gender || "",
          mobileNumber: agent.userDto.mobileNumber || "",
          email: agent.userDto.email || "",
          dateOfBirth: agent.userDto.dateOfBirth || "",
          addressDto: {
            id: agent.userDto.addressDto?.id || "", // Ensure ID is not null
            houseNumber: agent.userDto.addressDto?.houseNumber || "",
            apartment: agent.userDto.addressDto?.apartment || "",
            city: agent.userDto.addressDto?.city || "",
            state: agent.userDto.addressDto?.state || "",
            pinCode: agent.userDto.addressDto?.pinCode || "",
          },
        },
      });
    }
  }, [agent]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      userDto: {
        ...prevData.userDto,
        [name]: value,
      },
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      userDto: {
        ...prevData.userDto,
        addressDto: {
          ...prevData.userDto.addressDto,
          [name]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(formData);

    // if (!formData.id || !formData.userDto.id) {
    //   errorToast("ID fields must not be null.");
    //   return;
    // }

    try {
      const response = await updateAgentByAdmin(formData);
      if (response) {
        successToast("Agent Updated");
        setFlag(!flag);
        onClose();
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
      <h2 className="mb-4">Update Agent Details</h2>

      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.userDto.username}
          disabled
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.userDto.email}
          disabled
        />
      </Form.Group>

      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          value={formData.userDto.firstName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.userDto.lastName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="gender">
        <Form.Label>Gender</Form.Label>
        <Form.Control
          type="text"
          name="gender"
          value={formData.userDto.gender}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="mobileNumber">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="text"
          name="mobileNumber"
          value={formData.userDto.mobileNumber}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="dateOfBirth">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dateOfBirth"
          value={formData.userDto.dateOfBirth}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <h3 className="mt-4">Address</h3>

      <Form.Group controlId="houseNumber">
        <Form.Label>House Number</Form.Label>
        <Form.Control
          type="text"
          name="houseNumber"
          value={formData.userDto.addressDto.houseNumber}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="apartment">
        <Form.Label>Apartment</Form.Label>
        <Form.Control
          type="text"
          name="apartment"
          value={formData.userDto.addressDto.apartment}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={formData.userDto.addressDto.city}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="state">
        <Form.Label>State</Form.Label>
        <Form.Control
          type="text"
          name="state"
          value={formData.userDto.addressDto.state}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="pinCode">
        <Form.Label>Pin Code</Form.Label>
        <Form.Control
          type="number"
          name="pinCode"
          value={formData.userDto.addressDto.pinCode}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-center mt-4">
        <Button variant="success" type="submit">
          Update
        </Button>
      </div>
    </Form>
  );
};

export default UpdateAgent;
