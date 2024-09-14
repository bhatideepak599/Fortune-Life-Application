import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import { Dropdown } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import {
  approveWithdrawal,
  getAllWithdrawals,
  rejectWithdrawal,
} from "../../../../services/withdrawalService";
import {
  getWithdrawalsExcelReport,
  getWithdrawalsPdfReport,
} from "../../../../services/reportsService";
import Pagination from "../../../sharedComponents/Pagination/Pagination";

export const AllWithdrawals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [format, setFormat] = useState("pdf");
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    id: "",
    agentId: "",
    status: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id"),
      agentId: queryParams.get("agentId") || "",
      status: queryParams.get("status") || ""
      
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, []);

  useEffect(() => {
    fetchWithdrawals();
  }, [pageSize, pageNumber, flag]);

  const fetchWithdrawals = async () => {
    try {
      const response = await getAllWithdrawals(pageSize, pageNumber, searchParams);
      setWithdrawalsList(response.content);
      setTotalPages(response.totalPages);

      const keys = [
        "withdrawalId",
        "agentDto.id",
        "agentDto.userDto.firstName",
        "leftCommission",
        "withdrawalDate",
        "amount",
        "status",
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
      errorToast(error.response?.data?.message);
    }
  };

  const handleSearch = () => {
    setWithdrawals([]);
    setPageNumber(0);
    fetchWithdrawals();
  };

  const handleFormatChange = (eventKey) => {
    setFormat(eventKey);
  };
 
  const handleDownload = async () => {
    try {
      let response;
      let blob;
      let fileName;

      if (format === "pdf") {
        response = await getWithdrawalsPdfReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch PDF data");
        }
        blob = new Blob([response.data], { type: "application/pdf" });
        fileName = "Withdrawals_report.pdf";
      } else {
        response = await getWithdrawalsExcelReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch Excel data");
        }
        blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileName = "Withdrawals_report.xlsx";
      }

      if (response.data.byteLength === 0) {
        throw new Error("The downloaded file is empty");
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      errorToast(error.message || "Error downloading the file");
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      agentId: "",
      status: "",
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
    });
  };

  return (
    <div>
      <h2 className="text-center mb-4">All Withdrawals</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <SearchComponent
          searchType={searchType}
          searchParams={searchParams}
          handleSearchTypeChange={handleSearchTypeChange}
          handleSearchChange={handleSearchChange}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
        <div className="d-flex align-items-center">
          <Dropdown onSelect={handleFormatChange}>
            <Dropdown.Toggle id="dropdown-basic">
              Export as {format.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="pdf">PDF</Dropdown.Item>
              <Dropdown.Item eventKey="excel">Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <FaDownload size={18} className="ms-2" onClick={handleDownload} />
        </div>
      </div>

      
      <CommonTable data={withdrawals}  />

      <div className="d-flex justify-content-center mt-0">
        <Pagination
          pager={pageObject}
          onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
        />
      </div>
    </div>
  );
};
