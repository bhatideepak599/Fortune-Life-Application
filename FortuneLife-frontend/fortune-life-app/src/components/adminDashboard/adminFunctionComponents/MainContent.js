import React, { useState } from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
import AddEmployeeOrAgent from "./addEmployeeOrAgent/AddEmployeeOrAgent";
import AgentReport from "./agentReport/AgentReport";
import ManageTaxAndDeductions from "./manageTaxAndDeduction/ManageTaxAndDeductions";
import { Button } from "react-bootstrap";
import Modal from "../../sharedComponents/modal/Modal";
import { useLocation } from "react-router-dom";
import AgentwiseCommissionReport from "./agentwiseCommissionReport/AgentwiseCommissionReport";
// Import other components here
// import AgentReport from './AgentReport';
// import InsurancePlanMaster from './InsurancePlanMaster';
// import WithdrawalApproval from './WithdrawalApproval';
// import TransactionReport from './TransactionReport';

const MainContent = ({ activeItem, show, setShow }) => {
  const handleClose = () => setShow(false);
  const location = useLocation();
  const renderSection = () => {
    const queryParams = new URLSearchParams();
    switch (activeItem) {
      case "Customer report":
        queryParams.set("activeItem","Customer report");
        return <CustomerReport />;

      case "Agent report":
        queryParams.set("activeItem","Agent report");
        return <AgentReport />;
      case "Manage Insurance Plans & Schemes":
        queryParams.set("activeItem","Manage Insurance Plans & Schemes");
        return <CommissionSettings />;
      case "Add Employee and Agent":
        queryParams.set("activeItem","Add Employee and Agent");
        return <AddEmployeeOrAgent />;
      case "Manage Tax and Scheme Deductions":
        queryParams.set("activeItem","Manage Tax and Scheme Deductions");
        return (
          <>
            <Modal isOpen={show} onClose={() => setShow(false)}>
              <ManageTaxAndDeductions onClose={() => setShow(false)} />
            </Modal>
          </>
        );
      case 'Agent wise commission report':
        return <AgentwiseCommissionReport />;
      default:
        return <h2>Select a section</h2>;
    }
  };

  return <div>{renderSection()}</div>;
};

export default MainContent;
