import React, { useEffect, useState } from "react";
import { activateCustomer, deleteCustomer, getAllCustomers } from "../../../../services/CustomerService";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import UpdateCustomer from "./updateCustomer/UpdateCustomer";
import Modal from "../../../sharedComponents/modal/Modal";
import { Button, Dropdown } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { getCustomersExcelReport, getCustomersPdfReport } from "../../../../services/reportsService";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import { toast } from "react-toastify";

const CustomerReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState();
  const [userName, setUserName] = useState();
  const [name, setName] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [email, setEmail] = useState();
  const [active, setActive] = useState();
  const [verified, setVerified] = useState();
  const [customers, setCustomers] = useState([]);
  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [updateCustomerModal, setUpdateCustomerModal] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [format, setFormat] = useState("pdf");
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useState({
    id: "",
    username: "",
    name: "",
    mobileNumber: "",
    email: "",
    active: "",
    verified: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id"),
      name: queryParams.get("name") || "",
      username: queryParams.get("username") || "",
      mobileNumber: queryParams.get("mobileNumber") || "",
      email: queryParams.get("email") || "",
      active: queryParams.get("active") || "",
      verified: queryParams.get("verified") || "",
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, []);
  useEffect(() => {
    fetchCustomers();
  }, [pageSize, pageNumber, searchParams, flag]);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers(pageSize, pageNumber, searchParams);
      setCustomersList(response.content); // Set the response content to customersList
      setTotalPages(response.totalPages);

      const keys = ["id", "userDto.firstName", "userDto.lastName", "userDto.mobileNumber", "active", "userDto.email", "userDto.username"];

      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });

      // console.log("Sanitized Data:", newSanitizedData);
      setCustomers(newSanitizedData);
      setTotalPages(response.totalPages);
      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };
  const handleSearch = () => {
    setCustomers([]);
    setPageNumber(0);
    fetchCustomers();
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      userName: "",
      name: "",
      mobileNumber: "",
      email: "",
      active: "",
      verified: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);

    fetchCustomers();
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
  const getCustomerByIdFromList = (id) => {
    return customersList.find((customer) => customer.id === id);
  };

  const handleUpdateClick = (id) => {
    const customer = getCustomerByIdFromList(id);
    setCustomerToUpdate(customer);
    setUpdateCustomerModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await deleteCustomer(id);
      if (response) {
        warnToast("Customer Deleted.");
        setFlag(!flag);
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleActivateClick = async (id) => {
    try {
      const response = await activateCustomer(id);
      if (response) {
        successToast("Customer Activated.");
        setFlag(!flag);
      }
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
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
        response = await getCustomersPdfReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch PDF data");
        }
        blob = new Blob([response.data], { type: "application/pdf" });
        fileName = "customers_report.pdf";
      } else {
        response = await getCustomersExcelReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch Excel data");
        }
        blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        fileName = "customers_report.xlsx";
      }

      if (response.data.byteLength === 0) {
        throw new Error("The downloaded file is empty");
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(link.href);

      // successToast(`${format.toUpperCase()} Downloaded Successfully`);
    } catch (error) {
      console.error("Error during download:", error);
      errorToast(error.message || "Error downloading the file");
    }
  };

  const actions = {
    activate: handleActivateClick,
    delete: handleDeleteClick,
    update: handleUpdateClick,
  };
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      // Adjust as needed
    },
  };
  return (
    <div className="container">
      <h2 className="text-center mb-4">Customers List</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <SearchComponent searchType={searchType} searchParams={searchParams} handleSearchTypeChange={handleSearchTypeChange} handleSearchChange={handleSearchChange} handleSearch={handleSearch} handleReset={handleReset} />

        <div className="d-flex align-items-center">
          <Dropdown onSelect={handleFormatChange}>
            <Dropdown.Toggle id="dropdown-basic">{format.toUpperCase()}</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="pdf">PDF</Dropdown.Item>
              <Dropdown.Item eventKey="excel">Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <FaDownload size={18} className="ms-2" onClick={handleDownload} />
        </div>
      </div>

      <CommonTable data={customers} actions={actions} />

      <div className="table-footer">
        <Pagination pager={pageObject} onPageChange={(newPage) => pageObject.setPageNumber(newPage)} />
      </div>

      <div style={styles.container}>
        <Button onClick={() => navigate(-1)} variant="secondary">
          Back
        </Button>
      </div>

      <Modal isOpen={updateCustomerModal} onClose={() => setUpdateCustomerModal(false)}>
        <UpdateCustomer customer={customerToUpdate} flag={flag} setFlag={setFlag} onClose={() => setUpdateCustomerModal(false)} />
      </Modal>
    </div>
  );
};

export default CustomerReport;
