import React, { useEffect, useState } from "react";
import "./Navbar.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";
import { useNavigate } from "react-router-dom";
import { getLoggedInUser } from "../../../../services/authService";

const Navbar = () => {
  const [agent, setAgent] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgent();
  }, []);

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
      <nav class="agent-navbar">
        <div class="nav-logo d-inline">
          <img src={fortunelife} alt="company-logo" width={"20%"} />
        </div>
        <ul class="nav-links">
          <li>
            <a href="/agent-dashboard">Home</a>
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
             
              <a href="#" >Total Commission</a>
              <a href="#" onClick={handleHistoryClick}>Commission</a>
              <a href="#" onClick={handleAllWithdrawalsClick}>Withdrawal</a>
            </div>
          </li>
          <li class="dropdown">
            <a href="#" class="dropbtn">
              {name}
            </a>
            <div class="dropdown-content">
              <a href="#">Profile</a>
              <a href="#">Change password</a>
              <a href="#" >Logout</a>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
