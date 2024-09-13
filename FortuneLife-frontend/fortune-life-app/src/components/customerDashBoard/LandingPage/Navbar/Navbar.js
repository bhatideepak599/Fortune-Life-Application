import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import logoImg from "../../../../images/fortunelife-high-resolution-logo-black-transparent.png";
import { useNavigate } from "react-router-dom";
import { getAllInsurancePlans } from "../../../../services/commonService";
import { errorToast } from "../../../../utils/Toast";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { logout } from "../../../../services/authService";
import maleAvatar from "../../../../images/undraw_male_avatar_g98d.svg";
import { toast } from "react-toastify";
import QueryModal from "../../CustomerQueries/QueryModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);

  useEffect(() => {
    if (showDropDown) {
      const fetchInsurancePlans = async () => {
        try {
          const response = await getAllInsurancePlans();
          setInsurancePlans(response);
        } catch (error) {
          errorToast(error);
        }
      };
      fetchInsurancePlans();
    }
  }, [showDropDown, navigate]);

  const handleDropdownClick = () => {
    setShowDropDown((prev) => !prev);
  };

  const handleEditProfile = () => {
    setShowCustomerModal(true);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      errorToast(error);
    }
  };

  const handleMyPolicies = () => {
    navigate("/fortuneLife/policy");
  };

  const handleMyQueries = () => {
    navigate("/fortunrLife/customer/queries");
  };

  const handleCreateQuery = () => {
    setShowQueryModal(true);
  };

  return (
    <>
      <header className="mb-0" style={{ backgroundColor: "#F5F7F8" }}>
        <div className="container p-0">
          <div className="p-0 d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/" className="me-5 d-flex align-items-center mb-0 link-body-emphasis text-decoration-none">
              <img src={logoImg} alt="Company Logo" style={{ width: "250px" }} />
            </a>

            <ul className="ms-5 nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="ms-2">
                <a href="/customer-dashboard" className="fs-5 nav-link px-2 link-body-emphasis">
                  Customer Home
                </a>
              </li>

              <li className="ms-4 position-relative">
                <button className="fs-5 mt-2 dropdown-toggle" type="button" aria-expanded={showDropDown} onClick={handleDropdownClick}>
                  Popular Insurance Plans
                </button>
                {showDropDown && (
                  <ul className="dropdown-menu show position-absolute start-0 mt-2">
                    {insurancePlans.length > 0 ? (
                      insurancePlans
                        .filter((plan) => plan.active)
                        .map((plan, index) => (
                          <li key={index}>
                            <a className="dropdown-item" href={`/fortuneLife/plan/${plan.id}`}>
                              {plan.planName}
                            </a>
                          </li>
                        ))
                    ) : (
                      <li className="dropdown-item">No plans available</li>
                    )}
                  </ul>
                )}
              </li>

              <li className="ms-4">
                <a href="/fortuneLife/policy" className="fs-5 nav-link px-2 link-body-emphasis" onClick={handleMyPolicies}>
                  My Policies
                </a>
              </li>

              <li className="ms-4">
                <a href="/fortunrLife/customer/queries" className="fs-5 nav-link px-2 link-body-emphasis" onClick={handleMyQueries}>
                  My Queries
                </a>
              </li>
            </ul>

            <div className="dropdown text-end">
              <a href="/" className="mt-4 d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={maleAvatar} alt="mdo" width="40" height="40" className="rounded-circle" />
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <a href="#" className="dropdown-item edit-profile" onClick={handleEditProfile}>
                    My profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Change Password
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleCreateQuery}>
                    Query
                  </a>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <a className="dropdown-item" href="#" onClick={handleSignOut}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)}>
          <UserProfile onClose={() => setShowCustomerModal(false)} />
        </Modal>

        <Modal isOpen={showQueryModal} onClose={() => setShowQueryModal(false)}>
          <QueryModal onClose={() => setShowQueryModal(false)} />
        </Modal>
      </header>
    </>
  );
};

export default Navbar;
