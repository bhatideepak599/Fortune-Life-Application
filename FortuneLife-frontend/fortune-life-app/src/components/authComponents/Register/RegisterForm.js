import React, { useState } from "react";
import "./RegisterForm.module.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.firstName = formData.firstName ? "" : "First name is required.";
    tempErrors.lastName = formData.lastName ? "" : "Last name is required.";
    tempErrors.username = /^(?=.*[A-Za-z0-9@._-]{6,})/.test(formData.username) ? "" : "Username must be at least 6 characters long and can include letters, numbers, and special characters @, ., -, _";
    tempErrors.password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/.test(formData.password) ? "" : "Password must be between 6-15 characters and include at least one number and one letter.";
    tempErrors.email = /^\S+@\S+\.\S+$/.test(formData.email) ? "" : "Email is not valid.";
    tempErrors.mobileNumber = /^[0-9]{10}$/.test(formData.mobileNumber) ? "" : "Mobile number must be a 10-digit number.";
    tempErrors.gender = formData.gender ? "" : "Gender is required.";
    tempErrors.dateOfBirth = formData.dateOfBirth ? "" : "Date of birth is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data submitted: ", formData);
      // Proceed with submitting form data
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5 border border-2">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form className="registration-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Register</h2>
            {Object.keys(errors).map((key) => {
              if (errors[key]) {
                return (
                  <p key={key} style={{ color: "red" }}>
                    {errors[key]}
                  </p>
                );
              }
              return null;
            })}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number
              </label>
              <input type="text" className="form-control" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-5" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
