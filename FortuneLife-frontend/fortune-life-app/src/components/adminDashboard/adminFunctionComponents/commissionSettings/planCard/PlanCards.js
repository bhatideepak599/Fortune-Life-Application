import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import AddPlan from "../addPlan/AddPlan";
import Modal from "../../../../sharedComponents/modal/Modal";
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
        {plans.map((plan, index) => (
          <Col key={index} md={4} sm={6} xs={12} className="mb-4">
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>{plan.planName}</Card.Title>
                <Card.Text>Plan Id: {plan.id}</Card.Text>
                <Card.Text>
                  <strong>Status : </strong>
                  {plan.active ? "Active" : "In Active"}
                </Card.Text>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button variant="primary" onClick={() => handleClick(plan.id)} style={{ backgroundColor: "#1abc9c" }}>
                    Schemes
                  </Button>
                  {plan.active ? (
                    <Button variant="danger" onClick={() => handleDelete(plan.id)} style={{ backgroundColor: "#FF597B" }}>
                      Delete
                    </Button>
                  ) : (
                    <Button variant="warning" onClick={() => handleActivate(plan.id)} style={{ backgroundColor: "#538392", color: "white" }}>
                      Activate
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col md={4} sm={6} xs={12} className="mb-4">
          <Card style={{ width: "100%", border: "2px dashed #007bff" }}>
            <Card.Body>
              <Card.Title>Add New Plan</Card.Title>
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

      <Modal isOpen={addPlanModal} onClose={() => setAddPlanModal(false)}>
        <AddPlan change={change} setChange={setChange} scheme={addPlanModal} onClose={() => setAddPlanModal(false)} setModeloff={setAddPlanModal} />
      </Modal>
    </Container>
  );
};
