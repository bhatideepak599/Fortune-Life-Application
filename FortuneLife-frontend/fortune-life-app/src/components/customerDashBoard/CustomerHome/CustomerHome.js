import React, { useEffect } from "react";
import "./CustomerHome.css";
import Main from "../LandingPage/Main/Main";
import Footer from "../../sharedComponents/CommonNavbarFooter/Footer";
import Navbar from "../LandingPage/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../../services/authService";
import { toast } from "react-toastify";

function CustomerHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!verifyUser(accessToken, "customer")) {
        toast.error("Please Login to access this resource");
        navigate("/");
      }
    } else {
      toast.error("Please Login to access this resource");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Main />
      <Footer />
    </>
  );
}

export default CustomerHome;
