import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { useNavigate } from "react-router-dom";
import { getAllInsurancePlans } from "../../../../services/commonService";
import { toast } from "react-toastify";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import { getLoggedInUser, logout } from "../../../../services/authService";
import { getLoggedAgent } from "../../../../services/agentService";
import Amount from "../amount/Amount";
import WithDrawAmount from "../withDrawAmount/WithDrawAmount";
import ChangePassword from "../../../sharedComponents/changePassword/ChangePassword";

const Navbar = () => {
  const navigate = useNavigate();
  const [insurancePlans, setInsurancePlans] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [agent, setAgent] = useState(null);
  const [name, setName] = useState("");

  const [totalModal, setTotalModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

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
    const response = await getLoggedAgent();

    setName(response.userDto.firstName + " " + response.userDto.lastName);
    setAgent(response);
  };
  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };
  const handleHistoryClick = () => {
    navigate("/commission-history");
  };

  const handleAllWithdrawalsClick = () => {
    navigate("/withdrawal-history");
  };
  const handleTotalClick = () => {
    setTotalModal(true);
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
          <li class="dropdown">
            <a href="#" class="dropbtn">
              Commission
            </a>
            <div class="dropdown-content">
              <a href="#" onClick={handleTotalClick}>
                Total{" "}
              </a>
              <a href="/commission-history" onClick={handleHistoryClick}>
                Commission
              </a>
              <a href="/withdrawal-history" onClick={handleAllWithdrawalsClick}>
                Withdrawal
              </a>
            </div>
          </li>
          <li class="dropdown">
            <a href="#" class="dropbtn">
              {name}
            </a>
            <div class="dropdown-content">
              <a href="#" onClick={handleEditProfile}>
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

      <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)}>
        <UserProfile onClose={() => setShowCustomerModal(false)} />
      </Modal>

      <Modal isOpen={totalModal} onClose={() => setTotalModal(false)} width={"30%"}>
        <Amount agent={agent} setWithdrawAmount={setWithdrawAmount} onClose={() => setTotalModal(false)} />
      </Modal>
      <Modal isOpen={withdrawAmount} onClose={() => setWithdrawAmount(false)}>
        <WithDrawAmount agent={agent} onClose={() => setWithdrawAmount(false)} />
      </Modal>
      <Modal isOpen={changePasswordModal} onClose={() => setChangePasswordModal(false)}>
        <ChangePassword user={agent} onClose={() => setChangePasswordModal(false)} />
      </Modal>
    </>
  );
};

export default Navbar;
