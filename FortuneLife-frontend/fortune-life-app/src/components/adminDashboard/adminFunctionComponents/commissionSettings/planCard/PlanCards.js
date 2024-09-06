import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import AddPlan from "../addPlan/AddPlan";
import Modal from "../../../../sharedComponents/modal/Modal";


export const PlanCards = ({ plans, handleClick }) => {
  const [addPlanModal,setAddPlanModal]=useState(false)
  const handleAddPlan=()=>{
    setAddPlanModal(true);
  }
  return (
    <Container>
      <Row>
        {plans.map((plan, index) => (
          <Col key={index} md={4} sm={6} xs={12} className="mb-4">
            <Card style={{ width: "100%" }}>
              <Card.Body>
                <Card.Title>{plan.planName}</Card.Title>
                <Card.Text>Plan Id:{plan.id}</Card.Text>
                <Card.Text>
                  <strong>Status : </strong>
                  {plan.active ? "Active" : "In Active"}
                </Card.Text>
                <Button variant="primary" onClick={() => handleClick(plan.id)}>
                  Manage Schemes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))} <Col md={4} sm={6} xs={12} className="mb-4">
        <Card style={{ width: "100%", border: "2px dashed #007bff" }}>
          <Card.Body >
          <Card.Title>Add New Plan </Card.Title>
                <Card.Text>Plan Id:{}</Card.Text>
                <Card.Text>
                  <strong>Click here</strong>
                  {/* {plan.active ? "Active" : "In Active"} */}
                </Card.Text>
            <Button variant="success" onClick={handleAddPlan}>
              + Add New Plan
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Modal
          
          isOpen={addPlanModal}
          onClose={() => setAddPlanModal(false)}
        >
          <AddPlan
            scheme={addPlanModal}
            onClose={() => setAddPlanModal(false)}
            setModeloff={setAddPlanModal}
           
          />
        </Modal> 
    </Container>
  );
};
