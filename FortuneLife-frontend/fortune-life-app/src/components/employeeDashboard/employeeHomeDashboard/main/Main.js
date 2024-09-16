import React, { useEffect, useState } from "react";
import styles from "./Main.module.css"; // Ensure this import path is correct
import { FaUserPlus, FaShoppingCart, FaMoneyCheckAlt } from "react-icons/fa";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { useNavigate } from "react-router-dom";
import { getEmployee, updateEmployee, validateEmployee } from "../../../../services/employeeService";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import { logout } from "../../../../services/authService";
import AddAgent from "../../agent/AddAgent";
import Navbar from "../navbar/Navbar";
import { toast } from "react-toastify";

const Main = () => {
  const navigate = useNavigate();
  const [addAgentModal, setAddAgentModal] = useState(false);
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(true);
  const [employee, setEmployee] = useState();
  const [name, setName] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (!validateEmployee(accessToken)) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
      return;
    }
    fetchEmployee();
  }, [navigate, flag]);

  const fetchEmployee = async () => {
    try {
      const response = await getEmployee();
      setEmployee(response.data);
      setName(response.data.userDto.firstName);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const updateProfile = async (userDto, addressDto) => {
    let id = userDto.id;
    try {
      const response = await updateEmployee(id, userDto, addressDto);
      if (response) {
        toast.success("Profile Updated successfully");
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleAddAgentClick = () => {
    setAddAgentModal(true);
  };

  const handleEditCustomer = () => {
    navigate("/all-customers");
  };

  const handleEditAgent = () => {
    navigate("/all-agents");
  };

  const handleViewCommissionReport = () => {
    navigate("/commission-report");
  };

  const handleProfileClick = () => {
    setIsUpdate(true);
    setShowEmployeeProfileModal(true);
  };

  return (
    <>
      
      <div className={styles["agent-main-section"]}>
        <div className={styles["card"]}>
          <div className={styles["card-icon"]}>
            <FaUserPlus size={40} />
          </div>
          <h3>Agent Registration</h3>
          <p>Register a new agent to the company.</p>
          <button className={styles["card-btn"]} onClick={handleAddAgentClick}>
            Register Agent
          </button>
        </div>

        {/* <div className={styles["card"]}>
          <div className={styles["card-icon"]}>
            <FaShoppingCart size={40} />
          </div>
          <h3>Manage Profile</h3>
          <p>Update and manage your profile details.</p>
          <button className={styles["card-btn"]} onClick={handleProfileClick}>
            Manage Profile
          </button>
        </div> */}

        <div className={styles["card"]}>
          <div className={styles["card-icon"]}>
            <FaMoneyCheckAlt size={40} />
          </div>
          <h3>Edit Customer Details</h3>
          <p>Edit and update customer details.</p>
          <button className={styles["card-btn"]} onClick={handleEditCustomer}>
            Edit Customer
          </button>
        </div>

        <div className={styles["card"]}>
          <div className={styles["card-icon"]}>
            <FaMoneyCheckAlt size={40} />
          </div>
          <h3>View Commission Reports</h3>
          <p>View reports on agent commissions.</p>
          <button className={styles["card-btn"]} onClick={handleViewCommissionReport}>
            View Reports
          </button>
        </div>

        <Modal isOpen={addAgentModal} onClose={() => setAddAgentModal(false)}>
          <AddAgent onClose={() => setAddAgentModal(false)} />
        </Modal>

        <Modal isOpen={showEmployeeProfileModal} onClose={() => setShowEmployeeProfileModal(false)}>
          <UserProfile isUpdate={true} updateProfile={updateProfile} onClose={() => setShowEmployeeProfileModal(false)} />
        </Modal>
      </div>
    </>
  );
};

export default Main;
