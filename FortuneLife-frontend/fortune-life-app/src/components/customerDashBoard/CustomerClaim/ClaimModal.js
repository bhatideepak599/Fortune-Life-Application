import React, { useEffect, useState } from "react";
import { applyForClaim, getClaimByClaimId } from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { getLoggedInUser } from "../../../services/authService";
import { getPolicyByPolicyId } from "../../../services/commonService";
import { getTax } from "../../../services/adminService";

const ClaimModal = ({ policyId, onClose }) => {
  const [claimDto, setClaimDto] = useState({ id: null });
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [claimAmount, setClaimAmount] = useState("");
  const [claimId, setClaimId] = useState(null);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [deductionTax, setDeductionTax] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        if (response) {
          setCurrentUser(response);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load user.");
      }
    };

    getCustomer();
  }, []);

  // Fetch policy data
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        if (response) {
          setCurrentPolicy(response);
          setClaimId(response.claimId);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load policy.");
      }
    };
    fetchPolicyData();
  }, [policyId]);

  // Fetch claim data if claimId exists
  useEffect(() => {
    if (claimId) {
      const fetchClaimData = async () => {
        try {
          const response = await getClaimByClaimId(claimId);
          if (response) {
            setCurrentClaim(response);
          }
        } catch (error) {
          console.error("Failed to load claim:", error);
          toast.error("Failed to load claim.");
        }
      };

      fetchClaimData();
    }
  }, [claimId]);

  // Fetch deduction tax
  useEffect(() => {
    const getDeductionTax = async () => {
      try {
        const response = await getTax();
        if (response) {
          setDeductionTax(response.deductionRate);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load tax rate.");
      }
    };

    getDeductionTax();
  }, []);

  // Calculate claim amount based on policy status and deduction tax
  useEffect(() => {
    if (currentPolicy && deductionTax !== null) {
      if (currentPolicy.policyStatus === "ACTIVE") {
        const finalAmount = currentPolicy.totalAmountPaidTillDate * (deductionTax / 100);
        const claimableAmount = currentPolicy.totalAmountPaidTillDate - finalAmount;
        setClaimAmount(claimableAmount);
      } else if (currentPolicy.policyStatus === "COMPLETE") {
        setClaimAmount(currentPolicy.sumAssured);
      } else {
        setClaimAmount(0);
      }
    }
  }, [currentPolicy, deductionTax]);

  // Update claimDto with id when claimId changes
  useEffect(() => {
    setClaimDto((prevDto) => ({
      ...prevDto,
      id: claimId ? claimId : null, // Set id to claimId or null
      claimAmount, // Ensure claimAmount is included
    }));
  }, [claimId, claimAmount]);

  // Function to apply for a claim
  const claimApply = async () => {
    try {
      if (!currentUser) {
        toast.error("User not logged in.");
        return;
      }

      const customerId = currentUser.id;

      // Prepare the payload with 'id'
      const payload = {
        ...claimDto,
        id: claimDto.id && claimDto.id > 0 ? claimDto.id : null, // Ensure the id is null if it's not a valid ID
        claimAmount, // Ensure claimAmount is included
      };

      console.log("Payload sent to backend:", payload);

      const response = await applyForClaim(customerId, policyId, payload, claimAmount);
      if (response) {
        toast.success("Successfully applied for policy claim");
      }
    } catch (error) {
      console.error("Error in applyForClaim:", error);
      toast.error(error.response?.data?.message || "Failed to apply for claim");
    }
  };

  // Handle input changes
  const handleOnChange = (e) => {
    const { id, value } = e.target;
    setClaimDto((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await claimApply();
      onClose();
    } catch (error) {
      toast.error(error.message || "Submission failed.");
    }
  };

  return (
    <div className="container">
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg w-100 max-w-3xl">
          <div className="d-flex justify-content-center align-items-center mb-4 py-3 rounded-3" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
            <h2 className="display-6 text-white fw-bold">Claim Application</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="claimAmount" className="form-label fw-semibold text-black">
                  Amount (INR)
                </label>
                <input type="text" id="claimAmount" className="form-control rounded-3 p-3 text-black" value={claimAmount} disabled />
              </div>
              <div className="col-md-6">
                <label htmlFor="bankName" className="form-label fw-semibold text-black">
                  Beneficiary Bank
                </label>
                <input type="text" id="bankName" className="form-control rounded-3 p-3 text-black" onChange={handleOnChange} value={claimDto.bankName || ""} required />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label htmlFor="branchName" className="form-label fw-semibold text-black">
                  Branch
                </label>
                <input type="text" id="branchName" className="form-control rounded-3 p-3 text-black" onChange={handleOnChange} value={claimDto.branchName || ""} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="bankAccountNumber" className="form-label fw-semibold text-black">
                  Account Number
                </label>
                <input type="text" id="bankAccountNumber" className="form-control rounded-3 p-3 text-black" onChange={handleOnChange} value={claimDto.bankAccountNumber || ""} required />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label htmlFor="ifscCode" className="form-label fw-semibold text-black">
                  IFSC Code
                </label>
                <input type="text" id="ifscCode" className="form-control rounded-3 p-3 text-black" onChange={handleOnChange} value={claimDto.ifscCode || ""} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="fortuneLifeRemarks" className="form-label fw-semibold text-black">
                  Fortune Life Remarks
                </label>
                <textarea type="text" className="form-control rounded-3 p-3 text-black" placeholder="N/A" value={currentClaim?.remarks || "N/A"} disabled />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-12">
                <label htmlFor="remarks" className="form-label fw-semibold text-black">
                  Customer Remarks
                </label>
                <textarea className="form-control rounded-3 p-3 text-black" id="remarks" rows="4" placeholder="Enter remarks (optional)" onChange={handleOnChange} value={claimDto.remarks || ""}></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button type="submit" className="btn btn-lg rounded-pill px-5" style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
