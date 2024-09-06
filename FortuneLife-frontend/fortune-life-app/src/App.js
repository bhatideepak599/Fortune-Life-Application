import "./App.css";
import { Route, Routes } from "react-router-dom";
import Payment from "./components/Payment/Payment";
import HomePage from "./components/homePage/HomePage";
import LoginForm from "./components/authComponents/loginComponents/LoginForm";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";
import AdminProfile from "./components/adminDashboard/adminFunctionComponents/adminprofile/AdminProfile";
import AllSchemes from "./components/adminDashboard/adminFunctionComponents/commissionSettings/allSchemes/AllSchemes";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/policy-payment" element={<Payment />} />
        <Route path="/all-schemes/:id" element={<AllSchemes />} />
      </Routes>
    </>
  );
}

export default App;
