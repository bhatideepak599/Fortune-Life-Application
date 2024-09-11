import React, { useState, useEffect } from "react";
import "../Navbar/Navbar.css";
import logoImg from "../../../../images/fortunelife.png";
import { useNavigate } from "react-router-dom";
import { getAllInsurancePlans } from "../../../../services/commonService";
import { errorToast } from "../../../../utils/Toast";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";

const Navbar = () => {
  const navigate = useNavigate();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

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

  const handleSignOut = () => {
    try {
      localStorage.clear();
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <>
      <header className="p-3 mb-0">
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
                <a href="/fortuneLife/policy" className="fs-5 nav-link px-2 link-body-emphasis">
                  My Policies
                </a>
              </li>

              <li className="ms-4">
                <a href="/" className="fs-5 nav-link px-2 link-body-emphasis">
                  Contact
                </a>
              </li>
            </ul>

            <div className="dropdown text-end">
              <a href="/" className="mt-4 d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="mdo" width="30" height="30" className="rounded-circle" />
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <a className="dropdown-item edit-profile" onClick={handleEditProfile}>
                    My profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Change Password
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Customer Query
                  </a>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <a className="dropdown-item" href="/" onClick={handleSignOut}>
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
      </header>
    </>
  );
};

export default Navbar;
