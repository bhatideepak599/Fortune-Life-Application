import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Navbar,
  Container,
  Row,
  Col,
  Modal,
  Nav,
} from "react-bootstrap";
import { errorToast, successToast } from "../../../../../utils/Toast";
import { logout } from "../../../../../services/authService";
import { fetchFile, uploadFile } from "../../../../../services/fileServices";
import { updateSchemeUnderAPlan } from "../../../../../services/schemeService";

const availableDocuments = [
  "Aadhar Card",
  "PAN Card",
  "Voter ID",
  "Passport",
  "Other Government Verified Document",
];

const ViewAndUpdateScheme = () => {
  const { planId } = useParams();
  const { state } = useLocation();
  const { scheme } = state || {};
  const [isEditable, setIsEditable] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    schemeId: scheme?.id || 0,
    schemeName: scheme?.schemeName || "",
    active: scheme?.active || true,
    schemeDetailsId: scheme?.schemeDetails?.id || 0,
    schemeImage: scheme?.schemeDetails?.schemeImage || "",
    description: scheme?.schemeDetails?.description || "",
    minAmount: scheme?.schemeDetails?.minAmount || 0,
    maxAmount: scheme?.schemeDetails?.maxAmount || 0,
    minInvestmentTime: scheme?.schemeDetails?.minInvestmentTime || 0,
    maxInvestmentTime: scheme?.schemeDetails?.maxInvestmentTime || 0,
    minAge: scheme?.schemeDetails?.minAge || 0,
    maxAge: scheme?.schemeDetails?.maxAge || 0,
    profitRatio: scheme?.schemeDetails?.profitRatio || 0,
    registrationCommissionRatio:
      scheme?.schemeDetails?.registrationCommissionAmount || 0,
    installmentCommissionRatio:
      scheme?.schemeDetails?.installmentCommissionRatio || 0,
    documents: scheme?.schemeDetails?.documents || [],
  });
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [showImage, setShowImage] = useState();
  const [updatedImage, setUpdatedImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (scheme) {
      handleView();
    }
  }, [scheme]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateClick = () => {
    setIsEditable(true);
  };

  const handleSaveChangesClick = async() => {
   
    if(updatedImage!=""){
         setFormData({ ...formData, schemeImage: updatedImage})
         setShowImage(updatedImage)
         setUpdatedImage("")
    }
    console.log("Updated Scheme:", formData);
    setIsEditable(false);

    try{
        const response=await updateSchemeUnderAPlan(planId,formData)
        if(response){
            successToast("Details Updated ")
        }
    }
    catch(error){
        errorToast(error.response?.data?.message);
    }
  };

  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleAddDocumentClick = () => {
    if (
      selectedDocument &&
      !formData.documents.some((doc) => doc.documentName === selectedDocument)
    ) {
      setFormData({
        ...formData,
        documents: [
          ...formData.documents,
          { id: formData.documents.length + 1, documentName: selectedDocument },
        ],
      });
    }
    setShowDocumentModal(false);
  };

  const handleRemoveDocumentClick = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const handleHome = () => {
    navigate('/admin-dashboard');
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
      
        const fileLocation = await uploadFile(formData);
        
   
        //setFormData({ ...formData, schemeImage: fileLocation.data.name });
        setShowImage(URL.createObjectURL(file)); 
        setUpdatedImage(fileLocation.data.name);
        
        console.log('Uploaded file name:', fileLocation.data.name);
      } catch (error) {
        errorToast('Error uploading file.');
        console.error('File upload error:', error);
      }
    }
  };
  
  const handleView = async () => {
    try {
      const imageName = scheme?.schemeDetails?.schemeImage;
      if (imageName) {
        const fileUrl = await fetchFile(imageName);
        setShowImage(fileUrl);
      } else {
        console.warn('No image name found to fetch.');
      }
    } catch (error) {
      errorToast('Error fetching file.');
      console.error('File fetch error:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    successToast("Logged Out.");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="justify-content-between"
        style={{ width: "100%", margin: "0 auto", borderRadius: "5px" }}
      >
        <Container fluid>
          <Button
            variant="outline-light"
            onClick={handleHome}
            className="me-auto"
          >
            Home
          </Button>
          <Navbar.Brand className="mx-auto text-center" href="#schemes">
            Scheme Details
          </Navbar.Brand>
          <Nav>
            <Button
              variant="outline-light"
              onClick={handleLogout}
              className="ms-auto"
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f3f4f6, #af92ca69)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "70px",
        }}
      >
        <Container
          className="p-4 shadow-sm rounded"
          style={{
            maxWidth: "600px",
            background: "white",
            borderRadius: "10px",
          }}
        >
          <figure className="popular-banner">
            {!isEditable ? (
              <img
                src={showImage}
                alt={scheme.schemeName}
                style={{ width: "80%" }}
              />
            ) : (
              <p>Loading image...</p>
            )}
          </figure>
          <Form>
            <Form.Group controlId="schemeId">
              <Form.Label>Scheme ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.schemeId}
                disabled
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="schemeName">
              <Form.Label>Scheme Name</Form.Label>
              <Form.Control
                type="text"
                name="schemeName"
                value={formData.schemeName}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            {isEditable && (
              <Form.Group controlId="imageUpload">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  disabled={!isEditable}
                  style={{ fontSize: "14px", padding: "8px" }}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Scheme"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Form.Group>
            )}

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="minAmount">
              <Form.Label>Min Amount</Form.Label>
              <Form.Control
                type="number"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="maxAmount">
              <Form.Label>Max Amount</Form.Label>
              <Form.Control
                type="number"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="minInvestmentTime">
              <Form.Label>Min Investment Time (months)</Form.Label>
              <Form.Control
                type="number"
                name="minInvestmentTime"
                value={formData.minInvestmentTime}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="maxInvestmentTime">
              <Form.Label>Max Investment Time (months)</Form.Label>
              <Form.Control
                type="number"
                name="maxInvestmentTime"
                value={formData.maxInvestmentTime}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="minAge">
              <Form.Label>Min Age</Form.Label>
              <Form.Control
                type="number"
                name="minAge"
                value={formData.minAge}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="maxAge">
              <Form.Label>Max Age</Form.Label>
              <Form.Control
                type="number"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="documents">
              <Form.Label>Documents</Form.Label>
              {formData.documents.map((doc, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      name={`document_${index}`}
                      value={doc.documentName}
                      disabled
                      style={{ fontSize: "14px", padding: "8px" }}
                    />
                  </Col>
                  <Col xs="auto">
                    {isEditable && (
                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveDocumentClick(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              ))}
              {isEditable && (
                <>
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowDocumentModal(true)}
                  >
                    Add Document
                  </Button>
                </>
              )}
            </Form.Group>

            <Form.Group controlId="profitRatio">
              <Form.Label>Profit Ratio (%)</Form.Label>
              <Form.Control
                type="number"
                name="profitRatio"
                value={formData.profitRatio}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="registrationCommissionRatio">
              <Form.Label>Registration Commission Ratio (%)</Form.Label>
              <Form.Control
                type="number"
                name="registrationCommissionRatio"
                value={formData.registrationCommissionRatio}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group controlId="installmentCommissionRatio">
              <Form.Label>Installment Commission Ratio (%)</Form.Label>
              <Form.Control
                type="number"
                name="installmentCommissionRatio"
                value={formData.installmentCommissionRatio}
                onChange={handleInputChange}
                disabled={!isEditable}
                style={{ fontSize: "14px", padding: "8px" }}
              />
            </Form.Group>

            <div className="mt-3">
              {isEditable ? (
                <Button
                  variant="success"
                  onClick={handleSaveChangesClick}
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="warning"
                  onClick={handleUpdateClick}
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  Update Scheme
                </Button>
              )}
              <Button
                variant="secondary"
                className="ms-2"
                onClick={handleBackClick}
                style={{ fontSize: "14px", padding: "8px 16px" }}
              >
                Back
              </Button>
            </div>
          </Form>
        </Container>
      </div>

      {/* Modal for Adding Document */}
      <Modal
        show={showDocumentModal}
        onHide={() => setShowDocumentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="selectDocument">
            <Form.Label>Select Document</Form.Label>
            <Form.Control
              as="select"
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
            >
              <option value="">-- Select Document --</option>
              {availableDocuments.map((doc, index) => (
                <option key={index} value={doc}>
                  {doc}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDocumentModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleAddDocumentClick}>
            Add Document
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewAndUpdateScheme;
