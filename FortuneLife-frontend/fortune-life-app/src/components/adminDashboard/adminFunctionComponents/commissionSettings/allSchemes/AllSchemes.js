import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { errorToast, successToast, warnToast } from "../../../../../utils/Toast";
import { activateScheme, deleteASchemeUnderAPlan, getAllSchemesOfUnderAPlan } from "../../../../../services/schemeService";
import Modal from "../../../../../sharedComponents/modal/Modal";
import ManageCommission from "./manageCommission/ManageCommission";
import { logout } from "../../../../../services/authService";
import AddScheme from "../addScheme/AddScheme";
import Navbar from "../../navbar/Navbar";
import { toast } from "react-toastify";

const AllSchemes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schemeForUpdate, setSchemeForUpdate] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [commissionModal, setCommissionModal] = useState(false);
  const [addSchemeModal, setAddSchemeModal] = useState(false);
  const [change, setChange] = useState(true);

  useEffect(() => {
    fetchAllSchemes();
  }, [commissionModal, navigate, schemeForUpdate, change]);

  const fetchAllSchemes = async () => {
    try {
      const response = await getAllSchemesOfUnderAPlan(id);
      setSchemes(response.data);
    } catch (error) {
      if(error.status!=404)
      toast.error(error.response?.data?.message);
    }
  };

  const handleAddScheme = () => setAddSchemeModal(true);

  const handleView = (scheme) => navigate(`/view-update-scheme/${id}`, { state: { scheme } });

  const handleDelete = async (scheme) => {
    try {
      const response = await deleteASchemeUnderAPlan(id, scheme.id);
      if (response) {
        warnToast("Scheme Deleted.");
        setChange(!change);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  const handleActivate = async (scheme) => {
    try {
      const response = await activateScheme(id, scheme.id);
      if (response) {
        successToast("Scheme Activated.");
        setChange(!change);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
          minHeight: "100vh",
          marginTop: "70px",
        }}
      >
        <Container>
          <Row>
            {schemes && schemes.length > 0 ? (
              schemes.map((scheme) => (
                <Col key={scheme.id} md={4} sm={6} xs={12} className="mb-4">
                  <Card
                    style={{
                      width: "100%",
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s",
                      background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
                      padding: "20px",
                    }}
                    className="hover-zoom"
                  >
                    <Card.Body>
                      <Card.Title
                        style={{
                          fontSize: "1.2rem",
                          color: "#1abc9c",
                          fontWeight: "bold",
                        }}
                      >
                        {scheme.schemeName} <span>📋</span>
                      </Card.Title>
                      {/* <Card.Text style={{ fontSize: "1.1rem", color: "#444" }}>
                        Description: {scheme.schemeDetails.description}
                      </Card.Text> */}
                      <Card.Text style={{ fontSize: "1.1rem", display: "flex", gap: "10px" }}>
                        <strong>Investment Time:</strong> {scheme.schemeDetails.minInvestmentTime} to {scheme.schemeDetails.maxInvestmentTime} Years
                      </Card.Text>
                      <Card.Text style={{ fontSize: "1.1rem", display: "flex", gap: "10px" }}>
                        <strong>Status:</strong> {scheme.active ? <span style={{ color: "green" }}>Active ✅</span> : <span style={{ color: "red" }}>Inactive ❌</span>}
                      </Card.Text>
                      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                        <Button
                          variant="primary"
                          onClick={() => handleView(scheme)}
                          style={{
                            backgroundColor: "#1abc9c",
                            borderColor: "#1abc9c",
                            borderRadius: "8px",
                            padding: "10px 15px",
                          }}
                        >
                          View 🚀
                        </Button>
                        {scheme.active ? (
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(scheme)}
                            style={{
                              backgroundColor: "#FF597B",
                              borderColor: "#FF597B",
                              borderRadius: "8px",
                              padding: "10px 15px",
                            }}
                          >
                            Delete ❌
                          </Button>
                        ) : (
                          <Button
                            variant="warning"
                            onClick={() => handleActivate(scheme)}
                            style={{
                              backgroundColor: "#538392",
                              borderColor: "#538392",
                              color: "white",
                              borderRadius: "8px",
                              padding: "10px 15px",
                            }}
                          >
                            Activate 🔓
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center mb-4">
                <h5>No schemes found.</h5>
              </Col>
            )}

            {/* Add Scheme Card */}
            <Col md={4} sm={6} xs={12} className="mb-4">
              <Card
                style={{
                  width: "100%",
                  border: "2px dashed #007bff",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title style={{ fontSize: "1.8rem", color: "#007bff" }}>Add New Scheme</Card.Title>
                  <Button
                    variant="success"
                    onClick={handleAddScheme}
                    style={{
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                  >
                    + Add Scheme
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal title="Commission and Profit Details" isOpen={commissionModal} onClose={() => setCommissionModal(false)}>
          <ManageCommission scheme={schemeForUpdate} onClose={() => setCommissionModal(false)} setModeloff={setCommissionModal} />
        </Modal>
        <Modal isOpen={addSchemeModal} onClose={() => setAddSchemeModal(false)}>
          <AddScheme id={id} change={change} setChange={setChange} onClose={() => setAddSchemeModal(false)} setModeloff={setAddSchemeModal} />
        </Modal>
      </div>
    </>
  );
};

export default AllSchemes;
