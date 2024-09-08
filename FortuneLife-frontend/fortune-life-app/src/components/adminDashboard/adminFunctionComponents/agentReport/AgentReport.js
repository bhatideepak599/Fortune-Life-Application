import React, { useEffect, useState } from "react";
import { sanitizedData } from "../../../../utils/SanitizeData";
import { errorToast, successToast, warnToast } from "../../../../utils/Toast";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";
import Modal from "../../../sharedComponents/modal/Modal";
import {Dropdown } from "react-bootstrap";
import { FaDownload } from 'react-icons/fa';
import { getAgentsExcelReport, getAgentsPdfReport } from "../../../../services/reportsService";
import { activateAgent, deleteAgent, getAllAgents } from "../../../../services/agentService";
import UpdateAgent from "./updateAgent/UpdateAgent";

const AgentReport = () => {
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
  const [agents, setAgents] = useState([]);
  const [agentToUpdate, setAgentToUpdate] = useState(null);
  const [updateAgentModal, setUpdateAgentModal] = useState(false);
  const [agentsList, setAgentsList] = useState([]);
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
    fetchAgents();
  }, [searchParams, flag]);

  const fetchAgents = async () => {
   
    
    try {
      const response = await getAllAgents();
      setAgentsList(response.content); // Set the response content to AgentsList
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
      setAgents(newSanitizedData);
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const getAgentByIdFromList = (id) => {
    return agentsList.find((agent) => agent.id === id);
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
        successToast("Agent Activated.")
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

      <h2 className="text-center mb-4">Agents List</h2>
      <CommonTable data={agents} actions={actions} />
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
