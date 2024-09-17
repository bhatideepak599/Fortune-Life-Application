import React, { useEffect, useState } from "react";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, warnToast } from "../../../../utils/Toast";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import Modal from "../../../sharedComponents/modal/Modal";
import {Dropdown ,Button } from "react-bootstrap";
import { FaDownload } from 'react-icons/fa';
import { getAgentsExcelReport, getAgentsPdfReport } from "../../../../services/reportsService";
import { activateAgent, deleteAgent, getAllAgents } from "../../../../services/agentService";
import UpdateAgent from "./updateAgent/UpdateAgent";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AgentReport = () => {
  const location = useLocation();
  const navigate=useNavigate()
  const [agents, setAgents] = useState([]);
  const [agentToUpdate, setAgentToUpdate] = useState(null);
  const [updateAgentModal, setUpdateAgentModal] = useState(false);
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
        "userDto.email",
        "userDto.username",
        "verified"
      ];
      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });
      console.log(newSanitizedData);
      
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
      errorToast(error.response?.data?.message);
    }
  };

  const getAgentByIdFromList = (id) => {
    return agentsList.find((agent) => agent.id === id);
  };

  const handleSearch = () => {
    setAgents([])
    setPageNumber(0); 
    fetchAgents();
  };

  const handleUpdateClick = (id) => {
    const agent = getAgentByIdFromList(id);
    setAgentToUpdate(agent);
    setUpdateAgentModal(true);
  };

  const handleDeleteClick = async (id) => {
    try{
      const response=await deleteAgent(id);
      if(response){
        warnToast("Agent Deleted.")
        setFlag(!flag)
      }
    }catch(error){
      errorToast(error.response?.data?.message)
    }
  };

  const handleActivateClick =async (id) => {
    try{
      const response=await activateAgent(id);
      if(response){
        toast.success("Agent Activated.")
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
  const handleReset = async () => {
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
  const handleVerifyClick=async(id)=>{
    try{
      const response=await activateAgent(id);
      if(response){
        toast.info("Agent Verified.")
        setFlag(!flag)
      }
    }catch(error){
      errorToast(error.response?.data?.message)
    }
    
  }
  const actions = {
    activate: handleActivateClick,
    delete: handleDeleteClick,
    update: handleUpdateClick,
    verify:handleVerifyClick
  };
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
  };

  return (
    <div>
      <h2 className="text-center mb-4">Agents List</h2>
      <div className="d-flex justify-content-center align-items-center mb-4">
       
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
      <CommonTable data={agents} actions={actions} />
      <div className="table-footer">
        <Pagination
          pager={pageObject}
          onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
        />
        <div style={styles.container}>
      <Button onClick={() => navigate(-1)} variant="secondary">
        Back
      </Button>
    </div>
      </div>
      <Modal
        isOpen={updateAgentModal}
        onClose={() => setUpdateAgentModal(false)}
      >
        <UpdateAgent
          agent={agentToUpdate}
          flag={flag}
          setFlag={setFlag}
          onClose={() => setUpdateAgentModal(false)}
        />
      </Modal>
    </div>
  );
};

export default AgentReport;
