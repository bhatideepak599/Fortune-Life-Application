import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLoggedInUser } from "../../../services/authService";
import { updateCustomer } from "../../../services/CustomerService";

const UserProfile = ({ isUpdate,  updateProfile }) => {
  const[flag, setFlag]=useState(false)
  const [userDto, setUserDto] = useState({
    id: 0,
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    mobileNumber: "",
    email: "",
    dateOfBirth: "",
    active: true,
  });

  const [addressDto, setAddressDto] = useState({
    houseNumber: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Ladakh",
    "Puducherry",
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getLoggedInUser();
        setUserDto(response || {});
        setAddressDto(response?.addressDto || {});
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user details.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [flag]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserDto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDto((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userDto.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!phoneNumberRegex.test(userDto.mobileNumber)) {
      toast.error("Invalid phone number format");
      return false;
    }
    if (!pinCodeRegex.test(addressDto.pinCode)) {
      toast.error("Invalid pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (isUpdate) {
          updateProfile(userDto, addressDto);
          setFlag(!flag);
        } else {
          await updateCustomer({ userDto, addressDto });
        }
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading spinner
  }

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Username */}
          <div className="col-md-6">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={userDto.username}
              disabled
            />
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={userDto.email}
              disabled
            />
          </div>

          {/* First Name */}
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={userDto.firstName}
              onChange={handleUserChange}
              required
            />
          </div>

          {/* Last Name */}
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={userDto.lastName}
              onChange={handleUserChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="col-md-12">
            <label className="form-label">Gender</label>
            <div className="d-flex">
              <div className="form-check me-3">
                <input
                  type="radio"
                  className="form-check-input"
                  id="male"
                  name="gender"
                  value="male"
                  checked={userDto.gender === "MALE"}
                  onChange={handleUserChange}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check me-3">
                <input
                  type="radio"
                  className="form-check-input"
                  id="female"
                  name="gender"
                  value="female"
                  checked={userDto.gender === "FEMALE"}
                  onChange={handleUserChange}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="others"
                  name="gender"
                  value="others"
                  checked={userDto.gender === "OTHERS"}
                  onChange={handleUserChange}
                />
                <label className="form-check-label" htmlFor="others">
                  Others
                </label>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="col-md-6">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
              id="dateOfBirth"
              name="dateOfBirth"
              value={userDto.dateOfBirth}
              onChange={handleUserChange}
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="col-md-6">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number
            </label>
            <input
              type="text"
              className="form-control"
              id="mobileNumber"
              name="mobileNumber"
              value={userDto.mobileNumber}
              onChange={handleUserChange}
              required
            />
          </div>

          {/* Address */}
          <h5 className="mt-4">Address</h5>

          <div className="col-md-6">
            <label htmlFor="houseNumber" className="form-label">
              House Number
            </label>
            <input
              type="text"
              className="form-control"
              id="houseNumber"
              name="houseNumber"
              value={addressDto?.houseNumber || ""}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="apartment" className="form-label">
              Apartment
            </label>
            <input
              type="text"
              className="form-control"
              id="apartment"
              name="apartment"
              value={addressDto?.apartment || ""}
              onChange={handleAddressChange}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={addressDto?.city || ""}
              onChange={handleAddressChange}
              required
            />
          </div>

          {/* State */}
          <div className="col-md-6">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <select
              id="state"
              className="form-select"
              name="state"
              value={addressDto?.state || ""}
              onChange={handleAddressChange}
              required
            >
              <option value="">
                Select State
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Pincode */}
          <div className="col-md-6">
            <label htmlFor="pinCode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="pinCode"
              name="pinCode"
              value={addressDto?.pinCode || ""}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary mt-3">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfile;
