import React, { useEffect, useState } from "react";
import { getAllCommissionsOfLoggedAdmin } from "../../../../services/policyService";
import { Table } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { toast } from "react-toastify";
import Loader from "../../../sharedComponents/loader/Loader"; 

const CommissionHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    id: "",
    policyId: "",
    commissionType: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id") || "",
      policyId: queryParams.get("policyId") || "",
      commissionType: queryParams.get("commissionType") || "",
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [pageNumber, pageSize, searchParams]);

  const fetchHistory = async () => {
    setLoading(true); // Start loading
    try {
      const response = await getAllCommissionsOfLoggedAdmin(
        pageSize,
        pageNumber,
        searchParams
      );
      if (response && response.content) {
        setCommissions(response.content);
        setTotalPages(response.totalPages);
      } else {
        setCommissions([]); // Clear commissions if no data is found
        setTotalPages(0); // Reset totalPages
      }

      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });
      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      if (error.response?.status === 404) {
        //toast.error("No data found.");
        setCommissions([]); // Clear the data if 404 error
      } else {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = () => {
    setPageNumber(0);
    fetchHistory();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      policyId: "",
      commissionType: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);
    setCommissions([]);
    fetchHistory();
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
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ textAlign: "center" }}>Commission Earned</h2>
        <div className="d-flex justify-content-end mb-3">
          <SearchComponent
            searchType={searchType}
            searchParams={searchParams}
            handleSearchTypeChange={handleSearchTypeChange}
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        </div>
        {loading ? ( // Show loader while loading
          <Loader />
        ) : commissions.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Commission ID</th>
                  <th>Agent Name</th>
                  <th>Policy ID</th>
                  <th>Commission Type</th>
                  <th>Issue Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id}>
                    <td>{commission.id}</td>
                    <td>{commission.agentName}</td>
                    <td>{commission.policyId}</td>
                    <td>{commission.commissionType}</td>
                    <td>{commission.issueDate}</td>
                    <td>
                      <strong>{commission.amount}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="table-footer mt-3">
              <Pagination
                pager={pageObject}
                onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
              />
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>No data found</p>
        )}
      </div>
    </>
  );
};

export default CommissionHistory;
