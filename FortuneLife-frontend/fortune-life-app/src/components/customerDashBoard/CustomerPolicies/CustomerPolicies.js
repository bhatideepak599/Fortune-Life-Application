import React, { useEffect, useState, useRef } from "react";
import { getPoliciesByCustomerId } from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { getLoggedInUser, verifyUser } from "../../../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sanitizedData } from "../../../utils/SanitizeData";
import Pagination from "../../sharedComponents/Pagination/Pagination";
import Modal from "../../../utils/Modals/Modal";
import ClaimModal from "../CustomerClaim/ClaimModal";
import SharedTable from "../SharedTable/SharedTable";
import Navbar from "../LandingPage/Navbar/Navbar";
import { getPolicyByPolicyId } from "../../../services/commonService";
import "./CustomerPolicies.module.css";
import ViewDocumentForm from "./DocumentForm/ViewDocumentForm";

const CustomerPolicies = () => {
  const [sanitizedPolicies, setSanitizedPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedCurrentPolicy, setSelectedCurrentPolicy] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    policyId: urlSearchParams.get("policyId") || "",
    schemeName: urlSearchParams.get("schemeName") || "",
    policyStatus: urlSearchParams.get("policyStatus") || "",
  });

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "customer");
          if (isValid) {
            setIsVerified(true);
          } else {
            localStorage.clear();
            toast.error("Please Login to access this resource");
            navigate("/");
          }
        } catch (error) {
          localStorage.clear();
          toast.error("Verification failed. Please login again.");
          navigate("/");
        }
      } else {
        localStorage.clear();
        toast.error("Please Login to access this resource");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        if (!response) {
          toast.error("Please login to access this resource");
          navigate("/");
        }
        setCurrentUser(response);
      } catch (error) {
        toast.error("Error fetching user details.");
      }
    };

    getCustomer();
  }, [navigate, setCurrentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      const fetchData = async () => {
        if (searchActive) {
          await searchPolicies();
        } else {
          await getAllPolicies();
        }
      };

      fetchData();
    }
  }, [pageNumber, pageSize, searchActive, currentUser]);

  useEffect(() => {
    setUrlSearchParams({
      ...searchParams,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  }, [pageNumber, pageSize, searchParams, setUrlSearchParams]);

  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(0);
    setSearchActive(true);
    setUrlSearchParams({ ...searchParams, pageNumber: "0", pageSize: pageSize.toString() });
    searchPolicies();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      policyId: "",
      schemeName: "",
      policyStatus: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    setUrlSearchParams({ pageNumber: "0", pageSize: "5" });
    getAllPolicies();
  };

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };

  const getAllPolicies = async () => {
    if (!currentUser || !currentUser.id) {
      console.error("User is not defined or doesn't have an ID.");
      return;
    }
    setLoading(true); // Start loading
    try {
      const response = await getPoliciesByCustomerId({
        customerId: currentUser.id,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "schemeName", "premiumAmount", "totalAmountPaidTillDate", "totalPolicyAmount", "issueDate", "maturityDate", "policyStatus", "verified", "claimId", "claimStatus"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });
        console.log(sanitized);
        
        setSanitizedPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const searchPolicies = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getPoliciesByCustomerId({
        ...searchParams,
        customerId: currentUser.id,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "schemeName", "premiumAmount", "totalAmountPaidTillDate", "totalPolicyAmount", "issueDate", "maturityDate", "policyStatus", "verified", "claimId", "claimStatus"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });
        
        setSanitizedPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleClaim = async (policyId) => {
    setSelectedPolicy(policyId);
    setIsClaimModalOpen(true);

    try {
      const response = await getPolicyByPolicyId(policyId);
      if (response) {
        console.log(response);
        setSelectedCurrentPolicy(response);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = (policyId) => {
    navigate(`${policyId}/payment-details`);
  };

  const handleViewRejectedDocs = async (policyId) => {
    setSelectedPolicy(policyId);
    setIsDocumentModalOpen(true);

    try {
      const response = await getPolicyByPolicyId(policyId);
      if (response) {
        console.log(response);
        setSelectedCurrentPolicy(response);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const actions = {
    claim: handleClaim,
    payment: handlePayment,
    view: handleViewRejectedDocs,
  };

  const refetchPolicies = () => {
    getAllPolicies();
  };

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <form className="mb-4" ref={searchRef} onSubmit={handleSearch}>
          <div className="row">
            <div className="col-md-3">
              <input id="policyId" className="form-control" type="text" placeholder="Search by Policy ID" value={searchParams.policyId || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-3">
              <input id="schemeName" className="form-control" type="text" placeholder="Search by Scheme Name" value={searchParams.schemeName || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-3">
              <select id="policyStatus" className="form-control" value={searchParams.policyStatus} onChange={handleSearchChange}>
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="CLAIMED">Claimed</option>
                <option value="COMPLETE">Complete</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                Search
              </button>
              <button type="reset" className="btn btn-secondary ms-2" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </form>

        {sanitizedPolicies.length === 0 ? (
          <div>No policies found.</div>
        ) : (
          <>
            <SharedTable data={sanitizedPolicies} actions={actions} />

            {sanitizedPolicies.length > 0 && (
              <div className="d-flex align-items-center justify-content-between mt-5">
                <Pagination pager={pageObject} onPageChange={onPageChange} />
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false);
            setSelectedCurrentPolicy(null);
          }}
          width="60%"
          height="100%"
        >
          {selectedCurrentPolicy === null ? (
            <div>Loading...</div>
          ) : selectedCurrentPolicy.verified === true ? (
            <ClaimModal
              policyId={selectedPolicy}
              onClose={() => {
                setIsClaimModalOpen(false);
                setSelectedCurrentPolicy(null);
                refetchPolicies();
              }}
            />
          ) : (
            <div className="modal-message-container py-5 border-5 my-5 ms-5">
              <h1>Policy not verified yet, cannot claim</h1>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isDocumentModalOpen}
          onClose={() => {
            setIsDocumentModalOpen(false);
            setSelectedCurrentPolicy(null);
          }}
          width="60%"
          height="100%"
        >
          {selectedCurrentPolicy === null ? (
            <div>Loading...</div>
          ) : selectedCurrentPolicy.verified === false ? (
            <ViewDocumentForm
              policyId={selectedPolicy}
              onClose={() => {
                setIsDocumentModalOpen(false);
                setSelectedCurrentPolicy(null);
                refetchPolicies();
              }}
            />
          ) : (
            <div className="modal-message-container py-5 border-5 my-5 ms-5">
              <h1>Policy already verified , no unverfied documents</h1>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default CustomerPolicies;
