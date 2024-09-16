import React from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
import AddEmployeeOrAgent from "./addEmployeeOrAgent/AddEmployeeOrAgent";
import AgentReport from "./agentReport/AgentReport";
import AgentwiseCommissionReport from "./agentwiseCommissionReport/AgentwiseCommissionReport";
import { Withdrawal } from "./withdrawal/Withdrawal";
import { AllWithdrawals } from "./withdrawal/AllWithdrawals";
import Revenue from "../revenue/Revenue";

const MainContent = ({ activeItem }) => {
  const renderSection = () => {
    switch (activeItem) {
      case "Customer report":
        return <CustomerReport />;
      case "Agent report":
        return <AgentReport />;
      case "Manage Insurance Plans & Schemes":
        return <CommissionSettings />;
      case "Add Employee and Agent":
        return <AddEmployeeOrAgent />;
      case "Agent wise commission report":
        return <AgentwiseCommissionReport />;
      case "Withdrawal approval":
        return <Withdrawal />;
      case "Commission withdrawal report":
        return <AllWithdrawals />;
      default:
        return <Revenue />;
    }
  };

  return <div>{renderSection()}</div>;
};

export default MainContent;
