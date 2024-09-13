import React, { useState } from "react";
import styles from "./Navbar.module.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import Modal from "../../../sharedComponents/modal/Modal";
import ChangePassword from "../../../sharedComponents/changePassword/ChangePassword";

const Navbar = ({ handleProfileClick, onLogoutClick, user }) => {
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };
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
                      onClick={onLogoutClick}
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
        isOpen={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
      >
        <ChangePassword
          user={user}
          onClose={() => setChangePasswordModal(false)}
        />
      </Modal>
    </>
  );
};

export default Navbar;
