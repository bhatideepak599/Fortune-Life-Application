import React, { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../../services/authService";

const ChangePassword = ({ user, onClose }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwords.newPassword) {
      formErrors.newPassword = "New password is required";
    } else if (passwords.newPassword === passwords.oldPassword) {
      formErrors.newPassword = "New Password and Old Password cannot be the same!";
    } else if (!strongPasswordRegex.test(passwords.newPassword)) {
      formErrors.newPassword =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character";
    }

    if (!passwords.confirmPassword) {
      formErrors.confirmPassword = "Confirm password is required";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userDto = {
        username: user.userDto.username,
        password: passwords.newPassword,
        firstName: passwords.oldPassword,
        active: user.userDto.active,
        email: user.userDto.email,
      };
      try {
        const response = await changePassword(userDto);
        if (response) {
          toast.info("Password has been changed.");
          onClose();
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '20px',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  const passwordWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const eyeIconStyle = {
    position: 'absolute',
    right: '10px',
    cursor: 'pointer',
    fontSize: '18px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  };

  const submitButtonStyle = {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#009879',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Change Password</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.userDto.username}
            disabled
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.userDto.email}
            disabled
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>Old Password:</label>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            style={inputStyle}
          />
          {errors.newPassword && (
            <div style={errorStyle}>{errors.newPassword}</div>
          )}
        </div>
        <div style={formGroupStyle}>
          <label>Confirm New Password:</label>
          <div style={passwordWrapperStyle}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
            <span onClick={toggleConfirmPasswordVisibility} style={eyeIconStyle}>
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          {errors.confirmPassword && (
            <div style={errorStyle}>{errors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" style={submitButtonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
