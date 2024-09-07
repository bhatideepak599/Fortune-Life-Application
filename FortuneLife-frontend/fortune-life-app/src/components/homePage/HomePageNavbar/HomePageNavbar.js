import React from "react";
import "../HomePageNavbar/HomePageNavbar.css";
import logoImg from "../../../images/fortunelife.png";
import Dropdown from "react-bootstrap/Dropdown";

const HomePageNavbar = () => {
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
                <a href="/customer-dashboard" className="fs-5 nav-link px-2 link-body-emphasis">
                  Customer Home
                </a>
              </li>

              <li className="ms-4 position-relative">
                <button className="fs-5 mt-2 dropdown-toggle" type="button">
                  Popular Insurance Plans
                </button>
              </li>

              <li className="ms-4">
                <a href="/" className="fs-5 nav-link px-2 link-body-emphasis">
                  My Policies
                </a>
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
              <a href="#" className="header-action-link">
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
