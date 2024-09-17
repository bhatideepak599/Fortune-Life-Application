import React, { useEffect, useState } from "react";
import { applyForClaim, getClaimByClaimId } from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { getLoggedInUser } from "../../../services/authService";
import { getPolicyByPolicyId } from "../../../services/commonService";
import { getTax } from "../../../services/adminService";

const ClaimModal = ({ policyId, onClose }) => {
  const [claimDto, setClaimDto] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPolicy, setCurrentPolicy] = useState(null);
  const [claimAmount, setClaimAmount] = useState("");
  const [claimId, setClaimId] = useState(null);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [deductionTax, setDeductionTax] = useState(null);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        if (response) {
          setCurrentUser(response);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    getCustomer();
  }, []);

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
        }
      };

      fetchClaimData();
    }
  }, [claimId]);

  useEffect(() => {
    const getDeductionTax = async () => {
      try {
        const response = await getTax();
        if (response) {
          setDeductionTax(response.deductionRate);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    getDeductionTax();
  }, [deductionTax]);

  useEffect(() => {
    if (currentPolicy) {
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
  }, [currentPolicy]);

  const claimApply = async () => {
    try {
      const customerId = currentUser.id;
      const response = await applyForClaim(customerId, policyId, claimDto, claimAmount);
      if (response) {
        toast.success("Successfully applied for policy claim");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleOnChange = (e) => {
    const { id, value } = e.target;
    setClaimDto((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await claimApply();
      onClose();
    } catch (error) {
      toast.error(error);
    }
  };

  const isRejected = currentClaim?.claimStatus === "REJECT";

  return (
    <div className="container">
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg w-100 max-w-3xl">
          <div className="d-flex justify-content-center align-items-center mb-4 py-3 rounded-3" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
            <h2 className="display-6 text-white fw-bold">Claim Application</h2>
          </div>

          {isRejected ? (
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="fortuneLifeRemarks" className="form-label fw-semibold text-black">
                  Fortune Life Remarks
                </label>
                <textarea type="text" className="form-control rounded-3 p-3 text-black" placeholder="N/A" value={currentClaim?.remarks || "N/A"} disabled />
              </div>
            </div>
          ) : (
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
                  <label htmlFor="customerRemarks" className="form-label fw-semibold text-black">
                    Customer Remarks
                  </label>
                  <textarea className="form-control rounded-3 p-3 text-black" id="remarks" rows="4" placeholder="Enter remarks (optional)" onChange={handleOnChange}></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <button type="submit" className="btn btn-lg rounded-pill px-5" style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }} disabled={!!currentClaim?.remarks}>
                  Submit Claim
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
