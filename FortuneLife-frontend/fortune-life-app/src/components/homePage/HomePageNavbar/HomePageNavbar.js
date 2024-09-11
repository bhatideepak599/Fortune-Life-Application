import React, { useEffect, useState } from "react";
import logoImg from "../../../images/fortunelife.png";
import { getAllInsurancePlans } from "../../../services/commonService";
import { errorToast } from "../../../utils/Toast";
import { useNavigate } from "react-router-dom";
import "./HomePageNavbar.css";

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

  return (
    <>
      <header className="p-3 mb-3">
        <div className="container p-0">
          <div className="p-0 d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a href="/" className="me-5 d-flex align-items-center mb-0 link-body-emphasis text-decoration-none">
              <img src={logoImg} alt="Company Logo" style={{ width: "250px" }} />
            </a>

            <ul className="ms-5 nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="ms-2">
                <a href="/" className="fs-5 nav-link px-2 link-body-emphasis">
                  Home
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
                <a href="/" className="fs-5 nav-link px-2 link-body-emphasis">
                  Contact
                </a>
              </li>
            </ul>

            <div className="header-actions d-inline-block">
              <div className="dropdown text-end">
                <a href="/" className="mt-4 d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
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
              <a href="/" className="header-action-link">
                Register
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomePageNavbar;
