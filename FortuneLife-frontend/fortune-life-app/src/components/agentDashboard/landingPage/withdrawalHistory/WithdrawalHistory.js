import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { toast } from "react-toastify";
import { getAllWithdrawalOfAnAgent } from "../../../../services/withdrawalService";
import Loader from "../../../sharedComponents/loader/Loader"; 
import jsPDF from "jspdf";
import "jspdf-autotable";

const WithdrawalHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    id: "",
    status: "",
  });
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id") || "",
      status: queryParams.get("status") || "",
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
      const response = await getAllWithdrawalOfAnAgent(
        pageSize,
        pageNumber,
        searchParams
      );
      if (response && response.content) {
        setWithdrawals(response.content);
        setTotalPages(response.totalPages);
      } else {
        setWithdrawals([]);
        setTotalPages(0);
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
        // Handle 404 error: No data found
        setWithdrawals([]); // Clear the data
        setTotalPages(0); // Reset pagination
      } else {
        toast.error(error.response?.data?.message);
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
      status: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);
    setWithdrawals([]);
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Withdrawal History", 20, 10);
    doc.autoTable({
      head: [["Withdrawal ID", "Date", "Status", "Amount"]],
      body: withdrawals.map((withdrawal) => [
        withdrawal.withdrawalId,
        withdrawal.withdrawalDate,
        withdrawal.status,
        withdrawal.amount,
      ]),
      styles: {
        head: {
          fillColor: [40, 150, 230],
        },
      },
      theme: "grid",
    });
    doc.save("withdrawal-history.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ textAlign: "center" }}>Withdrawal History</h2>
        <div className="d-flex justify-content-end me-5">
          <SearchComponent
            searchType={searchType}
            searchParams={searchParams}
            handleSearchTypeChange={handleSearchTypeChange}
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
          <div className="d-flex justify-content-between mt-5 ms-1">
            <Button variant="primary" onClick={downloadPDF}>
              Download
            </Button>
          </div>
        </div>

        {loading ? (
          <Loader /> // Show loader while fetching data
        ) : withdrawals.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Withdrawal ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.withdrawalId}>
                    <td>{withdrawal.withdrawalId}</td>
                    <td>{withdrawal.withdrawalDate}</td>
                    <td
                      style={{
                        color:
                          withdrawal.status === "APPROVED" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {withdrawal.status}
                    </td>
                    <td>
                      <strong>{withdrawal.amount}</strong>
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

export default WithdrawalHistory;
