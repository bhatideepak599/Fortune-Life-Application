import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { errorToast, successToast, warnToast } from "../../../../../utils/Toast";
import { activateScheme, deleteASchemeUnderAPlan, getAllSchemesOfUnderAPlan } from "../../../../../services/schemeService";
import Modal from "../../../../sharedComponents/modal/Modal";
import ManageCommission from "./manageCommission/ManageCommission";
import { logout } from "../../../../../services/authService";
import AddScheme from "../addScheme/AddScheme";
import Navbar from "../../navbar/Navbar";

const AllSchemes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schemeForUpdate, setSchemeForUpdate] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [commissionModal, setCommissionModal] = useState(false);
  const [addSchemeModal, setAddSchemeModal] = useState(false);
  const [change, setChange] =useState(true);
    useState(false);
  useEffect(() => {
    fetchAllSchemes();
  }, [commissionModal, navigate,schemeForUpdate,change]);

 

  const fetchAllSchemes = async () => {
    try {
      const response = await getAllSchemesOfUnderAPlan(id);
      setSchemes(response.data);
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  };
  const handleAddScheme = () => {
    setAddSchemeModal(true);
  };
  const handleHome = () => {
    navigate("/admin-dashboard");
  };
  const handleLogout = () => {
    logout();
    successToast("Logged Out.");
    navigate("/");
  };
  const handleClick = (schemeId) => {
    // Handle the scheme ID click event here
    console.log("Manage Scheme ID:", schemeId);
  };
  const handleCommission = (scheme) => {
    setSchemeForUpdate(scheme);
    setCommissionModal(true);
  };
  
 
  const handleView = (scheme) => {
    //console.log("scheme"+scheme.schemeId);
    
    navigate(`/view-update-scheme/${id}`, { state: { scheme } });
   
  };
  const handleDelete=async(scheme)=>{
    try{
      const response=await deleteASchemeUnderAPlan(id,scheme.id);
      if(response){
        warnToast("Scheme Deleted.")
        setSchemeForUpdate((prev) => ({
          ...prev,
          active: false
        }));
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  }
  const handleActivate =async(scheme)=>{
    try{
      const response=await activateScheme(id,scheme.id);
      if(response){
        successToast("Scheme Activated.")
        setSchemeForUpdate((prev) => ({
          ...prev,
          active: true
        }));
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "An error occurred");
    }
  }
  return (
    <>
      <Navbar/>
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
                  <Card style={{ width: "100%" }}>
                    <Card.Body>
                      <Card.Title>{scheme.schemeName}</Card.Title>
                      <Card.Text>
                        Description: {scheme.schemeDetails.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>Investment Time: </strong>
                        {scheme.schemeDetails.minInvestmentTime} to{" "}
                        {scheme.schemeDetails.maxInvestmentTime} Years
                      </Card.Text>
                      <Card.Text>
                        <strong>Status: </strong>
                        {scheme.active ? "Active" : "Inactive"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <div className="d-flex justify-content-start gap-2 mt-1">
                    <Button
                      variant="info"
                      onClick={() => handleView(scheme)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleCommission(scheme)}
                    >
                      Commission
                    </Button>
                   {scheme.active ? <Button
                      variant="danger"
                      onClick={() => handleDelete(scheme)}
                    >
                      Delete
                    </Button> :
                    <Button
                    variant="success"
                    onClick={() => handleActivate(scheme)}
                  >
                    Activate
                  </Button>
                    }
                  </div>
                </Col>
              ))
            ) : (
              <Col xs={12} className="text-center mb-4">
                <h5>No schemes found.</h5>
              </Col>
            )}

            {/* Add Scheme Card */}
            <Col md={4} sm={6} xs={12} className="mb-4">
              <Card style={{ width: "90%", border: "2px dashed #007bff" }}>
                <Card.Body>
                  <Card.Title> Add New </Card.Title>
                  <Card.Text>
                    <strong>Scheme </strong>
                  </Card.Text>
                  <Card.Text>
                    <strong>Under this Plan </strong>
                  </Card.Text>
                  <Card.Text>
                    <strong>Click here</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
              <div className="d-flex justify-content-center gap-2 mt-1">
                <Button variant="success" onClick={handleAddScheme}>
                  +Add Scheme
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal
          title="Commission and Profit Details"
          isOpen={commissionModal}
          onClose={() => setCommissionModal(false)}
        >
          <ManageCommission
            scheme={schemeForUpdate}
            onClose={() => setCommissionModal(false)}
            setModeloff={setCommissionModal}
          />
        </Modal>
        <Modal
          //title="Add New Scheme"
          isOpen={addSchemeModal}
          onClose={() => setAddSchemeModal(false)}
        >
          <AddScheme
            id={id}
            change={change}
            setChange={setChange}
            onClose={() => setAddSchemeModal(false)}
            setModeloff={setAddSchemeModal}
          />
        </Modal>
       
      </div>
    </>
  );
};

export default AllSchemes;
