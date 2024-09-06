import React from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
// Import other components here
// import AgentReport from './AgentReport';
// import InsurancePlanMaster from './InsurancePlanMaster';
// import WithdrawalApproval from './WithdrawalApproval';
// import TransactionReport from './TransactionReport';

const MainContent = ({ activeItem }) => {
  const renderSection = () => {
    switch (activeItem) {
      case "Customer report":
        return <CustomerReport />;
      case "Commission settings":
        return <CommissionSettings  />;
      // Add cases for other components here
      case "Manage Insurance Plans & Schemes":
        return <CommissionSettings />;
      // case 'Insurance plan master':
      //   return <InsurancePlanMaster />;
      // case 'Withdrawal approval':
      //   return <WithdrawalApproval />;
      // case 'Transaction report':
      //   return <TransactionReport />;
      default:
        return <h2>Select a section</h2>;
    }
  };

  return <div>{renderSection()}</div>;
};

export default MainContent;
