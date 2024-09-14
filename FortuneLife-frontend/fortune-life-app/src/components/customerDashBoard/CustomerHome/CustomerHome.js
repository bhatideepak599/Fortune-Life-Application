import React, { useEffect, useState } from "react";
import "./CustomerHome.css";
import Main from "../LandingPage/Main/Main";
import Footer from "../../sharedComponents/CommonNavbarFooter/Footer";
import Navbar from "../LandingPage/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../../services/authService";
import { toast } from "react-toastify";

function CustomerHome() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "customer");
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

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Main />
      <Footer />
    </>
  );
}

export default CustomerHome;
