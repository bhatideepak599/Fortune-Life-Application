import React, { useEffect } from "react";
import "./CustomerHome.css";
import Main from "../LandingPage/Main/Main";
import Footer from "../LandingPage/Footer/Footer";
import Navbar from "../LandingPage/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../../services/authService";

function CustomerHome() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (!verifyUser(token, "customer")) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  return (
    <>
      <Navbar />
      <Main />
      <Footer />
    </>
  );
}

export default CustomerHome;
