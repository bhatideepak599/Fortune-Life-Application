import React, { useEffect, useState } from "react";
import { PlanCards } from "./planCard/PlanCards";
import { errorToast } from "../../../../utils/Toast";
import { getAllPlans } from "../../../../services/schemeService";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col } from "react-bootstrap";

const CommissionSettings = ({setActiveItem}) => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPlans();
  }, [navigate]);

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
    <div
      style={{
        padding: "20px",
        background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-4">All Plans</h1>

      <PlanCards plans={plans} handleClick={handleClick} setActiveItem={setActiveItem} />
      
    </div>
  );
};

export default CommissionSettings;
