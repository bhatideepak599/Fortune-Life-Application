import React, { useEffect, useState } from "react";
import { activateCustomer, deleteCustomer, getAllCustomers } from "../../../../services/CustomerService";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import UpdateCustomer from "./updateCustomer/UpdateCustomer";
import Modal from "../../../sharedComponents/modal/Modal";
import {Dropdown } from "react-bootstrap";
import { FaDownload } from 'react-icons/fa';
import { getCustomersExcelReport, getCustomersPdfReport } from "../../../../services/reportsService";

const CustomerReport = () => {
  const [id, setId] = useState();
  const [userName, setUserName] = useState();
  const [name, setName] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [email, setEmail] = useState();
  const [active, setActive] = useState();
  const [verified, setVerified] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [customerToUpdate, setCustomerToUpdate] = useState(null);
  const [updateCustomerModal, setUpdateCustomerModal] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [flag, setFlag] = useState(false);
  const [format, setFormat] = useState("pdf");
  const [searchParams, setSearchParams] = useState({
    id: "",
    userName: "",
    name: "",
    mobileNumber: "",
    email: "",
    active: "",
    verified: "",
    page: 0,
    size: 10,
  });

  useEffect(() => {
    fetchCustomers();
  }, [searchParams, flag]);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      setCustomersList(response.content); // Set the response content to customersList
      setTotalPages(response.totalPages);

      const keys = [
        "id",
        "userDto.firstName",
        "userDto.lastName",
        "userDto.mobileNumber",
        "active",
        "userDto.email",
        "userDto.username",
      ];

      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });

      console.log("Sanitized Data:", newSanitizedData);
      setCustomers(newSanitizedData);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const getCustomerByIdFromList = (id) => {
    return customersList.find((customer) => customer.id === id);
  };

  const handleSearch = () => {
    setSearchParams({
      id,
      userName,
      name,
      mobileNumber,
      email,
      active,
      verified,
      page,
      size,
    });
  };

  const handleUpdateClick = (id) => {
    const customer = getCustomerByIdFromList(id);
    setCustomerToUpdate(customer);
    setUpdateCustomerModal(true);
  };

  const handleDeleteClick = async (id) => {
    try{
      const response=await deleteCustomer(id);
      if(response){
        warnToast("Customer Deleted.")
        setFlag(!flag)
      }
    }catch(error){
      errorToast(error.response?.data?.message)
    }
  };

  const handleActivateClick =async (id) => {
    try{
      const response=await activateCustomer(id);
      if(response){
        successToast("Customer Activated.")
        setFlag(!flag)
      }
    }catch(error){
      errorToast(error.response?.data?.message)
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
  
    
      const link = document.createElement('a');
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

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="d-flex align-items-center">
         
          <Dropdown onSelect={handleFormatChange}>
            <Dropdown.Toggle  id="dropdown-basic">
              {format.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="pdf">PDF</Dropdown.Item>
              <Dropdown.Item eventKey="excel">Excel</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <FaDownload size={18} className="ms-2" onClick={handleDownload} />
         
        </div>
      </div>

      <h2 className="text-center mb-4">Customers List</h2>
      <CommonTable data={customers} actions={actions} />
      <Modal
        isOpen={updateCustomerModal}
        onClose={() => setUpdateCustomerModal(false)}
      >
        <UpdateCustomer
          customer={customerToUpdate}
          flag={flag}
          setFlag={setFlag}
          onClose={() => setUpdateCustomerModal(false)}
        />
      </Modal>
    </div>
  );
};

export default CustomerReport;
