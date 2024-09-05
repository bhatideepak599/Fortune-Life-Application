import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = ({ activeItem, onItemClick }) => {
  const items = [
    "Manage City/State",
    "Manage Tax and Insurance setting",
    "Add Employee and Agent",
    "Insurance type master",
    "Insurance plan master",
    "Commission settings",
    "Withdrawal approval",
    "Customer report",
    "Agent report",
    "Agent wise commission report",
    "Policy Payment report",
    "Withdrawal report",
    "Commission withdrawal report",
    "Insurance account report",
    "Transaction report",
  ];

  return (
    <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h5 className="text-dark">Admin Actions</h5>
      <ListGroup variant="flush">
        {items.map((item, index) => (
          <ListGroup.Item
            key={index}
            active={item === activeItem}
            onClick={() => onItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            {item}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
