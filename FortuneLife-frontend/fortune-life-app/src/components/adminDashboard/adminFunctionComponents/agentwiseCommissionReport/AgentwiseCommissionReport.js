import React, { useEffect, useState } from "react";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import CommonTable from "../../../../sharedComponents/commomTables/CommonTable";
import {Dropdown } from "react-bootstrap";
import { FaDownload } from 'react-icons/fa';
import { getAgentsExcelReport, getAgentsPdfReport } from "../../../../services/reportsService";
import SearchComponent from "../../../../sharedComponents/searchComponent/SearchComponent";
import Pagination from "../../../../sharedComponents/Pagination/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllAgents } from "../../../../services/agentService";

const AgentwiseCommissionReport = () => {
  const location = useLocation();
  const navigate=useNavigate()
  const [agents, setAgents] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
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
    verified: ""
  });

  useEffect(()=>{
   
      const queryParams = new URLSearchParams(location.search);
      const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
      const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
      const initialSearchType = queryParams.get("searchType") || "Search By:";
      const initialSearchParams = {
        id: queryParams.get("id"),
        name: queryParams.get("name") || "",
        username: queryParams.get("username") || "",
        active: queryParams.get("active") || "",
        mobileNumber: queryParams.get("mobileNumber") || "",
        email: queryParams.get("email") || "",
        active: queryParams.get("active") || "",
        
        verified: queryParams.get("verified") || "",
      };
      setPageSize(initialPageSize);
      setPageNumber(initialPageNumber);
      setSearchType(initialSearchType);
      setSearchParams(initialSearchParams);
  
  },[])

  useEffect(() => {
    fetchAgents();
  }, [pageSize, pageNumber, flag]);

  const fetchAgents = async () => {
   
    
    try {
      const response = await getAllAgents(pageSize,
        pageNumber,
        searchParams);
      setAgentsList(response.content); 
      setTotalPages(response.totalPages);

      const keys = [
        "id",
        "userDto.firstName",
        "userDto.lastName",
        "userDto.mobileNumber",
        "active",
        "totalTransactions",
        "totalCommission",
       
      ];

      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });

      //console.log("Sanitized Data:", newSanitizedData);
      setAgents(newSanitizedData);
      setTotalPages(response.totalPages);
      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      if(error.status!=404)
      errorToast(error.response?.data?.message);
    }
  };

  const handleSearch = () => {
    setAgents([])
    setPageNumber(0); 
    fetchAgents();
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
        response = await getAgentsPdfReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch PDF data");
        }
        blob = new Blob([response.data], { type: "application/pdf" });
        fileName = "Agents_report.pdf";
      } else {
        response = await getAgentsExcelReport();
        if (!response || !response.data) {
          throw new Error("Failed to fetch Excel data");
        }
        blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        fileName = "Agents_report.xlsx";
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
  
  
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };
  const handleReset = () => {
    setSearchParams({
      id: "",
      userName: "",
      name: "",
      mobileNumber: "",
      email: "",
      active: "",
      verified: ""
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);

    fetchAgents();
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
      [e.target.name]: e.target.value
    });
  };
 

  return (
    <div>
      <h2 className="text-center mb-4">Agent Wise Commission List</h2>
  
      <div className="d-flex justify-content-between mb-0 align-items-center">
        <div className="d-flex flex-grow-1 me-3">
          <SearchComponent
            searchType={searchType}
            searchParams={searchParams}
            handleSearchTypeChange={handleSearchTypeChange}
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        </div>
  
      
      </div>
  
      <div className="mt-0">
        <CommonTable data={agents} />
      </div>
  
      <div className="table-footer mt-3">
        <Pagination
          pager={pageObject}
          onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
        />
      </div>
    </div>
  );
  
  
};

export default AgentwiseCommissionReport;
