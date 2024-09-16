import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Sidebar from "./adminFunctionComponents/Sidebar";
import MainContent from "./adminFunctionComponents/MainContent";
import { getAdmin, logout, verifyUser } from "../../services/authService";
import { errorToast, successToast, warnToast } from "../../utils/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./adminFunctionComponents/navbar/Navbar";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("Manage City/State");
  const [adminDetails, setAdminDetails] = useState(null);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "admin");
          if (isValid) {
            setIsVerified(true);
          } else {
            localStorage.clear();
            toast.error("Please Login to access this resource");
            navigate("/");
          }
        } catch (error) {
          localStorage.clear();
          toast.error("Verification failed. Please login again.");
          navigate("/");
        }
      } else {
        localStorage.clear();
        toast.error("Please Login to access this resource");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  const validateAdmin = () => {
    if (!accessToken || !verifyUser(accessToken, "admin")) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!validateAdmin()) return;

    const savedActiveItem = localStorage.getItem("activeItem");
    const queryParams = new URLSearchParams(location.search);
    const initialActiveItem = queryParams.get("activeItem");

    setActiveItem(initialActiveItem || savedActiveItem || "Manage City/State");
  }, [accessToken, navigate, location.search]);

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);

  const handleChange = (item) => {
    if (item === "Manage Tax and Scheme Deductions") {
      setShow(true);
    } else {
      setShow(false);
    }
    setActiveItem(item);
  };
  if (!isVerified) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f3f4f6, #dcdbe1)",
        }}
      >
        <Container fluid style={{ padding: "20px" }}>
          <Row>
            <Col md={3} style={{ padding: 0 }}>
              <div
                style={{
                  position: "fixed",
                  top: "80px",
                  left: 0,
                  width: "22%",
                  height: "70vh",
                }}
              >
                <Sidebar activeItem={activeItem} onItemClick={handleChange} />
              </div>
            </Col>
            <Col md={{ span: 9, offset: 3 }} style={{ padding: "20px", marginLeft: "22%", marginTop: "-3%" }}>
              {validateAdmin() && <MainContent activeItem={activeItem} show={show} setShow={setShow} setActiveItem={setActiveItem} />}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard;