import React, { useState } from "react";
import "./Main.css";
import { FaUserPlus, FaShoppingCart, FaMoneyCheckAlt } from "react-icons/fa";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";

const Main = () => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [register, setRegister] = useState(false);

  const handleRegister = () => {
    setRegister(true);
    setShowCustomerModal(true);
  };

  const saveCustomer = (userDto, addressDto) => {
    console.log(userDto + " " + addressDto);
  };

  return (
    <div className="agent-main-section">
      <div className="card">
        <div className="card-icon">
          <FaUserPlus size={40} />
        </div>
        <h3>Customer Registration</h3>
        <p>Register new customers for various insurance policies.</p>
        <button className="card-btn" onClick={handleRegister}>
          Register Now
        </button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaShoppingCart size={40} />
        </div>
        <h3>Buy Policy</h3>
        <p>Purchase new insurance policies for customers.</p>
        <button className="card-btn">Buy Policy</button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Commission Module</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Dummy</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Dummy</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <div className="card">
        <div className="card-icon">
          <FaMoneyCheckAlt size={40} />
        </div>
        <h3>Dummy</h3>
        <p>Manage and view your commission earnings.</p>
        <button className="card-btn">View Commissions</button>
      </div>

      <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)}>
        <UserProfile register={setRegister} save={saveCustomer} onClose={() => setShowCustomerModal(false)} />
      </Modal>
    </div>
  );
};

export default Main;
