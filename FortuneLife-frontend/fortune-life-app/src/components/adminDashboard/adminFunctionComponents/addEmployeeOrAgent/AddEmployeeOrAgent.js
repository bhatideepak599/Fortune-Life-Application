import React, { useState } from "react";
import { errorToast, successToast } from "../../../../utils/Toast";
import { addEmployee } from "../../../../services/employeeService";
import { addAgent } from "../../../../services/agentService";
import styles from "./AddEmployeeOrAgent.module.css";

const AddEmployeeOrAgent = ({ onlyAgent }) => {
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
    role: "Agent",
  });

  const validateForm = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

    const today = new Date();
    const dob = new Date(formData.userDto.dateOfBirth);
    const joiningDate = new Date(formData.joiningDate);

    if (!nameRegex.test(formData.userDto.firstName) || !nameRegex.test(formData.userDto.lastName)) {
      errorToast("First name and Last name must contain only alphabets.");
      return false;
    }

    if (!phoneRegex.test(formData.userDto.mobileNumber)) {
      errorToast("Mobile number must be a valid 10-digit number.");
      return false;
    }

    if (!passwordRegex.test(formData.userDto.password)) {
      errorToast("Password must be at least 6 characters, contain an uppercase letter, lowercase letter, number, and special character.");
      return false;
    }

    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18 || (age === 18 && today < new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate()))) {
      errorToast("User must be at least 18 years old.");
      return false;
    }

    if (dob > today) {
      errorToast("Date of birth and joining date cannot be in the future.");
      return false;
    }

    if (formData.salary <= 0 && formData.role === "Employee") {
      errorToast("Salary must be a positive number.");
      return false;
    }

    return true;
  };

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

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (formData.role === "Employee") {
        const response = await addEmployee(formData);
        if (response) {
          successToast("Employee Added.");
        }
      } else if (formData.role === "Agent") {
        const response = await addAgent(formData);
        if (response) {
          successToast("Agent Added.");
        }
      }

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
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className={`container ${styles.addAgentEmployee}`} style={{ maxWidth: "100%" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-9">
          <form className="p-4 rounded shadow-sm bg-white" onSubmit={handleSubmit} style={{ width: "100%" }}>
            <h2 className="text-center mb-4">Add Details</h2>

            
            <div className="text-center mb-4">
              <div className="btn-group">
                <button
                  type="button"
                  className={`btn ${formData.role === "Employee" ? "btn-primary" : "btn-outline-primary"}`}
                  style={{
                    backgroundColor: formData.role === "Employee" ? "hsl(245, 67%, 59%)" : "transparent",
                    color: formData.role === "Employee" ? "white" : "black",
                    borderColor: "hsl(245, 67%, 59%)",
                  }}
                  onClick={() => handleRoleChange("Employee")}
                >
                  Employee
                </button>
                <button
                  type="button"
                  className={`btn ${formData.role === "Agent" ? "btn-primary" : "btn-outline-primary"}`}
                  style={{
                    backgroundColor: formData.role === "Agent" ? "hsl(245, 67%, 59%)" : "transparent",
                    color: formData.role === "Agent" ? "white" : "black",
                    borderColor: "hsl(245, 67%, 59%)",
                  }}
                  onClick={() => handleRoleChange("Agent")}
                >
                  Agent
                </button>
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="row">
              <div className="col p-1">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={formData.userDto.firstName} onChange={handleChange} placeholder="Enter first name" className="form-control form-control-sm" required />
                </div>
              </div>
              <div className="col p-1">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.userDto.lastName} onChange={handleChange} placeholder="Enter last name" className="form-control form-control-sm" required />
                </div>
              </div>
            </div>

            {/* Gender and Username */}
            <div className="row">
              <div className="col p-1">
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={formData.userDto.gender} onChange={handleChange} className="form-control form-control-sm">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="col p-1">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={formData.userDto.username} onChange={handleChange} placeholder="Enter username" className="form-control form-control-sm" required />
                </div>
              </div>
            </div>

            {/* Password and Mobile Number */}
            <div className="row">
              <div className="col p-1">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.userDto.password} onChange={handleChange} placeholder="Enter password" className="form-control form-control-sm" required />
                </div>
              </div>
              <div className="col p-1">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" name="mobileNumber" value={formData.userDto.mobileNumber} onChange={handleChange} placeholder="Enter mobile number" className="form-control form-control-sm" required />
                </div>
              </div>
            </div>

            {/* Email and Date of Birth */}
            <div className="row">
              <div className="col p-1">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.userDto.email} onChange={handleChange} placeholder="Enter email" className="form-control form-control-sm" required />
                </div>
              </div>
              <div className="col p-1">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.userDto.dateOfBirth} onChange={handleChange} className="form-control form-control-sm" required />
                </div>
              </div>
            </div>

            {/* Joining Date and Salary */}
            <div className="row p-1">
              <div className="col">
                <div className="form-group">
                  <label>Joining Date</label>
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="form-control form-control-sm" required />
                </div>
              </div>
              {formData.role === "Employee" && (
                <div className="col p-1">
                  <div className="form-group">
                    <label>Salary</label>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Enter salary" className="form-control form-control-sm" required />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.subBtn}>
              <button type="submit" className="btn w-50 mt-3 ms-5" style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeOrAgent;

