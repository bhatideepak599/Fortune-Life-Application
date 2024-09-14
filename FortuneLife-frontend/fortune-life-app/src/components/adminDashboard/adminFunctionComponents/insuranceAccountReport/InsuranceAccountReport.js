import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import { Dropdown } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { approveWithdrawal, getAllWithdrawals, rejectWithdrawal } from "../../../../services/withdrawalService";
import { getWithdrawalsExcelReport, getWithdrawalsPdfReport } from "../../../../services/reportsService";
import { getAllPolicies } from "../../../../services/policyService";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import Modal from "../../../sharedComponents/modal/Modal";
import { ViewPayment } from "./viewPayment/ViewPayment";
import Navbar from "../navbar/Navbar";
import Loader from "../../../sharedComponents/loader/Loader";

const InsuranceAccountReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentModal, setPaymentModal] = useState(false);
  const [viewPayment, setViewPayment] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [policyList, setpolicyList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [format, setFormat] = useState("pdf");
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    id: "",
    customerId: "",
    agentId: "",
    schemeId: "",
    schemeName: "",
    customerName: "",
    policyStatus: "",
  });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id") || "",
      customerId: queryParams.get("customerId") || "",
      agentId: queryParams.get("agentId") || "",
      schemeId: queryParams.get("schemeId") || "",
      schemeName: queryParams.get("schemeName") || "",
      customerName: queryParams.get("customerName") || "",
      policyStatus: queryParams.get("policyStatus") || "",
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, []);

  useEffect(() => {
    fetchAllPolicies();
  }, [pageSize, pageNumber, flag]);

  const fetchAllPolicies = async () => {
    try {
      setLoading(true); 
      const response = await getAllPolicies(pageSize, pageNumber, searchParams);
      setpolicyList(response.content);
      setTotalPages(response.totalPages);

      const keys = ["id", "customerDto.userDto.firstName", "schemeName", "totalPolicyAmount", "totalAmountPaidTillDate", "policyStatus", "premiumType", "premiumAmount"];

      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });

      setPolicies(newSanitizedData);
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
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleSearch = () => {
    setPolicies([]);
    setPageNumber(0);
    fetchAllPolicies();
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
        fileName = "Agents_report.pdf";
      } else {
        response = await getWithdrawalsExcelReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch Excel data");
        }
        blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileName = "Agents_report.xlsx";
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
      customerId: "",
      agentId: "",
      schemeId: "",
      schemeName: "",
      customerName: "",
      policyStatus: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);
    fetchAllPolicies();
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

  const getPaymentByIdFromList = (id) => {
    return policyList.find((policy) => policy.id === id);
  };

  const handleViewClick = async (id) => {
    setPaymentModal(true);
    setViewPayment(getPaymentByIdFromList(id).paymentList);
  };

  const actions = {
    view: handleViewClick,
  };

  return (
    <>
      <Navbar />
      <div>
        <h2 className="text-center mb-4">Insurance Accounts</h2>

        <div className="d-flex justify-content-around mb-0 align-items-center">
          <div className="me-3">
            <SearchComponent searchType={searchType} searchParams={searchParams} handleSearchTypeChange={handleSearchTypeChange} handleSearchChange={handleSearchChange} handleSearch={handleSearch} handleReset={handleReset} />
          </div>

          <div className="d-flex align-items-center">
            <Dropdown onSelect={handleFormatChange}>
              <Dropdown.Toggle id="dropdown-basic"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="pdf">PDF</Dropdown.Item>
                <Dropdown.Item eventKey="excel">Excel</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <FaDownload size={18} className="ms-2" onClick={handleDownload} />
          </div>
        </div>

        <div className="container mt-0">
          <CommonTable data={policies} viewPayments={actions} />
        </div>

        <div className="container table-footer mt-3">
          <Pagination pager={pageObject} onPageChange={(newPage) => pageObject.setPageNumber(newPage)} />
        </div>
        <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} width={"2000px"}>
          <ViewPayment payments={viewPayment} onClose={() => setPaymentModal(false)} />
        </Modal>
      </div>
    </>
  );
};

export default InsuranceAccountReport;
