import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { getAdmin, logout } from "../../../../services/authService";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { successToast, errorToast } from "../../../../utils/Toast";
import ManageTaxAndDeductions from "../manageTaxAndDeduction/ManageTaxAndDeductions";
import Modal from "../../../sharedComponents/modal/Modal";
import ChangePassword from "../../../sharedComponents/changePassword/ChangePassword";
import AdminProfile from "../adminprofile/AdminProfile";
import { toast } from "react-toastify";

const Navbar = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [name, setName] = useState("");
  const [taxModal, setTaxModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmin();
  }, [flag]);

  const fetchAdmin = async () => {
    try {
      const response = await getAdmin();
      setAdminDetails(response.data);
      setName(response.data.userDto.firstName);
    } catch (error) {
      errorToast("Failed to fetch admin details.");
    }
  };

  const handleLogout = () => {
    //localStorage.clear()
    logout();
    toast.success("Logged Out.");
    navigate("/");
  };

  const handleTax = () => {
    setTaxModal(true);
  };

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };

  const handleProfile = () => {
    setShowProfileModal(true);
  };

  const handlePlansAndSchemes = () => {
    navigate("/plans-schemes");
  };

  const handleClaimApprovalClick = () => {
    navigate("/claim-approval");
  };

  const handlePolicyClick = () => {
    navigate("/insurance-accounts");
  };

  const handleCityAndStateClick = () => {
    navigate("/city-states");
  };

  const handleViewQuries = () => {
    navigate("/view-queries");
  };

  return (
    <>
      <nav className={styles.agentNavbar}>
        <div className={styles.navLogo}>
          <img src={fortunelife} alt="company-logo" />
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="/admin-dashboard" onClick={()=> {localStorage.setItem("activeItem","null")}}>Home</a>
          </li>
          <li>
            <a href="/view-queries" onClick={handleViewQuries}>
              View Queries
            </a>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a className={styles.dropbtn}>Manage</a>
            <div className={styles.dropdownContent}>
              <a href="#" onClick={handleTax}>
                Manage Tax
              </a>
              <a href="/plans-schemes" onClick={handlePlansAndSchemes}>
                Plans & Schemes
              </a>
              <a href="/city-states" onClick={handleCityAndStateClick}>
                City & States
              </a>
            </div>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a href="#" className={styles.dropbtn}>
              Claim
            </a>
            <div className={styles.dropdownContent}>
              <a href="/claim-approval" onClick={handleClaimApprovalClick}>
                Claims For Approval
              </a>
              <a href="/all-claims">All Claims</a>
              <a href="#">Rejected Claims</a>
            </div>
          </li>
          <li>
            <a href="/insurance-accounts" onClick={handlePolicyClick}>
              Policies
            </a>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a href="#" className={styles.dropbtn}>
              {name}
            </a>
            <div className={styles.dropdownContent}>
              <a href="#" onClick={handleProfile}>
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

      <Modal isOpen={taxModal} onClose={() => setTaxModal(false)} width={"30%"}>
        <ManageTaxAndDeductions onClose={() => setTaxModal(false)} />
      </Modal>

      <Modal isOpen={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
        <ChangePassword user={adminDetails} onClose={() => setChangePasswordModal(false)} />
      </Modal>

      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
        <AdminProfile admin={adminDetails} flag={flag} setFlag={setFlag} onClose={() => setShowProfileModal(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
