import React, { useEffect, useState } from "react";
import { errorToast, warnToast } from "../../../../utils/Toast";
import { getAllStates } from "../../../../services/stateAndCityService";
import { getAllSchemes } from "../../../../services/schemeService";
import { Table, Button, Modal } from "react-bootstrap";

import AddOrRemoveCity from "./addOrRemoveCity/AddOrRemoveCity";
import ViewCities from "./viewCities/ViewCities";
import { verifyUser } from "../../../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import styles from "./ManageCityAndState.module.css";

const ManageCityAndState = () => {
  const [allSchemes, setAllSchemes] = useState([]);
  const [scheme, setScheme] = useState();
  const [showAddCityModal, setShowAddCityModal] = useState(false);
  const [remove, setRemove] = useState(false);
  const [viewCities, setViewCities] = useState(false);
  const [schemeObject, setSchemeObject] = useState();
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const [verify, setVerify] = useState(true);

  useEffect(() => {
    verifyAdmin();
  });
  useEffect(() => {
    if (!verify) {
      warnToast("Login To access this resource!");
      navigate("/");
    }

    fetchAllSchemes();
  }, [flag, verify]);

  const verifyAdmin = async () => {
    const response = await verifyUser(accessToken, "admin");
    console.log(response);
    setVerify(response);
  };

  const fetchAllSchemes = async () => {
    try {
      const response = await getAllSchemes();
      setAllSchemes(response.data);
    } catch (error) {
      // errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  const handleAddCityAndState = (schemeId) => {
    setScheme(schemeId);
    setRemove(false);
    setShowAddCityModal(true);
  };

  const handleRemove = (schemeId) => {
    setRemove(true);
    setScheme(schemeId);
    setShowAddCityModal(true);
  };
  const handleView = (scheme) => {
    setViewCities(true);
    setSchemeObject(scheme);
  };
  const tableStyles = {
    width: "100%",
    maxWidth: "1200px",
    margin: "auto",
  };

  const actionColumnStyles = {
    width: "200px",
    textAlign: "center",
  };

  const buttonGroupStyles = {
    justifyContent: "center",
    gap: "10px", // Adjust space between buttons if needed
  };

  return (
    <>
      <Navbar />
      <div className={styles.schemeContainer}>
        <h2 className="text-center mb-4">City Wise Scheme</h2>

        <Table striped bordered hover style={tableStyles}>
          <thead>
            <tr>
              <th style={actionColumnStyles}>Scheme ID</th>
              <th style={actionColumnStyles}>Scheme Name</th>
              <th style={{ ...actionColumnStyles, textAlign: "center" }}>Cities</th>
              <th style={actionColumnStyles}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allSchemes.map((scheme) => (
              <tr key={scheme.id}>
                <td>{scheme.id}</td>
                <td>{scheme.schemeName}</td>
                <td style={{ textAlign: "center" }}>
                  <a
                    href="#"
                    style={buttonGroupStyles}
                    className="text-primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevents the default anchor behavior
                      handleView(scheme); // Call the handleView function with the scheme
                    }}
                  >
                    View
                  </a>
                </td>
                <td style={actionColumnStyles}>
                  <div style={buttonGroupStyles}>
                    <Button variant="success" className="me-2" onClick={() => handleAddCityAndState(scheme.id)} style={{ backgroundColor: "#1abc9c" }}>
                      Add City
                    </Button>
                    <Button variant="danger" onClick={() => handleRemove(scheme.id)} style={{ backgroundColor: "#FF597B" }}>
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          show={showAddCityModal}
          onHide={() => setShowAddCityModal(false)}
          centered

          //dialogClassName="custom-modal"
          //   style={{ maxWidth: '400px', justifyContent: 'centere'}}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add City to Scheme</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddOrRemoveCity
              scheme={scheme}
              flag={flag}
              setFlag={setFlag}
              remove={remove} // Pass the scheme object correctly
              onClose={() => setShowAddCityModal(false)}
            />
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="secondary" onClick={() => setShowAddCityModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={viewCities} onHide={() => setViewCities(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>All Cities</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ViewCities scheme={schemeObject} onClose={() => setViewCities(false)} />
          </Modal.Body>
          <Modal.Footer className="center-button">
            <Button variant="secondary" onClick={() => setViewCities(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ManageCityAndState;
