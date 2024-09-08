import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../modal/Modal";
import { getLoggedInUser } from "../../../services/authService";
import { uploadFile } from "../../../services/fileServices";
import "./InsurancePolicy.css";
import { errorToast } from "../../../utils/Toast";
import { getSchemeByPlanId } from "../../../services/commonService";

const InsurancePolicy = ({ documentNames, onClose }) => {
  const { planId, schemeId } = useParams();
  const [usedScheme, setUsedScheme] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [noOfYear, setNoOfYear] = useState("");
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState("");
  const [premiumType, setPremiumType] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [interestAmount, setInterestAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [relationStatusWithNominee, setRelationStatusWithNominee] = useState("");
  const [fileInputs, setFileInputs] = useState({});
  const [submittedDocumentsDto, setSubmittedDocumentsDto] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        setCurrentUser(response);
      } catch (error) {
        errorToast(error);
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
        errorToast(error);
      }
    };

    fetchSchemeByPlanId();
  }, [planId, schemeId, navigate]);

  const calculateInterest = () => {
    if (!noOfYear || !totalInvestmentAmount || !premiumType) {
      toast.error("Please enter all required fields.");
      return;
    }

    const parsedNoOfYear = parseFloat(noOfYear);
    const parsedTotalInvestmentAmount = parseFloat(totalInvestmentAmount);
    const parsedPremiumType = parseFloat(premiumType);

    if (isNaN(parsedNoOfYear) || isNaN(parsedTotalInvestmentAmount) || isNaN(parsedPremiumType)) {
      toast.error("Invalid input. Please enter valid numbers.");
      return;
    }

    const noOfInstallment = (parsedNoOfYear * 12) / parsedPremiumType;
    setInstallmentAmount(parsedTotalInvestmentAmount / noOfInstallment);

    const interest = (parsedNoOfYear * usedScheme.schemeDetails.profitRatio * parsedTotalInvestmentAmount) / 100;
    setInterestAmount(interest);

    const sum = interest + parsedTotalInvestmentAmount;
    setTotalAmount(sum);
    toast.success("Interest Calculated Successfully!");
  };

  const handleFileChange = (documentName, event) => {
    const files = event.target.files;
    setFileInputs((prev) => ({
      ...prev,
      [documentName]: files[0], // Only storing the first file
    }));
  };

  const handleFileUpload = async () => {
    const uploadedDocuments = [];

    for (const [documentName, file] of Object.entries(fileInputs)) {
      if (file) {
        const response = await uploadFile(file);
        uploadedDocuments.push({
          documentName,
          documentStatus: "PENDING",
          documentImage: response.data.name,
        });
      }
    }

    setSubmittedDocumentsDto((prev) => [...prev, ...uploadedDocuments]);
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      setIsModalOpen(true);
      return;
    }

    await handleFileUpload(); // Upload files when clicking Buy Now

    const dataToSend = {
      premiumType,
      policyAmount: totalInvestmentAmount,
      time: noOfYear,
      premiumAmount: installmentAmount,
      nomineeName,
      relationStatusWithNominee,
      submittedDocumentsDto,
    };

    // You can send dataToSend to the backend here
    onClose();
  };

  if (!usedScheme || !usedScheme.schemeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-center mb-4">Create Policy</h1>

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

      <form className="mb-4">
        <div className="mb-3">
          <label className="form-label">No of Years</label>
          <input type="number" className="form-control" onChange={(e) => setNoOfYear(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Investment Amount</label>
          <input type="number" className="form-control" onChange={(e) => setTotalInvestmentAmount(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Premium Type</label>
          <select className="form-select" onChange={(e) => setPremiumType(e.target.value)}>
            <option value="">Select Premium Type</option>
            <option value="1">Monthly</option>
            <option value="3">Quarterly</option>
            <option value="6">Half-Yearly</option>
            <option value="12">Yearly</option>
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={calculateInterest}>
          Calculate Interest
        </button>
      </form>

      <h2 className="mb-3">Interest Calculator</h2>

      <form className="mb-4">
        <div className="mb-3">
          <label className="form-label">Installment Amount</label>
          <input type="number" className="form-control" value={installmentAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Interest Amount</label>
          <input type="number" className="form-control" value={interestAmount} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Amount</label>
          <input type="number" className="form-control" value={totalAmount} disabled />
        </div>
      </form>

      <div className="mb-4">
        {documentNames.map((documentName) => (
          <div key={documentName} className="mb-3">
            <label className="form-label">{documentName}</label>
            <input type="file" className="form-control" onChange={(e) => handleFileChange(documentName, e)} />
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-primary" onClick={handleBuyNow}>
        Buy Now
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Please log in to continue</h2>
        <button onClick={() => navigate("/login")}>Log In</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </Modal>
    </>
  );
};

export default InsurancePolicy;
