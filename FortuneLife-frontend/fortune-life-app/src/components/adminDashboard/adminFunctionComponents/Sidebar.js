import React, { useState } from 'react';
import { ListGroup, Collapse } from 'react-bootstrap';

const Sidebar = ({ activeItem, onItemClick }) => {
  const [openReports, setOpenReports] = useState(false);

  const actions = [
    "Manage City/State",
    "Manage Tax and Insurance setting",
    "Add Employee and Agent",
    "Manage Insurance Plans & Schemes",
    "Commission settings",
    "Withdrawal approval",
  ];

  const reports = [
    "Customer report",
    "Agent report",
    "Agent wise commission report",
    "Policy Payment report",
    "Withdrawal report",
    "Commission withdrawal report",
    "Insurance account report",
    "Transaction report",
  ];

  const handleReportsClick = () => setOpenReports(!openReports);

  return (
    <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fff' }}>
      <h5 className="text-dark">Admin Actions</h5>
      <ListGroup variant="flush">
        {actions.map((item, index) => (
          <ListGroup.Item
            key={index}
            active={item === activeItem}
            onClick={() => onItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            {item}
          </ListGroup.Item>
        ))}
        
        <ListGroup.Item
          onClick={handleReportsClick}
          style={{ cursor: 'pointer' }}
        >
          Reports {openReports ? "▲" : "▼"}
        </ListGroup.Item>
        
        <Collapse in={openReports}>
          <div>
            {reports.map((item, index) => (
              <ListGroup.Item
                key={index}
                active={item === activeItem}
                onClick={() => onItemClick(item)}
                style={{ cursor: 'pointer', paddingLeft: '20px' }}
              >
                {item}
              </ListGroup.Item>
            ))}
          </div>
        </Collapse>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
