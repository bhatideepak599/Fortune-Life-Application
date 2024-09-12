import React, { useState } from "react";
import "./LoginModal.css";
import "react-toastify/dist/ReactToastify.css";
import { loginAuth } from "../../../services/authService";
import { errorToast, successToast } from "../../../utils/Toast";

const LoginModal = ({ onClose }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const UserLogin = async () => {
    try {
      if (!username || !password) {
        errorToast("Please fill in all required fields.", "error");
        return;
      }

      let response = await loginAuth(username, password, "customer");

      if (response) {
        onClose();
        successToast("Login successful!", "success");
      }

      setUserName("");
      setPassword("");
    } catch (error) {
      console.log(error);
      errorToast("Wrong Username Or Password", "error");
    }
  };

  return (
    <>
      <div className="l-container">
        <div className="right-element">
          <div className="box">
            <div className="login-tittle">
              <h1 className="heading">Customer Login </h1>
            </div>
            <div className="login-form">
              <form className="postdata">
                <div className="form-group">
                  <label htmlFor="username"> User Name</label>
                  <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="password"> Password</label>
                  <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="c-button">
                  <button type="button" className="btn btn-primary n-button" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={UserLogin}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginModal;
