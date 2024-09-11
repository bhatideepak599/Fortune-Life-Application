import React, { useState } from "react";
import { Form, Button, Container, Row, Col , Image} from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./AddEmployeeOrAgent.css"; // Import the custom CSS file
import { errorToast, successToast } from "../../../../utils/Toast";
import { addEmployee } from "../../../../services/employeeService";
import { addAgent } from "../../../../services/agentService";

const AddEmployeeOrAgent = ({onlyAgent}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    
  const [formData, setFormData] = useState({
    id: 0,
    active: true,
    salary: 0,
    joiningDate: "",
    verified: true,
    totalCommission: 0,
    userDto: {
      id: 0,
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "Male",
      active: true,
      mobileNumber: "",
      email: "",
      dateOfBirth: "",
    },
    role: "Agent", // Added to handle role selection
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
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with role:", formData.role); // Log role
    console.log("Form data:", formData); // Log form data
    try {
      if (formData.role === "Employee") {
        //console.log("Calling addEmployee");
        const response = await addEmployee(formData);
        if (response) {
          successToast("Employee Added.");
        }
      } else if (formData.role === "Agent") {
        console.log("Calling addAgent");
        const response = await addAgent(formData);
        if (response) {
          successToast("Agent Added.");
        }
      }
      
      // Reset form data after successful submission
      setFormData({
        id: 0,
        active: true,
        salary: 0,
        joiningDate: "",
        verified: true,
        totalCommission: 0,
        userDto: {
          id: 0,
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          gender: "Male",
          active: true,
          mobileNumber: "",
          email: "",
          dateOfBirth: "",
        },
        role: "Employee", 
      });
    } catch (error) {
      console.error("Error:", error); // Log error
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };
  
  

  return (
    <Container className=" justify-content-center align-items-center    ">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Form
            className="p-4 rounded shadow-sm bg-white"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-4">Add Details</h2>{" "}
            {/* Form Heading */}
            <Form.Group>
              <Form.Check
                type="radio"
                label="Employee"
                value="Employee"
                name="role"
                checked={formData.role === "Employee"}
                onChange={handleRoleChange}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Agent"
                value="Agent"
                name="role"
                checked={formData.role === "Agent"}
                onChange={handleRoleChange}
                className="mb-4"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.userDto.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.userDto.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.userDto.gender}
                onChange={handleChange}
                className="form-control-sm"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.userDto.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.userDto.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobileNumber"
                value={formData.userDto.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.userDto.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.userDto.dateOfBirth}
                onChange={handleChange}
                className="form-control-sm"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Joining Date</Form.Label>
              <Form.Control
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="form-control-sm"
                required
              />
            </Form.Group>
            {formData.role === "Employee" && (
              <Form.Group>
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  className="form-control-sm"
                  required
                />
              </Form.Group>
            )}
            <Button variant="success" type="submit" className="w-50 mt-3 ms-5">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEmployeeOrAgent;
