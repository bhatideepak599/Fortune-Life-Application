import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { useNavigate } from "react-router-dom";
import { getAllInsurancePlans } from "../../../../services/commonService";
import { toast } from "react-toastify";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { getLoggedInUser, logout } from "../../../../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [agent, setAgent] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchAgent();
  }, []);

  useEffect(() => {
    const fetchInsurancePlans = async () => {
      try {
        const response = await getAllInsurancePlans();
        setInsurancePlans(response);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchInsurancePlans();
  }, []);

  const handleEditProfile = () => {
    setShowCustomerModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error);
    }
  };

  const fetchAgent = async () => {
    const response = await getLoggedInUser();

    setName(response.firstName + " " + response.lastName);
    setAgent(response);
  };

  const handleHistoryClick = () => {
    navigate("/commission-history");
  };

  const handleAllWithdrawalsClick = () => {
    navigate("/withdrawal-history");
  };

  return (
    <>
      <nav className={styles.agentNavbar}>
        <div className={styles.navLogo}>
          <img src={fortunelife} alt="company-logo" className={styles.logoImage} />
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="/agent-dashboard">Home</a>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a href="#">Popular Insurance Plans</a>
            <div className={`dropdown-content ${styles.dropdownContent}`}>
              {insurancePlans.length > 0 ? (
                insurancePlans
                  .filter((plan) => plan.active)
                  .map((plan, index) => (
                    <a key={index} href={`/fortuneLife/plan/${plan.id}`}>
                      {plan.planName}
                    </a>
                  ))
              ) : (
                <a>No plans available</a>
              )}
            </div>
          </li>
          <li>
            <a href="#">View Clients</a>
          </li>
          <li>
            <a href="#">Policies</a>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a href="#">Commission</a>
            <div className={`dropdown-content ${styles.dropdownContent}`}>
              <a href="#">Total Commission</a>
              <a href="#" onClick={handleHistoryClick}>
                Commission History
              </a>
              <a href="#" onClick={handleAllWithdrawalsClick}>
                Withdrawal History
              </a>
            </div>
          </li>
          <li className={`dropdown ${styles.dropdown}`}>
            <a href="#">{name}</a>
            <div className={`dropdown-content ${styles.dropdownContent}`}>
              <a href="#" onClick={handleEditProfile}>
                My Profile
              </a>
              <a href="#">Change Password</a>
              <a href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>

      <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)}>
        <UserProfile onClose={() => setShowCustomerModal(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
