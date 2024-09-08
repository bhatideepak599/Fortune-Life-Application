import React, { useEffect, useState } from "react";
import { errorToast } from "../../../../utils/Toast";
import { getAllCustomers } from "../../../../services/CustomerService";
import { sanitizedData } from "../../../../utils/SanitizeData";
import CommonTable from "../../../sharedComponents/commomTables/CommonTable";

const CustomerReport = () => {
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState("");
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [customers, setCustomers] = useState();

  // Initialize searchParams as a state
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
  }, [searchParams]);

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      setTotalPages(response.totalPages);

      const keys = [
        "id",
        "userDto.firstName",
        "userDto.lastName",
        "userDto.mobileNumber",
        "active",
        "userDto.email","userDto.username"
      ];
      const newSanitizedData = sanitizedData({
        data: response.content,
        keysTobeSelected: keys,
      });
      console.log("new"+newSanitizedData+" page"+totalPages);
      
      setCustomers(newSanitizedData);
      //setCustomers(data.content); // Assuming the API response contains a content array
    } catch (error) {
      errorToast(error.response?.data?.message);
    }
  };

  const handleSearch = () => {
    // Update the searchParams state
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

  return (
    <div>
      <h1>Customers List</h1>
      <CommonTable data={customers}/>
    </div>
  );
};

export default CustomerReport;
