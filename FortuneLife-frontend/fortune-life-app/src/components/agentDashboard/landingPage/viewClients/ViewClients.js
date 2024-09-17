import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { verifyUser } from "../../../../services/authService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllClient } from "../../../../services/policyService";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";

export const ViewClients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientList, setClientList] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const [searchParams, setSearchParams] = useState({
    id: "",
    customerId: "",
    name: "",
    policyStatus: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "agent");
          if (isValid) {
            setIsVerified(true);
          } else {
            localStorage.clear();
            toast.error("Please Login to access this resource");
            navigate("/");
          }
        } catch (error) {
          localStorage.clear();
          toast.error("Verification failed. Please login again.");
          navigate("/");
        }
      } else {
        localStorage.clear();
        toast.error("Please Login to access this resource");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    fetchAllClient();
  }, [pageSize, pageNumber, searchParams]);

  const fetchAllClient = async () => {

    try {
      const response = await getAllClient(pageSize, pageNumber, searchParams);
      console.log(response);
      setClientList(response.content);
      setTotalPages(response.totalPages);

      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) 
    {   if(error.response?.status!==404)
        toast.error(error.response?.data?.message)
        else toast.warn("No Clients Found")
    }
  };

  const handleSearch = async () => {
    await setClientList([]);
    setPageNumber(0);
    fetchAllClient();
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      customerId: "",
    name: "",
    policyStatus: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);
    fetchAllClient();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchParams((prevParams) => ({ ...prevParams, [type]: "" }));
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };
  if (!isVerified) {
    return <div>Loading...</div>;
  }
  return (
    <> 
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center mb-4">All Clients</h2>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <SearchComponent
            searchType={searchType}
            searchParams={searchParams}
            handleSearchTypeChange={handleSearchTypeChange}
            handleSearchChange={handleSearchChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
          />
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Policy Number</th>
              <th>Issue Date</th>
              <th>Policy Amount</th>
              <th>Policy Status</th>
              <th>Claim Status</th>
              <th>Policy Verification</th>
            </tr>
          </thead>
          <tbody>
            {clientList.length > 0 ? (
              clientList.map((client) => (
                <tr key={client.id}>
                  <td>{client.customerDto.id}</td>
                  <td>{`${client.customerDto.userDto.firstName} ${client.customerDto.userDto.lastName}`}</td>
                  <td>{client.id}</td>
                  <td>{client.issueDate}</td>
                  <td>{client.totalPolicyAmount}</td>
                  <td>{client.policyStatus}</td>
                  <td>
                    {client.claimStatus === "N/A"
                      ? "Not Claimed"
                      : client.claimStatus}
                  </td>
                  <td>
                    {client.verified ? "Verified" : "Pending For Verification"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <Pagination
            pager={pageObject}
            onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
          />
        </div>
       
      </div>
    </>
  );
};
