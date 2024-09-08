import React from "react";
import CustomerReport from "./customerReport/CustomerReport";
import CommissionSettings from "./commissionSettings/CommissionSettings";
import AddEmployeeOrAgent from "./addEmployeeOrAgent/AddEmployeeOrAgent";
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
      case "Manage Insurance Plans & Schemes":
        return <CommissionSettings />;
      case 'Add Employee and Agent':
        return <AddEmployeeOrAgent />;
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
