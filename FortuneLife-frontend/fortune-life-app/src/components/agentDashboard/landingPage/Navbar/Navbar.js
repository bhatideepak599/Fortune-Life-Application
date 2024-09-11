import React from "react";
import "./Navbar.css";
import fortunelife from "../../../../images/fortunelife-high-resolution-logo-white-transparent.png";

const Navbar = ({name,handleHistoryClick}) => {
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
              <a href="#" onClick={handleHistoryClick}>History</a>
              <a href="#" >Total Commission</a>
              <a href="#" >Withdrawal History</a>
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
