import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { errorToast, successToast } from "../../../../../utils/Toast";
import { updateCustomerByAdmin } from "../../../../../services/CustomerService";

const UpdateCustomer = ({ customer,flag,setFlag, onClose }) => {
  // State to hold the form values
  const [formData, setFormData] = useState({
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
  });

  // Initialize the form data with customer details
  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.userDto.id,
        active: customer.userDto.active,
        username: customer.userDto.username || "",
        password: customer.password || "",
        firstName: customer.userDto.firstName || "",
        lastName: customer.userDto.lastName || "",
        gender: customer.userDto.gender || "",
        mobileNumber: customer.userDto.mobileNumber || "",
        email: customer.userDto.email || "",
        dateOfBirth: customer.userDto.dateOfBirth || "",
        addressDto: {
          id: customer.userDto.addressDto?.id,
          houseNumber: customer.userDto.addressDto?.houseNumber || "",
          apartment: customer.userDto.addressDto?.apartment || "",
          city: customer.userDto.addressDto?.city || "",
          state: customer.userDto.addressDto?.state || "",
          pinCode: customer.userDto.addressDto?.pinCode || "",
        },
      });
    }
  }, [customer]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      addressDto: {
        ...prevData.addressDto,
        [name]: value,
      },
    }));
  };
  const handleAddressChange1= (e) => {
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
  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    formData.addressDto.id=customer.userDto.addressDto?.id;
    try{
      console.log(formData+"============================");
      
      const response= await updateCustomerByAdmin(formData);
      if(response){
        successToast("Customer Updated")
        setFlag(!flag)
        onClose()
      }
    }catch(error){
      errorToast(error.response?.data?.message)
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
      <h2 className="mb-4">Update Customer Details</h2>

      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          disabled
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          disabled
        />
      </Form.Group>

      <Form.Group controlId="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="gender">
        <Form.Label>Gender</Form.Label>
        <Form.Control
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="mobileNumber">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="dateOfBirth">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
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
          value={formData.addressDto.houseNumber}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="apartment">
        <Form.Label>Apartment</Form.Label>
        <Form.Control
          type="text"
          name="apartment"
          value={formData.addressDto.apartment}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          name="city"
          value={formData.addressDto.city}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="state">
        <Form.Label>State</Form.Label>
        <Form.Control
          type="text"
          name="state"
          value={formData.addressDto.state}
          onChange={handleAddressChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="pinCode">
        <Form.Label>Pin Code</Form.Label>
        <Form.Control
          type="number"
          name="pinCode"
          value={formData.addressDto.pinCode}
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

export default UpdateCustomer;
