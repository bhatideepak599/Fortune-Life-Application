import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendOtp, submitNewPassword } from "../../../services/authService";
import styles from "./ForgotPassowrd.module.css";

const ForgotPassword = () => {
  const [state, setState] = useState({
    userName: "",
    sourceType: "",
    sourceValue: "",
    otpReceived: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      const message = await sendOtp(state.sourceType, state.sourceValue);
      toast.success(message);
      setStep(2);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyOtpAndResetPassword = async () => {
    if (state.password !== state.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const message = await submitNewPassword(state);
      toast.success(message);
      setStep(1);
      setState({
        userName: "",
        sourceType: "",
        sourceValue: "",
        otpReceived: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Forgot Password</h2>
      <div className={styles.formGroup}>
        <label className={styles.label}>Username:</label>
        <input type="text" className={styles.input} name="userName" value={state.userName} onChange={handleChange} />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Send OTP via:</label>
        <select className={styles.select} name="sourceType" value={state.sourceType} onChange={handleChange}>
          <option value="">Select Method</option>
          <option value="email">Email</option>
          <option value="mobileNumber">Mobile Number</option>
        </select>
      </div>
      {state.sourceType && (
        <div className={styles.formGroup}>
          <label className={styles.label}>{state.sourceType === "email" ? "Email" : "Mobile Number"}:</label>
          <input type="text" className={styles.input} name="sourceValue" value={state.sourceValue} onChange={handleChange} />
          <button className={styles.button} onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>
      )}
      {step === 2 && (
        <div className={styles.formGroup}>
          <label className={styles.label}>OTP:</label>
          <input type="text" className={styles.input} name="otpReceived" value={state.otpReceived} onChange={handleChange} />
          <label className={styles.label}>New Password:</label>
          <input type="password" className={styles.input} name="password" value={state.password} onChange={handleChange} />
          <label className={styles.label}>Confirm New Password:</label>
          <input type="password" className={styles.input} name="confirmPassword" value={state.confirmPassword} onChange={handleChange} />
          <button className={styles.button} onClick={handleVerifyOtpAndResetPassword}>
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
