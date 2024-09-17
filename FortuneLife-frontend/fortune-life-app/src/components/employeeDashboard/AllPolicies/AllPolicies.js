import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../sharedComponents/Pagination/Pagination";
import Modal from "../../../utils/Modals/Modal";
import Navbar from "../employeeHomeDashboard/navbar/Navbar";
import { getAllPoliciesByEmployee } from "../../../services/policyService";
import AllPoliciesTable from "./AllPolicyTable/AllPoliciesTable";
import VerifyDocuments from "./DocumentForm/VerifyDocuments";


const sanitizePolicies = (data) => {
  return data.map((policy) => ({
    policyId: policy.id,
    customerId: policy.customerDto?.id || "N/A",
    customerName: (policy.customerDto?.userDto?.firstName || "") + " " + (policy.customerDto?.userDto?.lastName || ""),
    agentId: policy.agentId || "N/A",
    agentName: policy.agentName || "N/A",
    schemeName: policy.schemeName || "N/A",
    policyStatus: policy.policyStatus || "N/A",
    verificationStatus: policy.verified ? "Verified" : "Unverified",
  }));
};

const AllPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const searchRef = useRef();

  const [searchParamsState, setSearchParamsState] = useState({
    policyId: urlSearchParams.get("policyId") || "",
    customerId: urlSearchParams.get("customerId") || "",
    agentId: urlSearchParams.get("agentId") || "",
    schemeName: urlSearchParams.get("schemeName") || "",
    policyStatus: urlSearchParams.get("policyStatus") || "",
    verificationStatus: urlSearchParams.get("verificationStatus") || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (searchActive) {
        await searchPolicies();
      } else {
        await fetchAllPolicies();
      }
    };

    fetchData();
  }, [pageNumber, pageSize, searchActive]);

  useEffect(() => {
    setUrlSearchParams({
      ...searchParamsState,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  }, [pageNumber, pageSize, searchParamsState, setUrlSearchParams]);

  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    setSearchParamsState((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(0);
    setSearchActive(true);
    setUrlSearchParams({
      ...searchParamsState,
      pageNumber: "0",
      pageSize: pageSize.toString(),
    });
    searchPolicies();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParamsState({
      policyId: "",
      customerId: "",
      agentId: "",
      schemeName: "",
      policyStatus: "",
      verificationStatus: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    setUrlSearchParams({ pageNumber: "0", pageSize: "5" });
    fetchAllPolicies();
  };

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const fetchAllPolicies = async () => {
    setLoading(true);
    try {
      const response = await getAllPoliciesByEmployee(pageSize, pageNumber, searchParamsState);

      if (response.content) {
        const sanitized = sanitizePolicies(response.content);
        setPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching policies");
    } finally {
      setLoading(false);
    }
  };

  const searchPolicies = async () => {
    setLoading(true);
    try {
      const response = await getAllPoliciesByEmployee(pageSize, pageNumber, searchParamsState);

      if (response.content) {
        const sanitized = sanitizePolicies(response.content);
        setPolicies(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error searching policies");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (policyId) => {
    setSelectedPolicy(policyId);
    setIsDocumentModalOpen(true);
  };

  const actions = {
    view: handleView,
  };

  const refetchPolicies = () => {
    fetchAllPolicies();
  };

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
            <div className="col-md-2">
              <input id="policyId" className="form-control" type="text" placeholder="Policy ID" value={searchParamsState.policyId || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-2">
              <input id="customerId" className="form-control" type="text" placeholder="Customer ID" value={searchParamsState.customerId || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-2">
              <input id="agentId" className="form-control" type="text" placeholder="Agent ID" value={searchParamsState.agentId || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-2">
              <input id="schemeName" className="form-control" type="text" placeholder="Scheme Name" value={searchParamsState.schemeName || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-2">
              <select id="policyStatus" className="form-control" value={searchParamsState.policyStatus} onChange={handleSearchChange}>
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="CLAIMED">Claimed</option>
                <option value="COMPLETE">Complete</option>
              </select>
            </div>
            <div className="col-md-2">
              <select id="verificationStatus" className="form-control" value={searchParamsState.verificationStatus} onChange={handleSearchChange}>
                <option value="">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="reset" className="btn btn-secondary ms-2" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {policies.length === 0 ? (
          <div>No policies found.</div>
        ) : (
          <>
            <AllPoliciesTable data={policies} actions={actions} />

            {policies.length > 0 && (
              <div className="d-flex align-items-center justify-content-between mt-5">
                <Pagination
                  pager={{
                    pageSize,
                    pageNumber,
                    setPageNumber,
                    setPageSize,
                    totalPages,
                  }}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={isDocumentModalOpen}
          onClose={() => {
            setIsDocumentModalOpen(false);
            setSelectedPolicy(null);
          }}
          width="60%"
          height="100%"
        >
          {selectedPolicy ? (
            <VerifyDocuments
              policyId={selectedPolicy}
              onClose={() => {
                setIsDocumentModalOpen(false);
                setSelectedPolicy(null);
                refetchPolicies();
              }}
            />
          ) : (
            <div>Loading...</div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AllPolicies;
