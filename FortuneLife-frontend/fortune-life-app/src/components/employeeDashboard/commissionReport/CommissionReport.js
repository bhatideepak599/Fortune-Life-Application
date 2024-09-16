import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateEmployee } from "../../../services/employeeService";
import { errorToast, warnToast } from "../../../utils/Toast";
import { getAllCommissions } from "../../../services/policyService";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import Pagination from "../../sharedComponents/Pagination/Pagination";
import SearchComponent from "../../sharedComponents/searchComponent/SearchComponent";

const CommissionReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    id: "",
    policyId: "",
    agentId: "",
    commissionType: "",
    customerName: "",
  });

  useEffect(() => {
    if (validateEmployee()) {
      warnToast("Unauthorized Access! Login First");
      navigate("/");
      return;
    } else {
      const queryParams = new URLSearchParams(location.search);
      const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
      const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
      const initialSearchType = queryParams.get("searchType") || "Search By:";
      const initialSearchParams = {
        id: queryParams.get("id") || "",
        policyId: queryParams.get("policyId") || "",
        agentId: queryParams.get("agentId") || "",
        commissionType: queryParams.get("commissionType") || "",
        customerName: queryParams.get("customerName") || "",
      };
      setPageSize(initialPageSize);
      setPageNumber(initialPageNumber);
      setSearchType(initialSearchType);
      setSearchParams(initialSearchParams);
    }
  }, []);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await getAllCommissions(pageSize, pageNumber, searchParams);
        setCommissions(response.content);
        setTotalPages(response.totalPages);
        const queryParams = new URLSearchParams();
        queryParams.set("pageSize", pageSize);
        queryParams.set("pageNumber", pageNumber);

        Object.keys(searchParams).forEach((key) => {
          if (searchParams[key]) queryParams.set(key, searchParams[key]);
        });

        navigate({ search: queryParams.toString() }, { replace: true });
      } catch (error) {
        errorToast(error.response?.data?.message || "Failed to fetch commissions");
      }
    };
    fetchCommissions();
  }, [pageSize, pageNumber]);

  const fetchCommissions = async () => {
    try {
      const response = await getAllCommissions(pageSize, pageNumber, searchParams);
      setCommissions(response.content);
      setTotalPages(response.totalPages);
      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      errorToast(error.response?.data?.message || "Failed to fetch commissions");
    }
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
  };
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };
  const handleSearch = () => {
    setCommissions([]);
    setPageNumber(0);
    fetchCommissions();
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      policyId: "",
      agentId: "",
      commissionType: "",
      customerName: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);

    fetchCommissions();
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
    });
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Commission Report</h2>
      <SearchComponent searchType={searchType} searchParams={searchParams} handleSearchTypeChange={handleSearchTypeChange} handleSearchChange={handleSearchChange} handleSearch={handleSearch} handleReset={handleReset} />
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Commission ID</th>
            <th>Agent Name</th>
            <th>Agent ID</th>
            <th>Date</th>
            <th>Policy ID</th>
            <th>Commission Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {commissions.length > 0 ? (
            commissions.map((commission) => (
              <tr key={commission.id}>
                <td>{commission.id}</td>
                <td>{commission.agentName}</td>
                <td>{commission.agentId}</td>
                <td>{commission.issueDate}</td>
                <td>{commission.policyId}</td>
                <td>{commission.commissionType}</td>
                <td>{commission.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No commissions found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination pager={pageObject} onPageChange={(newPage) => pageObject.setPageNumber(newPage)} />
      <div className="d-flex justify-content-center mt-3">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Back
        </Button>
      </div>
    </div>
  );
};

export default CommissionReport;
