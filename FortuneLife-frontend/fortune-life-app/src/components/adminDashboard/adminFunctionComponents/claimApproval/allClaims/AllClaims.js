import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {  getAllClaims } from "../../../../../services/adminService";
import { sanitizedData } from "../../../../../utils/SanitizeData";
import Pagination from "../../../../sharedComponents/Pagination/Pagination";
import ClaimTable from "../ClaimTable";
import Navbar from "../../navbar/Navbar";
;

const AllClaims = () => {
  const [claims, setClaims] = useState([]);
  const [urlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const searchRef = useRef();

  const [searchParams, setSearchParams] = useState({
    claimId: urlSearchParams.get("claimId") || "",
    bankAccountNumber: urlSearchParams.get("bankAccountNumber") || "",
    claimStatus: urlSearchParams.get("claimStatus") || "",
  });

  useEffect(() => {
    fetchClaims();

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


  return (
    <>
    <Navbar/>
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Claims</h2>
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
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="reset" className="btn btn-secondary ms-2" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </form>
      <ClaimTable data={claims}  />

      {claims?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={{ pageSize, pageNumber, setPageNumber, setPageSize, totalPages }} onPageChange={onPageChange} />
        </div>
      )}

     
    </div>
    </>
  );
};

export default AllClaims;
