import React, { useEffect, useState, useRef } from "react";
import { getAllClaims, claimApproval } from "../../../../services/adminService";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sanitizedData } from "../../../../utils/SanitizeData";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import Modal from "../../../../utils/Modals/Modal";
import ClaimTable from "./ClaimTable";
import Navbar from "../navbar/Navbar";
import styles from "./ClaimApproval.module.css"

const ClaimApproval = () => {
  const [claims, setClaims] = useState([]);
  const [urlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(false);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [remarks, setRemarks] = useState("");

  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    claimId: urlSearchParams.get("claimId") || "",
    bankAccountNumber: urlSearchParams.get("bankAccountNumber") || "",
    claimStatus: urlSearchParams.get("claimStatus") || "",
  });

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, searchActive]);

  const fetchClaims = async () => {
    try {
      const response = await getAllClaims({
        ...searchParams,
        page: pageNumber,
        size: pageSize,
      });
      if (response.content) {
        const keysToSelect = ["id", "claimAmount", "bankAccountNumber", "claimStatus", "remarks"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected: keysToSelect });
        setClaims(sanitized);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      //console.error(error);
      toast.error("Error fetching claims");
    }
  };

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
    fetchClaims();
  };

  const handleReset = () => {
    if (searchRef.current) {
      searchRef.current.reset();
    }
    setSearchParams({
      claimId: "",
      bankAccountNumber: "",
      claimStatus: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    fetchClaims();
  };

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleApprove = (claim) => {
    setSelectedClaim(claim);
    setModalMode("approve");
    setRemarks("");
    setModalOpen(true);
  };

  const handleReject = (claim) => {
    setSelectedClaim(claim);
    setModalMode("reject");
    setRemarks("");
    setModalOpen(true);
  };

  const handleView = (claim) => {
    setSelectedClaim(claim);
    setModalMode("view");
    setRemarks(claim.remarks || "No remarks available.");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClaim(null);
    setRemarks("");
    setModalMode("");
  };

  const handleSubmit = async () => {
    try {
      const operation = modalMode === "approve" ? "APPROVED" : "REJECT";
      await claimApproval({
        claimId: selectedClaim.id,
        claimReply: operation,
        remarks,
      });
      toast.success(`Claim ${operation.toLowerCase()} successfully`);
      fetchClaims();
      handleModalClose();
    } catch (error) {
      console.error(error);
      toast.error("Error processing claim");
    }
  };

  const actions = {
    approve: handleApprove,
    reject: handleReject,
    view: handleView,
  };

  return (
    <>
    <Navbar/>
    <div className={`container ${styles.claimContainer}`}>
      <h2>Claim Approval</h2>
      <form className="mb-4" ref={searchRef} onSubmit={handleSearch}>
        <div className="row">
          <div className="col-md-3">
            <input id="claimId" className="form-control" type="text" placeholder="Search by Claim ID" value={searchParams.claimId || ""} onChange={handleSearchChange} />
          </div>
          <div className="col-md-3">
            <input id="bankAccountNumber" className="form-control" type="text" placeholder="Search by Bank Account Number" value={searchParams.bankAccountNumber || ""} onChange={handleSearchChange} />
          </div>
          <div className="col-md-3">
            <select id="claimStatus" className="form-control" value={searchParams.claimStatus} onChange={handleSearchChange}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECT">Rejected</option>
            </select>
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
              Search
            </button>
            <button type="reset" className="btn btn-secondary ms-2" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </form>

      <ClaimTable data={claims} actions={actions} />

      {claims?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={{ pageSize, pageNumber, setPageNumber, setPageSize, totalPages }} onPageChange={onPageChange} />
        </div>
      )}

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={handleModalClose}>
          {modalMode === "view" ? (
            <div className={styles.viewRemarks}>
              <h4>View Remarks</h4>
              <p>{remarks}</p>
            </div>
          ) : (
            <div className={styles.claimDecision}>
              <h4>{modalMode === "approve" ? "Approve Claim" : "Reject Claim"}</h4>
              <textarea className="form-control" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" rows={4}></textarea>
              <button className="btn btn-primary mt-2" onClick={handleSubmit} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                OK
              </button>
              <button className="btn btn-secondary mt-2 ms-2" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
    </>
  );
};

export default ClaimApproval;
