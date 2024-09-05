import "./App.css";
import { Route, Routes } from "react-router-dom";
import Payment from "./components/Payment/Payment";
import HomePage from "./components/homePage/HomePage";
import LoginForm from "./components/authComponents/loginComponents/LoginForm";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";

function App() {
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
        <Route exact path="/policy-payment" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
