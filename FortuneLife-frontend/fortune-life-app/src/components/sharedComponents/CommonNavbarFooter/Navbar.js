import React from "react";
import "../CommonNavbarFooter/Navbar.css";
import logoImg from "../../../images/fortunelife-high-resolution-logo-black-transparent.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <header className="p-3 mb-0" style={{backgroundColor : "#E9EFEC"}}>
        <div className="container p-0 d-flex justify-content-between align-items-center">
          <button type="button" onClick={handleBack} className="btn p-0">
            <ion-icon name="play-back" style={{ fontSize: "25px" }}></ion-icon>
          </button>

          <a href="/" className="d-flex align-items-center mb-0 link-body-emphasis text-decoration-none">
            <img src={logoImg} alt="Company Logo" style={{ width: "250px" }} />
          </a>

          <button
            type="button"
            onClick={() => {
              navigate(+1);
            }}
            className="btn p-0"
          >
            <ion-icon name="play-forward" style={{ fontSize: "25px" }}></ion-icon>
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
