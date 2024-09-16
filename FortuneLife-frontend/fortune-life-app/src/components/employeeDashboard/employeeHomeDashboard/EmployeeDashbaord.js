import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployee, validateEmployee } from "../../../services/employeeService";
import { errorToast, warnToast } from "../../../utils/Toast";
import "./EmployeeDashboard.module.css";

import Footer from "../../sharedComponents/CommonNavbarFooter/Footer";
import Main from "./main/Main";
import Navbar from "./navbar/Navbar";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!validateEmployee(accessToken)) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
      return;
    }
    fetchEmployee();
  }, [navigate, accessToken]);

  const fetchEmployee = async () => {
    try {
      const response = await getEmployee();
      setName(response.data.userDto.firstName);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />
      <Main />
      <Footer />
    </>
  );
};

export default EmployeeDashboard;
