import React, { useEffect, useState } from "react";
import { PlanCards } from "./planCard/PlanCards";
import { errorToast } from "../../../../utils/Toast";
import { getAllPlans } from "../../../../services/schemeService";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col } from "react-bootstrap";
import Navbar from "../navbar/Navbar";

const CommissionSettings = ({ setActiveItem }) => {
  const [plans, setPlans] = useState([]);
  const [change, setChange] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPlans();
  }, [navigate, change]);

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();
      setPlans(response.data);
    } catch (error) {
      errorToast(error.response?.data?.message || "Failed to fetch plans");
    }
  };
  const handleClick = (id) => {
    //console.log("id"+plainId);
    navigate(`/all-schemes/${id}`);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
          minHeight: "100vh",
        }}
      >
        <h1 className="text-center mb-4">All Plans</h1>

        <PlanCards plans={plans} change={change} setChange={setChange} handleClick={handleClick} setActiveItem={setActiveItem} />
      </div>
    </>
  );
};

export default CommissionSettings;
