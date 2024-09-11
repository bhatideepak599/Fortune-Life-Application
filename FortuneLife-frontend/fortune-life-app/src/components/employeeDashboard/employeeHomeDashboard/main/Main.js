import React, { useEffect, useState } from "react";
import "./Main.css";
import { FaUserPlus, FaShoppingCart, FaMoneyCheckAlt } from "react-icons/fa";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { useNavigate } from "react-router-dom";
import { getEmployee, updateEmployee, validateEmployee } from "../../../../services/employeeService";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import { logout } from "../../../../services/authService";
import AddAgent from "../../agent/AddAgent";
import Navbar from "../navbar/Navbar";

const Main = () => {
    const navigate = useNavigate();
    const [addAgentModal, setAddAgentModal] = useState(false);
    const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [name, setName] = useState("");
    const accessToken = localStorage.getItem("accessToken");
  
    useEffect(() => {
      if (!validateEmployee(accessToken)) {
        warnToast("Unauthorized Access! Login First");
        navigate("/");
        return;
      }
      fetchEmployee();
    }, [navigate]);
  
    const fetchEmployee = async () => {
      try {
        const response = await getEmployee();
        setName(response.data.userDto.firstName);
      } catch (error) {
        errorToast(error.response?.data?.message);
      }
    };
  
    const updateProfile = async (userDto, addressDto) => {
      let id = userDto.id;
      try {
        const response = await updateEmployee(id, userDto, addressDto);
        successToast("Profile Updated Successfully");
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
  
    const handleLogout = () => {
      logout();
      successToast("Logged Out.");
      navigate("/");
    };
  

  return (<> 
  <Navbar
  handleProfileClick={handleProfileClick}
  onLogoutClick={handleLogout}
  />
    <div className="agent-main-section">
      <div className="card">
        <div className="card-icon">
          <FaUserPlus size={40} />
        </div>
        <h3>Agent Registration</h3>
          <p>Register a new agent to the company.</p>
        <button className="card-btn" onClick={handleAddAgentClick}>
            Register Agent
          </button>
        </div>

      <div className="card">
        <div className="card-icon">
          <FaShoppingCart size={40} />
          </div>
          <h3>Manage Profile</h3>
          <p>Update and manage your profile details.</p>
          <button className="card-btn" onClick={handleProfileClick}>
            Manage Profile
          </button>
        </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Edit Customer Details</h3>
          <p>Edit and update customer details.</p>
          <button className="card-btn" onClick={handleEditCustomer}>
            Edit Customer
          </button>
        </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>View Commission Reports</h3>
          <p>View reports on agent commissions.</p>
          <button className="card-btn" onClick={handleViewCommissionReport}>
            View Reports
          </button>
        </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Dummy</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Dummy</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <Modal isOpen={addAgentModal} onClose={() => setAddAgentModal(false)}>
        <AddAgent onClose={() => setAddAgentModal(false)} />
      </Modal>

      <Modal
        isOpen={showEmployeeProfileModal}
        onClose={() => setShowEmployeeProfileModal(false)}
      >
        <UserProfile
          isUpdate={isUpdate}
          updateProfile={updateProfile}
          onClose={() => setShowEmployeeProfileModal(false)}
        />
      </Modal>
    </div>
    </>
  );
};

export default Main;
