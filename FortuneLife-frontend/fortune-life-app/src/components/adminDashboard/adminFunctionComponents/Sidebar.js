import React from "react";
import { ListGroup } from "react-bootstrap";
import styles from "./Sidebar.module.css";

const Sidebar = ({ activeItem, onItemClick }) => {
  const actions = ["Add Employee and Agent", "Withdrawal approval"];
  const reports = ["Customer report", "Agent report", "Agent wise commission report", "Commission withdrawal report"];

  const handleItemClick = (item) => {
    onItemClick(item);
    if (item === "Withdrawal approval" || reports.includes(item)) {
      window.location.reload();
    }
  };

  return (
    <div className={`mt-2 ${styles.sidebarContainer}`}>
      <h5 style={{ fontWeight: 'bold' }}>Admin Actions</h5>

      <ListGroup variant="flush">
        {actions.map((item, index) => (
          <ListGroup.Item key={index} onClick={() => handleItemClick(item)} className={`${styles.listGroupItem} ${item === activeItem ? styles.listGroupItemActive : ""}`}>
            {item}
          </ListGroup.Item>
        ))}

        <h5 className={`mt-3 ${styles.reportsTitle }`} style={{ fontWeight: 'bold' }}>Reports</h5>
        {reports.map((item, index) => (
          <ListGroup.Item key={index} onClick={() => handleItemClick(item)} className={`${styles.listGroupItem} ${item === activeItem ? styles.listGroupItemActive : ""}`} style={{ paddingLeft: "20px" }}>
            {item}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
