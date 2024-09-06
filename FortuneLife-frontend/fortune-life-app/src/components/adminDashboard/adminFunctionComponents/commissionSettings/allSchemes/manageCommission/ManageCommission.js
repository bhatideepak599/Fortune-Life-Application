import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { updateCommission } from "../../../../../../services/schemeService";
import { errorToast, successToast } from "../../../../../../utils/Toast";

const ManageCommission = ({ scheme, setModeloff }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    installmentRatio: scheme.schemeDetails.installmentCommissionRatio,
    registrationAmount: scheme.schemeDetails.registrationCommissionAmount,
    profitRatio: scheme.schemeDetails.profitRatio,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCommission(id, scheme.id, formData);
      if (response) {
        successToast("Details Saved.");
        setModeloff(false);
      }

      setIsEditing(false);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formSchemeId">
          <Form.Label>Scheme ID</Form.Label>
          <Form.Control type="text" value={scheme.id} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formSchemeName">
          <Form.Label>Scheme Name</Form.Label>
          <Form.Control type="text" value={scheme.schemeName} readOnly />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formProfitRatio">
          <Form.Label>Profit Ratio</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            name="profitRatio"
            value={formData.profitRatio}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          controlId="formRegistrationCommissionAmount"
        >
          <Form.Label>Registration Commission Amount</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            name="registrationAmount"
            value={formData.registrationAmount}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formInstallmentCommissionRatio">
          <Form.Label>Installment Commission Ratio</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            name="installmentRatio "
            value={formData.installmentRatio}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        {!isEditing ? (
          <Button variant="info" onClick={handleEditClick} className="btn ">
            Update
          </Button>
        ) : (
          <>
            <Button variant="success" onClick={handleSubmit} className="btn ">
              Save Changes
            </Button>
            <Button
              variant="secondary"
              onClick={handleBackClick}
              className="btn gap-2 "
            >
              Back
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default ManageCommission;
