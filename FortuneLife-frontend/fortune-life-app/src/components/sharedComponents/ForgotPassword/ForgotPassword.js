import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendOtp, submitNewPassword } from "../../../services/authService";
import styles from "./ForgotPassowrd.module.css";
import Navbar from "../CommonNavbarFooter/Navbar";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate=useNavigate()
  const [state, setState] = useState({
    userName: "",
    sourceType: "",
    sourceValue: "",
    otpReceived: "",
    password: "",
    confirmPassword: "",
    countryCode: "+1",
  });
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });

    if (e.target.name === "sourceType") {
      setOtpSent(false);
      setState((prevState) => ({
        ...prevState,
        sourceValue: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10,15}$/;
    return regex.test(phoneNumber);
  };

  const handleSendOtp = async () => {
    if (state.sourceType === "email" && !validateEmail(state.sourceValue)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (state.sourceType === "phoneNumber" && !validatePhoneNumber(state.sourceValue)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      const fullPhoneNumber = state.sourceType === "phoneNumber" ? `${state.countryCode} ${state.sourceValue}` : state.sourceValue;

      const message = await sendOtp(state.sourceType, fullPhoneNumber);
      toast.info(message);
      setOtpSent(true);
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
      navigate(-1);
      setStep(1);
      setOtpSent(false);
      setState({
        userName: "",
        sourceType: "",
        sourceValue: "",
        otpReceived: "",
        password: "",
        confirmPassword: "",
        countryCode: "+1",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Forgot Password</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input type="text" className={styles.input} name="userName" value={state.userName} onChange={handleChange} />
          {state.sourceType === "phoneNumber" && (
            <>
              <label className={styles.label}>Mobile Number:</label>
              <div className={styles.inlineGroup}>
                <select className={styles.selectCountryCode} name="countryCode" value={state.countryCode} onChange={handleChange}>
                  <option value="+1">+1 (USA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (India)</option>
                 
                </select>
                <input
                  type="text"
                  className={styles.input}
                  name="sourceValue"
                  placeholder="Mobile Number"
                  value={state.sourceValue}
                  onChange={handleChange}
                />
                <button className={styles.button} onClick={handleSendOtp}>
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
            </>
          )}
          {state.sourceType === "email" && (
            <>
              <label className={styles.label}>Email:</label>
              <div className={styles.inlineGroup}>
                <input
                  type="text"
                  className={styles.input}
                  name="sourceValue"
                  placeholder="Email"
                  value={state.sourceValue}
                  onChange={handleChange}
                />
                <button className={styles.button} onClick={handleSendOtp}>
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
            </>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Send OTP via:</label>
          <select className={styles.select} name="sourceType" value={state.sourceType} onChange={handleChange}>
            <option value="">Select Method</option>
            <option value="email">Email</option>
            <option value="phoneNumber">Mobile Number</option>
          </select>
        </div>
        {state.sourceType && !otpSent && (
          <div className={styles.formGroup}>
            {state.sourceType === "phoneNumber" && (
              <>
                <label className={styles.label}>Mobile Number:</label>
                <div className={styles.inlineGroup}>
                  <select className={styles.selectCountryCode} name="countryCode" value={state.countryCode} onChange={handleChange}>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <input type="text" className={styles.input} name="sourceValue" placeholder="Mobile Number" value={state.sourceValue} onChange={handleChange} />
                  <button className={styles.button} onClick={handleSendOtp} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </>
            )}
            {state.sourceType === "email" && (
              <>
                <label className={styles.label}>Email:</label>
                <div className={styles.inlineGroup}>
                  <input type="text" className={styles.input} name="sourceValue" placeholder="Email" value={state.sourceValue} onChange={handleChange} />
                  <button className={styles.button} onClick={handleSendOtp} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </>
            )}
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
            <button className={styles.button} onClick={handleVerifyOtpAndResetPassword} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
              Reset Password
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
