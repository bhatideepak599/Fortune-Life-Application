import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import SearchComponent from "../../../../sharedComponents/searchComponent/SearchComponent";
import CommonTable from "../../../../sharedComponents/commomTables/CommonTable";
import {
  approveWithdrawal,
  getAllWithdrawals,
  rejectWithdrawal,
} from "../../../../services/withdrawalService";
import Pagination from "../../../../sharedComponents/Pagination/Pagination";
import Loader from "../../../../sharedComponents/loader/Loader";
import Modal from "../../../../utils/Modals/Modal";
import styles from "../claimApproval/ClaimApproval.module.css";
import { toast } from "react-toastify";

export const Withdrawal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [id, setId] = useState("");

  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [approveClick,setApproveClick]=useState(false)

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [searchParams, setSearchParams] = useState({
    id: "",
    agentId: "",
    status: "PENDING", // Default set to PENDING
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id"),
      agentId: queryParams.get("agentId") || "",
      status: "PENDING", 
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, [location.search]);

  useEffect(() => {
    fetchWithdrawals();
  }, [pageSize, pageNumber, flag]);

  const fetchWithdrawals = async () => {
    setLoading(true); // Start loader
    try {
      const response = await getAllWithdrawals(pageSize, pageNumber, searchParams);
      setWithdrawalsList(response.content);
      setTotalPages(response.totalPages);

      const keys = [
        "withdrawalId",
        "agentDto.id",
        "agentDto.userDto.firstName",
        "leftCommission",
        "withdrawalRequestDate",
        "amount",
        "status",
        "remarks"
      ];

      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });

      setWithdrawals(newSanitizedData);
      setTotalPages(response.totalPages);

      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      if(error.response.status!==404)
      errorToast(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setWithdrawals([]);
    setPageNumber(0);
    fetchWithdrawals();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };

  const handleReset =async () => {
    await setSearchParams({
      id: "",
      agentId: "",
      status: "PENDING",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);

    fetchWithdrawals();
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
      status: "PENDING", 
    });
  };

  const handleApproveClick = async (id) => {
     setId(id)
    setApproveClick(true)
    setModalOpen(true);
  };

  const handleRejectClick = async (id) => {
    setId(id)
    setApproveClick(false)
    setModalOpen(true);
  };

  const handleView = (claim) => {
    setSelectedClaim(claim);
    setModalMode("view");
    setRemarks(claim.remarks || "No remarks available.");
    setModalOpen(true);
  };
  const actions = {
    approve: handleApproveClick,
    reject: handleRejectClick,
    view: handleView,
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedClaim(null);
    setRemarks("");
    setModalMode("");
  };
  const handleSubmit = async () => {
    try {
     if(approveClick){
      const response = await approveWithdrawal(id, remarks);
      if (response) {
        successToast("Withdrawal Approved");
        
      }
     }else {
      const response = await rejectWithdrawal(id, remarks);
      if (response) {
        
        warnToast("Withdrawal Rejected");
      }
     }
     fetchWithdrawals();
      handleModalClose();
    } catch (error) {
      //console.error(error);
      toast.error("Error processing claim");
    }
  };
  return (
    <div className={` ${styles.withdrawalContainer}`}>
      <h2 className="text-center">Withdrawals For Approval</h2>
      <div className="d-flex justify-content-between align-items-center  mb-4">
        <SearchComponent
          searchType={searchType}
          searchParams={searchParams}
          handleSearchTypeChange={handleSearchTypeChange}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
        
      </div>

      {/* Show loader while data is being fetched */}
      {loading ? (
        <Loader /> // Use the loader component
      ) : withdrawals.length > 0 ? (
        <CommonTable data={withdrawals} actions={actions} />
      ) : (
        <p className="text-center">No Withdrawals Found</p>
      )}

      <div className="d-flex justify-content-center mt-0">
        <Pagination
          pager={pageObject}
          onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
        />
      </div>

      {modalOpen && (
          <Modal isOpen={modalOpen} onClose={handleModalClose}>
            {modalMode === "view" ? (
              <div className={styles.viewRemarks}>
                <h4>View Remarks</h4>
                <p>{remarks}</p>
              </div>
            ) : (
              <div className={styles.claimDecision}>
                <h4>{approveClick === true ? "Approve Withdrawal" : "Reject Withdrawal"}</h4>
                <textarea
                  className="form-control"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                  rows={4}
                ></textarea>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}
                >
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
  );
};
