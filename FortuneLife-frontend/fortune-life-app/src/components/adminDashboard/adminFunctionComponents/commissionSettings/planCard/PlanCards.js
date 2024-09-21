import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import AddPlan from "../addPlan/AddPlan";
import Modal from "../../../../../sharedComponents/modal/Modal";
import { activatePlan, deleteAPlan } from "../../../../../services/schemeService";
import { errorToast, successToast, warnToast } from "../../../../../utils/Toast";

export const PlanCards = ({ plans, change, setChange, handleClick }) => {
  const [addPlanModal, setAddPlanModal] = useState(false);

  const handleAddPlan = () => {
    setAddPlanModal(true);
  };

  const handleActivate = async (id) => {
    try {
      const response = await activatePlan(id);
      if (response) {
        successToast("Plan Activated.");
        setChange(!change);
      }
    } catch (error) {
      errorToast(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteAPlan(id);
      if (response) {
        warnToast("Plan Deleted.");
        setChange(!change);
      }
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Container>
      <Row>
        {plans.length ? (
          plans.map((plan, index) => (
            <Col key={index} md={4} sm={6} xs={12} className="mb-4">
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
                      fontSize: "1rem",
                      color: "#1abc9c",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {plan.planName} <span>📋</span>
                  </Card.Title>
                  <Card.Text style={{ fontSize: "1.1rem", color: "#444" }}>
                    Plan Id: <strong>{plan.id}</strong>
                  </Card.Text>
                  <Card.Text style={{ fontSize: "1.1rem", display: "flex", gap: "10px" }}>
                    <strong>Status:</strong>{" "}
                    {plan.active ? (
                      <>
                        <span style={{ color: "green" }}>Active ✅</span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: "red" }}>Inactive ❌</span>
                      </>
                    )}
                  </Card.Text>
                  <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                    <Button
                      variant="primary"
                      onClick={() => handleClick(plan.id)}
                      style={{
                        backgroundColor: "#1abc9c",
                        borderColor: "#1abc9c",
                        borderRadius: "8px",
                        padding: "10px 15px",
                      }}
                    >
                      View Schemes 🚀
                    </Button>
                    {plan.active ? (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(plan.id)}
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
                        onClick={() => handleActivate(plan.id)}
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
          <Col>
            <p>No plans available.</p>
          </Col>
        )}
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card style={{ width: "100%", border: "2px dashed #007bff" }}>
            <Card.Body>
              <Card.Title  style={{
                      fontSize: "1rem",
                      color: "#1abc9c",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>Add New Plan</Card.Title>
              <Card.Text>Plan Id: {}</Card.Text>
              <Card.Text>
                <strong>Click here</strong>
              </Card.Text>
              <Button variant="success" onClick={handleAddPlan} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                + Add New Plan
              </Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Modal for Adding a Plan */}
      <Modal isOpen={addPlanModal} onClose={() => setAddPlanModal(false)}>
        <AddPlan
          change={change}
          setChange={setChange}
          scheme={addPlanModal}
          onClose={() => setAddPlanModal(false)}
          setModeloff={setAddPlanModal}
        />
      </Modal>
    </Container>
  );
};

export default PlanCards;
