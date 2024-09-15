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

const Navbar = () => {
  const navigate = useNavigate();
  const [showEmployeeProfileModal, setShowEmployeeProfileModal] = useState(false);
  const [employee, setEmployee] = useState();
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
  useEffect(()=>{
    
    
  },[employee])

  const fetchEmployee = async () => {
    try {
      const response = await getEmployee();
      setEmployee(response.data)
     
      
      setName(response.data.userDto.firstName);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const updateProfile = async (userDto, addressDto) => {
    let id = userDto.id;
    try {
      const response = await updateEmployee(id, userDto, addressDto);
      //successToast("Profile Updated Successfully");
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
    successToast("Logged Out.");
    navigate("/");
  };
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };
  const handleViewQuries=()=>{
    navigate("/view-queries-employee");
  }
  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-dark bg-dark ${styles.agentNavbar}`}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/employee-dashboard">
            <img
              src={fortunelife}
              alt="company-logo"
              className={styles.logoImage}
              style={{ width: "100px" }}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className={`navbar-nav ms-auto ${styles.navLinks}`}>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/employee-dashboard"
                >
                  Home
                </a>
              </li>
              <li>
            <a href="#" onClick={handleViewQuries}>View Queries</a>
          </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  View Clients
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Policies
                </a>
              </li>
              <li className={`nav-item dropdown ${styles.dropdown}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More
                </a>
                <ul
                  className={`dropdown-menu ${styles.dropdownContent}`}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={handleProfileClick}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleChangePassword}>
                      Change password
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
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
      <Modal
        isOpen={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
      >
        <ChangePassword
          user={employee}
          onClose={() => setChangePasswordModal(false)}
        />
      </Modal>
    </>
  );
};

export default Navbar;
