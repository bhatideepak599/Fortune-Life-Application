import React, { useState } from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
import AddEmployeeOrAgent from "./addEmployeeOrAgent/AddEmployeeOrAgent";
import AgentReport from "./agentReport/AgentReport";
import { useLocation, useNavigate } from "react-router-dom";
import AgentwiseCommissionReport from "./agentwiseCommissionReport/AgentwiseCommissionReport";
import { Withdrawal } from "./withdrawal/Withdrawal";
import { AllWithdrawals } from "./withdrawal/AllWithdrawals";


const MainContent = ({ activeItem, show, setShow }) => {
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const location = useLocation();
  const renderSection = () => {
    const queryParams = new URLSearchParams();
    switch (activeItem) {
      case "Customer report":
        queryParams.set("activeItem", "Customer report");
        return <CustomerReport />;

      case "Agent report":
        queryParams.set("activeItem", "Agent report");
        return <AgentReport />;
      case "Manage Insurance Plans & Schemes":
        queryParams.set("activeItem", "Manage Insurance Plans & Schemes");
        return <CommissionSettings />;
      case "Add Employee and Agent":
        queryParams.set("activeItem", "Add Employee and Agent");
        return <AddEmployeeOrAgent />;

      case "Agent wise commission report":
        return <AgentwiseCommissionReport />;
      case "Withdrawal approval":
        return <Withdrawal />;
        case "Commission withdrawal report":
        return <AllWithdrawals/>;
      default:
        return <h2>Select a section</h2>;
    }
  };

  return <div>{renderSection()}</div>;
};

export default MainContent;
