import React, { useState } from "react";
import { addnewCustomer } from "../../../services/CustomerService";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

const CustomerRegister = ({ id, onClose }) => {
  const [userDto, setUserDto] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    addressDto: {
      houseNumber: "",
      apartment: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDto({
      ...userDto,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserDto({
      ...userDto,
      addressDto: {
        ...userDto.addressDto,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addnewCustomer(userDto, userDto.addressDto);
      if (response) {
        console.log(response.id);

        id(response.id);
        onClose();
        toast.success("Customer Registration successful!");
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="bg-light p-4 rounded-lg border">
        <h1 className="d-grid mx-auto mt-3">
          <span className="badge p-3" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
            Customer Registration
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="row">
            {/* First Name */}
            <div className="col-md-6 mb-3">
              <label>First Name</label>
              <input type="text" className="form-control" name="firstName" value={userDto.firstName} onChange={handleInputChange} placeholder="Enter First Name" required />
            </div>

            {/* Last Name */}
            <div className="col-md-6 mb-3">
              <label>Last Name</label>
              <input type="text" className="form-control" name="lastName" value={userDto.lastName} onChange={handleInputChange} placeholder="Enter Last Name" />
            </div>

            {/* Username */}
            <div className="col-md-6 mb-3">
              <label>Username</label>
              <input type="text" className="form-control" name="username" value={userDto.username} onChange={handleInputChange} placeholder="Enter Username" pattern="^[A-Za-z0-9@._-]{6,}$" title="Username must be at least 6 characters long and can contain letters, numbers, and the special characters @, ., -, _" required />
            </div>

            {/* Password */}
            <div className="col-md-6 mb-3">
              <label>Password</label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className="form-control" name="password" value={userDto.password} onChange={handleInputChange} placeholder="Enter Password" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$" title="Password must be 6-15 characters long and contain at least one letter and one number" required />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={userDto.email} onChange={handleInputChange} placeholder="Enter Email" required />
            </div>

            {/* Mobile Number */}
            <div className="col-md-6 mb-3">
              <label>Mobile Number</label>
              <input type="tel" className="form-control" name="mobileNumber" value={userDto.mobileNumber} onChange={handleInputChange} placeholder="Enter Mobile Number" pattern="^[0-9]{10}$" title="Mobile number must be a 10-digit number" required />
            </div>

            {/* Gender */}
            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <div className="form-check">
                <input type="radio" className="form-check-input" name="gender" value="Male" checked={userDto.gender === "Male"} onChange={handleInputChange} required />
                <label className="form-check-label">Male</label>
              </div>
              <div className="form-check">
                <input type="radio" className="form-check-input" name="gender" value="Female" checked={userDto.gender === "Female"} onChange={handleInputChange} />
                <label className="form-check-label">Female</label>
              </div>
              <div className="form-check">
                <input type="radio" className="form-check-input" name="gender" value="Others" checked={userDto.gender === "Others"} onChange={handleInputChange} />
                <label className="form-check-label">Others</label>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="col-md-6 mb-3">
              <label>Date of Birth</label>
              <input type="date" className="form-control" name="dateOfBirth" value={userDto.dateOfBirth} onChange={handleInputChange} />
            </div>

            {/* Address Section */}
            <div className="col-12">
              <h5 className="mt-4">Address</h5>
            </div>

            <div className="col-md-6 mb-3">
              <label>House Number</label>
              <input type="text" className="form-control" name="houseNumber" value={userDto.addressDto.houseNumber} onChange={handleAddressChange} placeholder="Enter House Number" />
            </div>

            <div className="col-md-6 mb-3">
              <label>Apartment</label>
              <input type="text" className="form-control" name="apartment" value={userDto.addressDto.apartment} onChange={handleAddressChange} placeholder="Enter Apartment" />
            </div>

            <div className="col-md-6 mb-3">
              <label>City</label>
              <input type="text" className="form-control" name="city" value={userDto.addressDto.city} onChange={handleAddressChange} placeholder="Enter City" required />
            </div>

            <div className="col-md-6 mb-3">
              <label>State</label>
              <input type="text" className="form-control" name="state" value={userDto.addressDto.state} onChange={handleAddressChange} placeholder="Enter State" required />
            </div>

            <div className="col-md-6 mb-3">
              <label>Pincode</label>
              <input type="text" className="form-control" name="pinCode" value={userDto.addressDto.pinCode} onChange={handleAddressChange} pattern="^[0-9]{6}$" title="Pincode must be a 6-digit number" placeholder="Enter Pincode" required />
            </div>

            <div className="col-12 text-center mt-4">
              <button type="submit" className="btn btn-success btn-lg" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;
