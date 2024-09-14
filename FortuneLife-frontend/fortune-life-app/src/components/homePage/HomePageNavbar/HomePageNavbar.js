import React, { useEffect, useState } from "react";
import logoImg from "../../../images/fortunelife.png";
import { getAllInsurancePlans } from "../../../services/commonService";
import { errorToast } from "../../../utils/Toast";
import { useNavigate } from "react-router-dom";
import "./HomePageNavbar.module.css";

const HomePageNavbar = () => {
  const navigate = useNavigate();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);

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

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <>
      <header className="customer-navbar customer-fixed-top bg-white">
        <div className="customer-nav-container container p-0">
          <div className="customer-navbar-brand me-4">
            <a href="/" className="link-body-emphasis text-decoration-none">
              <img src={logoImg} alt="Company Logo" style={{ width: "150px" }} />
            </a>
          </div>

          <div className="customer-collapsed">
            <ul className="customer-navbar-left d-flex">
              <li className="customer-nav-item me-4">
                <a href="/" className="fs-5 customer-nav-link">
                  Home
                </a>
              </li>

              <li className="customer-nav-item position-relative me-4">
                <button className="fs-5 dropdown-toggle customer-nav-link" type="button" aria-expanded={showDropDown} onClick={handleDropdownClick}>
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

              <li className="customer-nav-item">
                <a href="/" className="fs-5 customer-nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="customer-navbar-right d-flex align-items-center">
            <div className="dropdown text-end me-3">
              <a href="/" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Login
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <a className="dropdown-item" href="/login?role=Customer">
                    Login as Customer
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/login?role=Agent">
                    Login as Agent
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/login?role=Employee">
                    Login as Employee
                  </a>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <a className="dropdown-item" href="/login?role=Admin">
                    Login as Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomePageNavbar;
