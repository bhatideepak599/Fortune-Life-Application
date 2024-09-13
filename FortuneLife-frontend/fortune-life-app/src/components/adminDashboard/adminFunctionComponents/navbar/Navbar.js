import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { getAdmin, logout } from "../../../../services/authService";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { successToast, errorToast } from "../../../../utils/Toast";
const Navbar = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [name, setName] = useState("");
  const [totalModal, setTotalModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmin();
  }, []); // Fetch admin details once on mount

  const fetchAdmin = async () => {
    try {
      const response = await getAdmin();
      setAdminDetails(response.data);
      setName(response.data.user.firstName);
    } catch (error) {
      errorToast("Failed to fetch admin details.");
    }
  };

  const handleLogout = () => {
    logout();
    successToast("Logged Out.");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/admin-profile", { state: { adminDetails } });
  };

  return (
    <>
      <nav className="agent-navbar">
        <div className="nav-logo d-inline">
          <img src={fortunelife} alt="company-logo" width={"20%"} />
        </div>
        <ul className="nav-links">
          <li>
            <a href="/agent-dashboard">Home</a>
          </li>
          <li>
            <a href="#">View Clients</a>
          </li>
          <li>
            <a href="#">Policies</a>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">
              Commission
            </a>
            <div className="dropdown-content">
              <a href="#" onClick={() => setTotalModal(true)}>Total</a>
              <a href="#">Commission</a>
              <a href="#" onClick={() => setWithdrawAmount(true)}>Withdrawal</a>
            </div>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">
              {name}
            </a>
            <div className="dropdown-content">
              <a href="#" onClick={handleProfile}>Profile</a>
              <a href="#">Change password</a>
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          </li>
        </ul>
      </nav>
      
      {/* <Modal isOpen={totalModal} onClose={() => setTotalModal(false)} width={"30%"}>
        <Amount
          agent={adminDetails} // Update this to use the correct agent or admin details
          setWithdrawAmount={setWithdrawAmount}
          onClose={() => setTotalModal(false)}
        />
      </Modal>
      
      <Modal isOpen={withdrawAmount} onClose={() => setWithdrawAmount(false)}>
        <WithDrawAmount
          agent={adminDetails} // Update this to use the correct agent or admin details
          onClose={() => setWithdrawAmount(false)}
        />
      </Modal> */}
    </>
  );
};

export default Navbar;
