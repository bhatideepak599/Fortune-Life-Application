import React, { useEffect, useState } from "react";
import Footer from "../../sharedComponents/CommonNavbarFooter/Footer";
import Main from "../landingPage/Main/Main";
import { verifyUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AgentHome = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "agent");
          if (isValid) {
            setIsVerified(true);
          } else {
            toast.error("Please Login to access this resource");
            navigate("/");
          }
        } catch (error) {
          toast.error("Verification failed. Please login again.");
          navigate("/");
        }
      } else {
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
      <Main />
      <Footer />
    </>
  );
};

export default AgentHome;
