import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import Modal from "../../../sharedComponents/modal/Modal";
import ChangePassword from "../../../sharedComponents/changePassword/ChangePassword";
import { useNavigate } from "react-router-dom";
import { getEmployee, updateEmployee, validateEmployee } from "../../../../services/employeeService";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import { logout } from "../../../../services/authService";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  const [employee, setEmployee] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [name, setName] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const [changePasswordModal, setChangePasswordModal] = useState(false);

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
      setEmployee(response.data);
      setName(response.data.userDto.firstName);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const updateProfile = async (userDto, addressDto) => {
    try {
      const response = await updateEmployee(userDto.id, userDto, addressDto);
      if (response) {
        toast.success("Profile Updated successfully");
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleProfileClick = () => {
    setIsUpdate(true);
    setShowEmployeeProfileModal(true);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged Out.");
    navigate("/");
  };

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };

  const handleViewQuries = () => {
    navigate("/view-queries-employee");
  };

  const handlePolicies = () => {
    navigate("/all-policies");
  };

  return (
    <>
      <nav className={styles.agentNavbar}>
        <a href="/employee-dashboard">
          <img src={fortunelife} alt="company-logo" className={styles.logoImage} />
        </a>
        <ul className={styles.navLinks}>
          <li>
            <a href="/employee-dashboard">Home</a>
          </li>
          <li>
            <a href="#" onClick={handleViewQuries}>
              View Queries
            </a>
          </li>
          <li>
            <a href="/all-policies" onClick={handlePolicies}>
              Policies
            </a>
          </li>
          <li className={styles.dropdown}>
            <a href="#">{name}</a>
            <div className={styles.dropdownContent}>
              <a href="#" onClick={handleProfileClick}>
                Profile
              </a>
              <a href="#" onClick={handleChangePassword}>
                Change password
              </a>
              <a href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
      <Modal isOpen={showEmployeeProfileModal} onClose={() => setShowEmployeeProfileModal(false)}>
        <UserProfile isUpdate={isUpdate} updateProfile={updateProfile} onClose={() => setShowEmployeeProfileModal(false)} />
      </Modal>
      <Modal isOpen={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
        <ChangePassword user={employee} onClose={() => setChangePasswordModal(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
