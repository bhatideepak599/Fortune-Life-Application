import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import "./LoginForm.css"; // Import custom styles
import { useLocation } from "react-router-dom";
import { loginAuth } from "../../../services/authService";
import { errorToast, successToast } from "../../../utils/Toast";

const LoginForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "User";
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (!loginId || !password) {
        setError("Please fill in all fields.");
      } else {
        setError("");
        try {
          const username = loginId;
          const response = loginAuth(username, password, role);
          if (response) {
            successToast("Login SuccessFull.");
            console.log("Login Successful:", { loginId, password });
          }
        } catch (error) {
          errorToast(error.response?.data?.message);
        }
      }
    }
    setValidated(true);
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-md-center">
        <Col md={6} className="login-form-col">
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

            <Button variant="primary" type="submit" className="w-100 mt-3 login-button">
              Login
            </Button>
          </Form>

          <div className="d-flex justify-content-between mt-3">
            <a href="#forgot-password" className="text-muted">
              Forget Password?
            </a>
            {role !== "Admin" && role !== "Employee" && (
              <a href="#register" className="text-muted">
                Register
              </a>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
