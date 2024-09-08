import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { addNewPlan } from "../../../../../services/schemeService";
import { errorToast, successToast } from "../../../../../utils/Toast";
import { useNavigate } from "react-router-dom";

function AddPlan({ change , setChange,onClose }) {
  const [planName, setPlanName] = useState("");
  const [active, setActive] = useState(true);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlan = {
      planName,
      active,
    };
    try {
      const response = await addNewPlan(newPlan);
     if(response){
        successToast("New Plan Added")
        setChange(!change)
        onClose();
        
     }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  return (
    <Container>
      <h2 className="text-center">Add New Plan</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPlanName">
          <Form.Label>Plan Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter plan name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formActiveStatus">
          <Form.Label>Plan Status</Form.Label>
          <Form.Control
            as="select"
            value={active}
            onChange={(e) => setActive(e.target.value === "true")}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-center mt-3">
          <Button variant="success" type="submit" size="sm">
            Save Plan
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddPlan;
