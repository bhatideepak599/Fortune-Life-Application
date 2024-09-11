import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../sharedComponents/CommonNavbarFooter/Navbar";
import { getPoliciesByCustomerId } from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { getLoggedInUser } from "../../../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sanitizedData } from "../../../utils/SanitizeData";
import Pagination from "../../sharedComponents/Pagination/Pagination";
import Modal from "../../../utils/Modals/Modal";
import ClaimModal from "../CustomerClaim/ClaimModal";
import SharedTable from "../SharedTable/SharedTable";

const CustomerPolicies = () => {
  const [sanitizedPolicies, setSanitizedPolicies] = useState([]);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState("");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    policyId: urlSearchParams.get("policyId") || "",
    schemeName: urlSearchParams.get("schemeName") || "",
    policyStatus: urlSearchParams.get("policyStatus") || "",
  });

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

    try {
      const response = await getPoliciesByCustomerId({
        customerId: currentUser.id,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "schemeName", "premiumAmount", "totalPolicyAmount", "issueDate", "maturityDate", "policyStatus", "claimId", "claimStatus"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const searchPolicies = async () => {
    try {
      const response = await getPoliciesByCustomerId({
        ...searchParams,
        customerId: currentUser.id,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "schemeName", "premiumAmount", "totalPolicyAmount", "issueDate", "maturityDate", "policyStatus", "claimId", "claimStatus"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleClaim = (policyId) => {
    setSelectedPolicy(policyId);
    setIsClaimModalOpen(true);
  };

  const handlePayment = (policyId) => {
    navigate(`${policyId}/payment-details`);
  };

  const actions = {
    claim: handleClaim,
    payment: handlePayment,
  };

  const refetchPolicies = () => {
    getAllPolicies();
  };

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
              <button type="reset" className="btn btn-secondary ms-2" onClick={() => navigate("/customer-dashboard")}>
                Back
              </button>
            </div>
          </div>
        </form>

        <div className="card inner-card mt-1">
          <div className="card-body">
            <SharedTable data={sanitizedPolicies} actions={actions} />
          </div>
        </div>

        {sanitizedPolicies?.length > 0 && (
          <div className="d-flex align-items-center justify-content-between mt-5">
            <Pagination pager={pageObject} onPageChange={onPageChange} />
          </div>
        )}

        <Modal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} width="60%" height="70%">
          <ClaimModal
            policyId={selectedPolicy}
            onClose={() => {
              setIsClaimModalOpen(false);
              refetchPolicies();
            }}
          />
        </Modal>
      </div>
    </>
  );
};

export default CustomerPolicies;
