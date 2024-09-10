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

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/all-schemes/:id" element={<AllSchemes />} />
        <Route exact path="/customer-dashboard" element={<CustomerHome />} />
        <Route exact path="/policy-payment/:policyId" element={<Payment />} />
        <Route exact path="/view-update-scheme/:planId" element={<ViewAndUpdateScheme />} />
        <Route exact path="/fortuneLife/plan/:planId" element={<InsuranceSchemes />} />
        <Route exact path="/fortuneLife/plan/:planId/scheme-details/:schemeId" element={<InsuranceSchemeDetails />} />
        <Route exact path="/fortuneLife/policy" element={<CustomerPolicies />} />
        <Route exact path="/fortuneLife/policy/:policyId/payment-details" element={<PolicyPaymentDetails />} />
        <Route exact path="/all-withdrawals" element={<Withdrawal />} />
      </Routes>
    </>
  );
}

export default App;
