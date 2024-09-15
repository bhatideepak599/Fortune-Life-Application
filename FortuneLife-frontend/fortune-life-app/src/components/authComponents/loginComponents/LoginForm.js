import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import "./LoginForm.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAuth, verifyUser } from "../../../services/authService";
import { errorToast } from "../../../utils/Toast";

import agent from "../../../images/undraw_meet_the_team_re_4h08.svg";
import admin from "../../../images/undraw_segment_analysis_re_ocsl.svg";
import customer from "../../../images/undraw_personalization_re_grty.svg";
import employee from "../../../images/undraw_working_remotely_re_6b3a.svg";

const LoginForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "User";
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const loggedRole = localStorage.getItem("role");
    if (loggedRole && role.toUpperCase() === loggedRole.substring(5)) {
      if (accessToken && verifyUser(accessToken, role))
        switch (loggedRole) {
          case "ROLE_ADMIN":
            navigate("/admin-dashboard");
            break;

          case "ROLE_EMPLOYEE":
            navigate("/employee-dashboard");
            break;

          case "ROLE_AGENT":
            navigate("/agent-dashboard");
            break;

          case "ROLE_CUSTOMER":
            navigate("/customer-dashboard");
            break;

          default:
            navigate("/");
            break;
        }
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!loginId || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      const response = await loginAuth(loginId, password, role);

      if (response) {
        switch (localStorage.getItem("role")) {
          case "ROLE_ADMIN":
            navigate("/admin-dashboard");
            break;

          case "ROLE_EMPLOYEE":
            navigate("/employee-dashboard");
            break;

          case "ROLE_AGENT":
            navigate("/agent-dashboard");
            break;

          case "ROLE_CUSTOMER":
            navigate("/customer-dashboard");
            break;

          default:
            navigate("/");
            break;
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      errorToast(error.response?.data?.message || "An error occurred.");
    }

    setValidated(true);
  };

  const handleRegister = () => {
    // if(role==="Agent"){
    //   navigate("/register", role)
    // }else if(role==="customer"){
    // }
  };

  const images = {
    Admin: admin,
    Agent: agent,
    Customer: customer,
    Employee: employee,
  };

  const imagePosition = role === "Agent" || role === "Admin" ? "right" : "left";

  return (
    <Container className="login-container mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} className={`my-auto border border-2 order-${imagePosition === "left" ? "1" : "2"}`} style={{ padding: "50px" }}>
          <img src={images[role]} alt={`${role} Login Visual`} style={{ width: "100%", height: "auto", margin: "50px" }} />
        </Col>
        <Col md={6} className={`login-form-col order-${imagePosition === "right" ? "1" : "2"}`} style={{ padding: "50px" }}>
          <h2 className="text-center mt-4">{role} Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="loginId">
              <Form.Label>Email Or Username</Form.Label>
              <Form.Control type="text" placeholder="Enter your Email or Username" value={loginId} onChange={(e) => setLoginId(e.target.value)} required className="input-field" />
              <Form.Control.Feedback type="invalid">Please provide a login ID.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
              <Form.Control.Feedback type="invalid">Please provide a password.</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3 login-button" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
              Login
            </Button>
          </Form>

          <div className="d-flex justify-content-between mt-3">
            <a href="/forgot-password" className="text-muted">
              Forget Password?
            </a>
            {role !== "Admin" && role !== "Employee" && (
              <a href={`/register?role=${role}`} className="text-muted" onClick={handleRegister}>
                Register
              </a>
            )}
            <a href="/" className="text-muted">
            Back To Homepage
          </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
