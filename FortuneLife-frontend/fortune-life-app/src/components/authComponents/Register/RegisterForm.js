import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import { registerUser } from "../../../services/authService";
import { toast } from "react-toastify";
import { uploadCustomerFile } from "../../../services/fileServices";
import registerImg from "../../../images/undraw_security_re_a2rk.svg";

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    role: role || "Customer",
    agentImage: "",
  });

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

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
    tempErrors.role = formData.role ? "" : "Role is required.";
    if (formData.role === "Agent") {
      tempErrors.agentImage = file ? "" : "Document upload is required for agents.";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setErrors((prevErrors) => ({
        ...prevErrors,
        agentImage: "",
      }));
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let agentImageName = "";

        if (formData.role === "Agent" && file) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          const uploadResponse = await uploadCustomerFile(uploadFormData);

          if (uploadResponse && uploadResponse.data) {
            agentImageName = uploadResponse.data.name;
          } else {
            throw new Error("File upload failed");
          }
        }

        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          agentImage: agentImageName,
        };

        const role = formData.role === "Agent" ? "agent" : "customer";
        await registerUser(registrationData, role);
        toast.success("Registration successful!");
        navigate(-1);
      } catch (error) {
        console.error("Registration failed: ", error.response);
        toast.error(error.response?.data?.message || "Registration failed. Please check your input.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "Customer") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        agentImage: "",
      }));
      setFile(null);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className={`container ${styles.registerContainer}`}>
      <div className="row">
        <div className="col-md-6 d-none d-md-block ">
          <img src={registerImg} alt="Register" className={`${styles.registerImage} img-fluid mt-5 border border-2`} />
        </div>

        <div className="col-md-6">
          <div className={`${styles.formContainer}`}>
            <form className={styles.registrationForm} onSubmit={handleSubmit}>
              <h2 className="text-center mb-4">Register</h2>

              {/* First Row: First Name and Last Name */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input type="text" className={`form-control ${errors.firstName ? "is-invalid" : ""}`} id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input type="text" className={`form-control ${errors.lastName ? "is-invalid" : ""}`} id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>

              {/* Second Row: Username and Password */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input type="text" className={`form-control ${errors.username ? "is-invalid" : ""}`} id="username" name="username" value={formData.username} onChange={handleChange} />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" name="password" value={formData.password} onChange={handleChange} />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              {/* Third Row: Email and Mobile Number */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number
                  </label>
                  <input type="text" className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`} id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                  {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                </div>
              </div>

              {/* Fourth Row: Gender and Date of Birth */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select className={`form-select ${errors.gender ? "is-invalid" : ""}`} name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHERS">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input type="date" className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`} id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                  {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                </div>
              </div>

              {/* Upload File Section (only if role is Agent) */}
              {role === "Agent" && (
                <div className="mb-3">
                  <label htmlFor="agentDocument" className="form-label">
                    Upload Document
                  </label>
                  <input type="file" className={`form-control ${errors.agentImage ? "is-invalid" : ""}`} id="agentDocument" name="agentDocument" accept="image/*" onChange={handleFileChange} />
                  {errors.agentImage && <div className="invalid-feedback">{errors.agentImage}</div>}
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary w-50 me-1" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                  Register
                </button>
                <button type="button" className="btn btn-secondary w-50" onClick={() => navigate("/")}>
                  Back To Homepage
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
