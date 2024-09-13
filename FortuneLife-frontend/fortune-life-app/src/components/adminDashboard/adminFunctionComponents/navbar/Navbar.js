import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { getAdmin, logout } from "../../../../services/authService";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { successToast, errorToast } from "../../../../utils/Toast";
import ManageTaxAndDeductions from "../manageTaxAndDeduction/ManageTaxAndDeductions";
import Modal from "../../../sharedComponents/modal/Modal";
import ChangePassword from "../../../sharedComponents/changePassword/ChangePassword";
import AdminProfile from "../adminprofile/AdminProfile";

const Navbar = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [name, setName] = useState("");
  const [taxModal, setTaxModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmin();
  }, []);

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
    logout();
    successToast("Logged Out.");
    navigate("/");
  };
  const handleTax = () => {
    setTaxModal(true);
  };
  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };
  const handleProfile = () => {
    // navigate("/admin-profile", { state: { adminDetails } });
    setShowProfileModal(true);
  };
  const handlePlansAndSchemes = () => {
    navigate("/plans-schemes");
  };
  const handleInsuranceAccouht = () => {
    navigate("/insurance-accounts");
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
  return (
    <>
      <nav className="agent-navbar">
        <div className="nav-logo d-inline">
          <img src={fortunelife} alt="company-logo" width={"20%"} />
        </div>
        <ul className="nav-links">
          <li>
            <a href="/admin-dashboard">Home</a>
          </li>
          <li className="dropdown">
            <a className="dropbtn">Manage</a>
            <div className="dropdown-content">
              <a href="#" onClick={handleTax}>
                Manage Tax
              </a>
              <a href="#" onClick={handlePlansAndSchemes}>
                Plans & Schemes
              </a>
              <a href="#" onClick={handleCityAndStateClick}>
                City & States
              </a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">
              Claim
            </a>
            <div className="dropdown-content">
              <a href="#" onClick={handleClaimApprovalClick}>
                Claims For Approval
              </a>
              <a href="#">All Claims</a>
              <a href="#">Rejected Claims</a>
            </div>
          </li>
          <li>
            <a href="#" onClick={handlePolicyClick}>
              Policies
            </a>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">
              Commission
            </a>
            <div className="dropdown-content">
              <a href="#">Total</a>
              <a href="#">Commission</a>
              <a href="#">Withdrawal</a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">
              {name}
            </a>
            <div className="dropdown-content">
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

      <Modal
        isOpen={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
      >
        <ChangePassword
          user={adminDetails}
          onClose={() => setChangePasswordModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      >
        <AdminProfile
          admin={adminDetails}
          onClose={() => setShowProfileModal(false)}
        />
      </Modal>
    </>
  );
};

export default Navbar;
