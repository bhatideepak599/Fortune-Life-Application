import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import "./AddScheme.css";
import {
  errorToast,
  successToast,
  warnToast,
} from "../../../../../utils/Toast";
import { uploadFile } from "../../../../../services/fileServices";
import { addNewSchemeUnderAPlan } from "../../../../../services/schemeService";
import { useNavigate } from "react-router-dom";

const AddScheme = ({ id, change, setChange, onClose }) => {
  const formData = new FormData();
  const [schemeName, setSchemeName] = useState("");
  const [active, setActive] = useState(true);
  const [schemeImage, setSchemeImage] = useState("");
  const [description, setDescription] = useState("");
  const [minAmount, setMinAmount] = useState();
  const [maxAmount, setMaxAmount] = useState();
  const [minInvestmentTime, setMinInvestmentTime] = useState();
  const [maxInvestmentTime, setMaxInvestmentTime] = useState();
  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [profitRatio, setProfitRatio] = useState();
  const navigate = useNavigate();

  const [registrationCommissionRatio, setRegistrationCommissionRatio] =
    useState();
  const [installmentCommissionRatio, setInstallmentCommissionRatio] =
    useState();
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
    
        const fileLocation = await uploadFile(formData);
    
        if (fileLocation && fileLocation.data) {
          setSchemeImage(fileLocation.data.name);
        } else {
          console.error("File upload failed or no data received.");
        }
      }
    };
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await uploadFile(formData);

      const newScheme = {
        schemeName,
        active,
        schemeDetailsId: 0,
        schemeImage,
        description,
        minAmount,
        maxAmount,
        minInvestmentTime,
        maxInvestmentTime,
        minAge,
        maxAge,
        profitRatio,
        registrationCommissionRatio,
        installmentCommissionRatio,
        documents,
      };
    } catch (error) {
      warnToast(error.response?.data?.message);
    }
    const newScheme = {
      schemeName,
      active,
      schemeDetailsId: 0,
      schemeImage,
      description,
      minAmount,
      maxAmount,
      minInvestmentTime,
      maxInvestmentTime,
      minAge,
      maxAge,
      profitRatio,
      registrationCommissionRatio,
      installmentCommissionRatio,
      documents,
    };

    try {
      const response = addNewSchemeUnderAPlan(id, newScheme);
      if (response) {
        successToast("Scheme Added Successfully.");
       

        onClose();
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
    setChange(!change);
  };
  const [documents, setDocuments] = useState([]);

  const availableDocuments = [
    "Aadhar Card",
    "PAN Card",
    "Voter ID",
    "Passport",
    "Other Government Verified Document",
  ];

  const handleDocumentChange = (index, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].documentName = value;
    setDocuments(updatedDocuments);
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { documentName: "" }]);
  };
  const getAvailableOptions = (index) => {
    const selectedDocuments = documents
      .map((doc, i) => (i === index ? null : doc.documentName))
      .filter((doc) => doc);

    return availableDocuments.filter((doc) => !selectedDocuments.includes(doc));
  };

  return (
    <Container>
      <h2>Add New Scheme</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formSchemeName">
              <Form.Label>Scheme Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter scheme name"
                value={schemeName}
                onChange={(e) => setSchemeName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formActiveStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={active}
                onChange={(e) => setActive(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formSchemeImage">
          <Form.Label>Scheme Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {schemeImage && (
            <div className="mt-3">
              <Image src={schemeImage} thumbnail />
            </div>
          )}
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter scheme description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formMinAmount">
              <Form.Label>Minimum Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum amount"
                value={minAmount}
                required
                onChange={(e) => setMinAmount(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMaxAmount">
              <Form.Label>Maximum Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter maximum amount"
                value={maxAmount}
                required
                onChange={(e) => setMaxAmount(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formMinInvestmentTime">
              <Form.Label>Minimum Investment Time (Years)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum investment time"
                value={minInvestmentTime}
                required
                onChange={(e) => setMinInvestmentTime(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMaxInvestmentTime">
              <Form.Label>Maximum Investment Time (Years)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter maximum investment time"
                value={maxInvestmentTime}
                required
                onChange={(e) => setMaxInvestmentTime(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formMinAge">
              <Form.Label>Minimum Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum age"
                value={minAge}
                required
                onChange={(e) => setMinAge(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formMaxAge">
              <Form.Label>Maximum Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter maximum age"
                value={maxAge}
                required
                onChange={(e) => setMaxAge(Number(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formProfitRatio">
              <Form.Label>Profit Ratio (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter profit ratio"
                value={profitRatio}
                required
                onChange={(e) => setProfitRatio(Number(e.target.value))}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formRegistrationCommissionRatio">
              <Form.Label>Registration Commission Amount</Form.Label>
              <Form.Control
                type="number"
                step="500"
                placeholder="Enter Registration Commission Amount"
                value={registrationCommissionRatio}
                required
                onChange={(e) =>
                  setRegistrationCommissionRatio(Number(e.target.value))
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formInstallmentCommissionRatio">
          <Form.Label>Installment Commission Ratio (%)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter installment commission ratio"
            value={installmentCommissionRatio}
            required
            onChange={(e) =>
              setInstallmentCommissionRatio(Number(e.target.value))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Documents</Form.Label>
          {documents.map((doc, index) => (
            <Row key={index} className="mb-2">
              <Col>
                <Form.Control
                  as="select"
                  value={doc.documentName || ""}
                  onChange={(e) => handleDocumentChange(index, e.target.value)}
                  required
                  className="custom-select-dropdown"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {getAvailableOptions(index).map((docName, idx) => (
                    <option key={idx} value={docName}>
                      {docName}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col xs="auto">
                <Button
                  variant="danger"
                  onClick={() => handleRemoveDocument(index)}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
          <div className="text-center mt-3">
            <Button variant="success" onClick={handleAddDocument}>
              Add Document
            </Button>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Save Scheme
        </Button>
      </Form>
    </Container>
  );
};

export default AddScheme;
