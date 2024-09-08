import React, { useState } from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
import AddEmployeeOrAgent from "./addEmployeeOrAgent/AddEmployeeOrAgent";
import AgentReport from "./agentReport/AgentReport";
import ManageTaxAndDeductions from "./manageTaxAndDeduction/ManageTaxAndDeductions";
import {  Button } from 'react-bootstrap';
import Modal from "../../sharedComponents/modal/Modal";
// Import other components here
// import AgentReport from './AgentReport';
// import InsurancePlanMaster from './InsurancePlanMaster';
// import WithdrawalApproval from './WithdrawalApproval';
// import TransactionReport from './TransactionReport';

const MainContent = ({ activeItem,show,setShow }) => {
  const handleClose = () => setShow(false);

  const renderSection = () => {
    switch (activeItem) {
      case "Customer report":
        return <CustomerReport />;
        case "Agent report":
        return <AgentReport />;
      case "Manage Insurance Plans & Schemes":
        return <CommissionSettings />;
      case 'Add Employee and Agent':
        return <AddEmployeeOrAgent />;
      case 'Manage Tax and Scheme Deductions':
        return <>
      

      <Modal
        isOpen={show}
        onClose={() => setShow(false)}
      >
        <ManageTaxAndDeductions
          
          onClose={() => setShow(false)}
        />
      </Modal>
      </>;
      // case 'Transaction report':
      //   return <TransactionReport />;
      default:
        return <h2>Select a section</h2>;
    }
  };

  return <div>{renderSection()}</div>;
};

export default MainContent;
