import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../../../utils/Modals/Modal";
import { getLoggedInUser, logout } from "../../../services/authService";
import { uploadFile } from "../../../services/fileServices";
import "./InsurancePolicy.module.css";
import { getSchemeByPlanId } from "../../../services/commonService";
import { buyNewPolicy, buyNewPolicyByAgent } from "../../../services/CustomerService";
import LoginModal from "../../customerDashBoard/CustomerLogin/LoginModal";
import CustomerRegister from "../../agentDashboard/customerRegistration/CustomerRegister";

const InsurancePolicy = ({ documentNames, onClose }) => {
  const { planId, schemeId } = useParams();
  const [usedScheme, setUsedScheme] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [fileInputs, setFileInputs] = useState({});
  const [isTouched, setIsTouched] = useState(true);
  const [newRegisterModal, setNewRegisterModal] = useState(false);
  const [exCustomerId, setExCustomerId] = useState("");

  const interestFormRef = useRef();
  const nomineeFormRef = useRef();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    policyTerm: "",
    policyAmount: "",
    premiumType: "",
    nominee: "",
    nomineeRelation: "",
  });

  const uploadedDocuments = [];

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        setCurrentUser(response);
      } catch (error) {
        toast.error(error);
      }
    };

    getCustomer();
  }, [navigate]);

  useEffect(() => {
    const fetchSchemeByPlanId = async () => {
      try {
        const response = await getSchemeByPlanId(planId, schemeId);
        setUsedScheme(response);
      } catch (error) {
        toast.error(error);
      }
    };

    fetchSchemeByPlanId();
  }, [planId, schemeId, navigate]);

  const calculateInterest = (e) => {
    e.preventDefault();

    if (!formData.policyTerm || !formData.policyAmount || !formData.premiumType) {
      toast.error("Please enter all required fields.");
      return;
    }

    const parsedNoOfYear = parseFloat(formData.policyTerm);
    const parsedTotalInvestmentAmount = parseFloat(formData.policyAmount);
    const parsedPremiumType = parseFloat(formData.premiumType);

    if (isNaN(parsedNoOfYear) || isNaN(parsedTotalInvestmentAmount) || isNaN(parsedPremiumType)) {
      toast.error("Invalid input. Please enter valid numbers.");
      return;
    }

    const noOfInstallment = (parsedNoOfYear * 12) / parsedPremiumType;
    setInstallmentAmount((parsedTotalInvestmentAmount / noOfInstallment).toFixed());

    const interest = (usedScheme.schemeDetails.profitRatio * parsedTotalInvestmentAmount) / 100;
    setInterestAmount(interest);

    const sum = interest + parsedTotalInvestmentAmount;
    setTotalAmount(sum);
  };

  const handleFileChange = (documentName, event) => {
    const files = event.target.files;
    setFileInputs((prev) => ({
      ...prev,
      [documentName]: files[0],
    }));
  };

  const handleFileUpload = async () => {
    for (const [documentName, file] of Object.entries(fileInputs)) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await uploadFile(formData);

          if (response && response.data) {
            console.log(`File uploaded: ${documentName}`, response.data);

            uploadedDocuments.push({
              documentName,
              documentStatus: "PENDING",
              documentImage: response.data.name,
            });
          } else {
            console.error(`Upload response did not contain data for ${documentName}`, response);
          }
        } catch (error) {
          toast.error("Failed to upload file");
          console.error(`Error uploading file ${documentName}`, error);
        }
      } else {
        console.warn(`No file found for ${documentName}`);
      }
    }

    console.log("Documents to be submitted:", uploadedDocuments);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();

    if (!(await getLoggedInUser())) {
      setIsModalOpen(true);
      return;
    } else if (await getLoggedInUser()) {
      if (localStorage.getItem("role") === "ROLE_CUSTOMER") {
        const response = await getLoggedInUser();
        const today = new Date();
        const birthYear = parseInt(response.dateOfBirth.split("-")[0]);
        const ageInYears = today.getFullYear() - birthYear;
        if (ageInYears < usedScheme.schemeDetails.minAge || ageInYears > usedScheme.schemeDetails.maxAge) {
          toast.error("Person with your age group is not eligible for this scheme");
          onClose();
          return;
        }
      } else if (localStorage.getItem("role") === "ROLE_AGENT") {
        if (exCustomerId === "") {
          setNewRegisterModal(true);
          return;
        }
      } else if (localStorage.getItem("role") === "ROLE_EMPLOYEE") {
        toast.warn("Login with apprpriate credentials");
        await logout();
        navigate("/");
        return;
      } else {
        toast.warn("Login with apprpriate credentials");
        await logout();
        navigate("/");
        return;
      }
    }

    if (!formData.policyTerm || !formData.policyAmount || !formData.premiumType) {
      toast.error("Please enter all required fields.");
      return;
    }

    if (documentNames.length !== Object.keys(fileInputs).length || Object.values(fileInputs).includes(undefined)) {
      toast.error("Please select all the required documents.");
      return;
    }

    await handleFileUpload();

    const dataToSend = {
      premiumType: formData.premiumType,
      policyAmount: formData.policyAmount,
      time: formData.policyTerm,
      premiumAmount: installmentAmount,
      nomineeName: formData.nominee,
      relationStatusWithNominee: formData.nomineeRelation,
      submittedDocumentsDto: uploadedDocuments,
    };

    console.log(dataToSend);

    if (localStorage.getItem("role") === "ROLE_CUSTOMER") {
      const response = await buyNewPolicy({ customerId: currentUser.id, schemeId: usedScheme.id, dataToSend });
      if (response) {
        toast.success("Policy Created Successfully");
        console.log(response);

        // const policyId = response.id;
        // window.open(`/policy-payment/${policyId}`, "_blank");
      }
    } else if (localStorage.getItem("role") === "ROLE_AGENT") {
      const response = await buyNewPolicyByAgent({ customerId: exCustomerId, schemeId: usedScheme.id, agentId: currentUser.id, dataToSend });
      if (response) {
        toast.success("Policy Created Successfully");
        console.log(response);

        const policyId = response.id;
        window.open(`/policy-payment/${policyId}`, "_blank");
      }
    }

    onClose();
    if (localStorage.getItem("role") === "ROLE_CUSTOMER") {
      navigate("/customer-dashboard");
    } else if (localStorage.getItem("role") === "ROLE_AGENT") {
      navigate("/agent-dashboard");
    } else {
      navigate("/");
    }
  };

  if (!usedScheme || !usedScheme.schemeDetails) {
    return <div>Loading...</div>;
  }

  const handleInterestChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNomineeChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleRegister = () => {
    if (localStorage.getItem("role") === "ROLE_AGENT") {
      setIsModalOpen(false);
      setNewRegisterModal(true);
    } else {
      setIsModalOpen(false);
      navigate("/register");
    }
  };

  return (
    <>
      <h1 className="d-grid mx-auto mt-3">
        <span className="badge p-3" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
          Create Policy
        </span>
      </h1>

      <form className="mb-4">
        <div className="mb-3">
          <label className="form-label">Minimum Investment Amount</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.minAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Investment Amount</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.maxAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Minimum Age Limit</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.minAge} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Age Limit</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.maxAge} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Minimum Policy Term</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.minInvestmentTime} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Maximum Policy Term</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.maxInvestmentTime} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Profit Ratio</label>
          <input type="number" className="form-control" value={usedScheme.schemeDetails.profitRatio} disabled />
        </div>
      </form>

      <form className="mb-4" ref={interestFormRef}>
        <div className="mb-3">
          <label className="form-label">Policy Term</label>
          <input type="number" id="policyTerm" className={`form-control ${isTouched && (formData.policyTerm < usedScheme.schemeDetails.minInvestmentTime || formData.policyTerm > usedScheme.schemeDetails.maxInvestmentTime) ? "is-invalid" : ""}`} value={formData.policyTerm} onChange={handleInterestChange} />
          {isTouched && (formData.policyTerm < usedScheme.schemeDetails.minInvestmentTime || formData.policyTerm > usedScheme.schemeDetails.maxInvestmentTime) && (
            <small className="text-danger">
              Policy term must be between {usedScheme.schemeDetails.minInvestmentTime} and {usedScheme.schemeDetails.maxInvestmentTime}.
            </small>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Total Investment Amount</label>
          <input type="number" id="policyAmount" className={`form-control ${isTouched && (formData.policyAmount < usedScheme.schemeDetails.minAmount || formData.policyAmount > usedScheme.schemeDetails.maxAmount) ? "is-invalid" : ""}`} value={formData.policyAmount} onChange={handleInterestChange} />
          {isTouched && (formData.policyAmount < usedScheme.schemeDetails.minAmount || formData.policyAmount > usedScheme.schemeDetails.maxAmount) && (
            <small className="text-danger">
              Investment amount must be between {usedScheme.schemeDetails.minAmount} and {usedScheme.schemeDetails.maxAmount}.
            </small>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Premium Type</label>
          <select className="form-select" id="premiumType" value={formData.premiumType} onChange={handleInterestChange}>
            <option value="">Select Premium Type</option>
            <option value="1">Monthly</option>
            <option value="3">Quarterly</option>
            <option value="6">Half-Yearly</option>
            <option value="12">Yearly</option>
          </select>
        </div>

        <div className="d-grid col-6 mx-auto">
          <button type="button" className="btn btn-primary mt-2" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={calculateInterest}>
            Calculate Interest
          </button>
        </div>
      </form>

      <form className="mb-4" ref={nomineeFormRef}>
        <div className="mb-3">
          <label className="form-label">Premium Amount</label>
          <input type="number" className="form-control" value={installmentAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Interest Amount</label>
          <input type="number" className="form-control" value={interestAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Sum Assured</label>
          <input type="number" className="form-control" value={totalAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Nominee Name</label>
          <input type="text" id="nominee" className="form-control" value={formData.nominee} onChange={handleNomineeChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nominee Relation</label>
          <select className="form-select" id="nomineeRelation" value={formData.nomineeRelation} onChange={handleNomineeChange} disabled={!formData.nominee}>
            <option value="">Select Relation</option>
            <option value="SPOUSE">Spouse</option>
            <option value="CHILD">Child</option>
            <option value="PARENT">Parent</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Documents</label>
          {documentNames.map((docName) => (
            <div key={docName} className="mb-3">
              <label className="form-label">{docName}</label>
              <input type="file" className="form-control" onChange={(e) => handleFileChange(docName, e)} required />
            </div>
          ))}
        </div>
        <div className="d-grid col-6 mx-auto">
          <button type="button" className="btn btn-primary mt-2" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} width="40%" height="40%">
        <div className="text-center">
          <h5>Login Required</h5>
          <p>You need to log in to proceed with the purchase.</p>
          <div className="d-grid gap-4 d-flex justify-content-center mt-5">
            <button type="button" className="btn btn-primary btn-md col-4" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={handleLogin}>
              Login
            </button>
            <button type="button" className="btn btn-secondary btn-md col-4" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} width="40%" height="55%">
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      </Modal>

      <Modal isOpen={newRegisterModal} onClose={() => setNewRegisterModal(false)} width="70%" height="85%">
        <CustomerRegister id={setExCustomerId} onClose={() => setNewRegisterModal(false)} />
      </Modal>
    </>
  );
};

export default InsurancePolicy;
