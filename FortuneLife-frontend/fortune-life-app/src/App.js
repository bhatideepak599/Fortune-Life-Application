import "./App.css";
import { Route, Routes } from "react-router-dom";
import Payment from "./components/Payment/Payment";
import HomePage from "./components/homePage/HomePage";
import LoginForm from "./components/authComponents/loginComponents/LoginForm";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";
import AdminProfile from "./components/adminDashboard/adminFunctionComponents/adminprofile/AdminProfile";
import AllSchemes from "./components/adminDashboard/adminFunctionComponents/commissionSettings/allSchemes/AllSchemes";
import CustomerHome from "./components/customerDashBoard/CustomerHome/CustomerHome";
import InsuranceSchemes from "./components/sharedComponents/InsuranceSchemes/InsuranceSchemes";
import InsuranceSchemeDetails from "./components/sharedComponents/InsuranceSchemes/InsuranceSchemeDetails";
import ViewAndUpdateScheme from "./components/adminDashboard/adminFunctionComponents/commissionSettings/viewAndUpdateScheme/ViewAndUpdateScheme";
import { Withdrawal } from "./components/adminDashboard/adminFunctionComponents/withdrawal/Withdrawal";
import CustomerPolicies from "./components/customerDashBoard/CustomerPolicies/CustomerPolicies";
import PolicyPaymentDetails from "./components/Payment/PolicyPaymentDetails";
import EmployeeDashboard from "./components/employeeDashboard/employeeHomeDashboard/EmployeeDashbaord";
import CustomerReport from "./components/adminDashboard/adminFunctionComponents/customerReport/CustomerReport";
import AgentReport from "./components/adminDashboard/adminFunctionComponents/agentReport/AgentReport";
import CommissionReport from "./components/employeeDashboard/commissionReport/CommissionReport";
import AgentHome from "./components/agentDashboard/AgentHome/AgentHome";
import CommissionHistory from "./components/agentDashboard/landingPage/commissionHistory/CommissionHistory";
import WithdrawalHistory from "./components/agentDashboard/landingPage/withdrawalHistory/WithdrawalHistory";
import RegisterForm from "./components/authComponents/Register/RegisterForm";
import ClaimApproval from "./components/adminDashboard/adminFunctionComponents/claimApproval/ClaimApproval";
import InsuranceAccountReport from "./components/adminDashboard/adminFunctionComponents/insuranceAccountReport/InsuranceAccountReport";
import CommissionSettings from "./components/adminDashboard/adminFunctionComponents/commissionSettings/CommissionSettings";
import ManageCityAndState from "./components/adminDashboard/adminFunctionComponents/manageCityAndState/ManageCityAndState";
import { AllWithdrawals } from "./components/adminDashboard/adminFunctionComponents/withdrawal/AllWithdrawals";
import CustomerQueries from "./components/customerDashBoard/CustomerQueries/CustomerQueries";
import AllClaims from "./components/adminDashboard/adminFunctionComponents/claimApproval/allClaims/AllClaims";
import { AllQueries } from "./components/adminDashboard/adminFunctionComponents/allQueries/AllQueries";
import { AllQueriesForEmployee } from "./components/employeeDashboard/allQueries/AllQueriesForEmployee";
import { ViewClients } from "./components/agentDashboard/landingPage/viewClients/ViewClients";
import ForgotPassword from "./components/sharedComponents/ForgotPassword/ForgotPassword";
import AllPolicies from "./components/employeeDashboard/AllPolicies/AllPolicies";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route exact path="/register" element={<RegisterForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/all-schemes/:id" element={<AllSchemes />} />
        <Route exact path="/customer-dashboard" element={<CustomerHome />} />
        <Route exact path="/policy-payment/:policyId" element={<Payment />} />
        <Route exact path="/view-update-scheme/:planId" element={<ViewAndUpdateScheme />} />
        <Route exact path="/fortuneLife/plan/:planId" element={<InsuranceSchemes />} />
        <Route exact path="/fortuneLife/plan/:planId/scheme-details/:schemeId" element={<InsuranceSchemeDetails />} />
        <Route exact path="/fortuneLife/policy" element={<CustomerPolicies />} />
        <Route exact path="/fortunrLife/customer/queries" element={<CustomerQueries />} />
        <Route exact path="/fortuneLife/policy/:policyId/payment-details" element={<PolicyPaymentDetails />} />
        <Route exact path="/all-withdrawals" element={<Withdrawal />} />
        <Route exact path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route exact path="/all-customers" element={<CustomerReport />} />
        <Route exact path="/all-agents" element={<AgentReport />} />
        <Route exact path="/commission-Report" element={<CommissionReport />} />
        <Route exact path="/agent-dashboard" element={<AgentHome />} />
        <Route exact path="/commission-history" element={<CommissionHistory />} />
        <Route exact path="/withdrawal-history" element={<WithdrawalHistory />} />
        <Route exact path="/claim-approval" element={<ClaimApproval />} />
        <Route exact path="/all-claims" element={<AllClaims />} />
        <Route exact path="/insurance-accounts" element={<InsuranceAccountReport />} />
        <Route exact path="/plans-schemes" element={<CommissionSettings />} />
        <Route exact path="/city-states" element={<ManageCityAndState />} />
        <Route exact path="/all-withDrawals" element={<AllWithdrawals />} />
        <Route exact path="/view-queries" element={<AllQueries />} />
        <Route exact path="/view-queries-employee" element={<AllQueriesForEmployee />} />
        <Route exact path="/view-clients" element={<ViewClients />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/all-policies" element={<AllPolicies />} />
      </Routes>
    </>
  );
}

export default App;
