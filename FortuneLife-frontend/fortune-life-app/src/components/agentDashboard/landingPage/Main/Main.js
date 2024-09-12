import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Main.module.css"; // Ensure the path is correct
import { FaLightbulb, FaHandsHelping, FaBullhorn, FaSmileBeam, FaRocket, FaHeadset, FaMailBulk, FaUsers } from "react-icons/fa";
import Modal from "../../../../utils/Modals/Modal";
import UserProfile from "../../../sharedComponents/UserProfile/UserProfile";
import Navbar from "../Navbar/Navbar";
import { getLoggedInUser } from "../../../../services/authService";

const Main = () => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const cardDetails = [
    { icon: <FaLightbulb size={50} />, title: "Innovate", description: "Pioneering new ideas and solutions." },
    { icon: <FaHandsHelping size={50} />, title: "Support", description: "Dedicated to assisting you whenever you need." },
    { icon: <FaBullhorn size={50} />, title: "Announcements", description: "Stay informed with the latest news." },
    { icon: <FaSmileBeam size={50} />, title: "Satisfaction", description: "Committed to customer happiness." },
    { icon: <FaRocket size={50} />, title: "Launch", description: "Launching new features and products." },
    { icon: <FaHeadset size={50} />, title: "24/7 Help", description: "Round-the-clock support for all your needs." },
    { icon: <FaMailBulk size={50} />, title: "Newsletter", description: "Subscribe to our regular updates." },
    { icon: <FaUsers size={50} />, title: "Community", description: "Join our growing community." },
  ];

  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    const response = await getLoggedInUser();
    setName(response.firstName + " " + response.lastName);
  };

  return (
    <>
      <Navbar name={name} />
      <div className={styles["agent-main-section"]}>
        {cardDetails.map((card, index) => (
          <div key={index} className={styles["decorative-card"]}>
            <div className={styles["icon-container"]}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
        <Modal isOpen={showCustomerModal} onClose={() => setShowCustomerModal(false)}>
          <UserProfile register={setRegister} save={() => console.log("Save function")} onClose={() => setShowCustomerModal(false)} />
        </Modal>
      </div>
    </>
  );
};

export default Main;
