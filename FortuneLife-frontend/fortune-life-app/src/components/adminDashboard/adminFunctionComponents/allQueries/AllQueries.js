import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import ReplyToQuery from "./replyToQuery/ReplyToQuery";
import Modal from "../../../sharedComponents/modal/Modal";
import { getAllQueries } from "../../../../services/queryService";
import Navbar from "../navbar/Navbar";
import SearchComponent from "../../../sharedComponents/searchComponent/SearchComponent";
import Pagination from "../../../sharedComponents/Pagination/Pagination";

export const AllQueries = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [queryList, setAllQueryList] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query,setQuery]=useState()
  const[showQueryModal,setShowQueryModal]=useState(false)

  const [searchParams, setSearchParams] = useState({
    id: "",
    title: "",
    question: "",
    answer: "",
    queryResponse: "",
    active: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialPageSize = parseInt(queryParams.get("pageSize")) || 5;
    const initialPageNumber = parseInt(queryParams.get("pageNumber")) || 0;
    const initialSearchType = queryParams.get("searchType") || "Search By:";
    const initialSearchParams = {
      id: queryParams.get("id"),
      title: queryParams.get("title") || "",
      question: queryParams.get("question") || "",
      title: queryParams.get("title") || "",
      active: queryParams.get("active") || "",
      queryResponse: queryParams.get("queryResponse") || "",
    };
    setPageSize(initialPageSize);
    setPageNumber(initialPageNumber);
    setSearchType(initialSearchType);
    setSearchParams(initialSearchParams);
  }, []);

  useEffect(() => {
    fetchAllQueries();
  }, [pageSize, pageNumber, searchParams,query]);

  const fetchAllQueries = async () => {
    try {
      const response = await getAllQueries(pageSize, pageNumber, searchParams);
      setTotalPages(response.totalPages);
      setAllQueryList(response.content);
      const queryParams = new URLSearchParams();
      queryParams.set("pageSize", pageSize);
      queryParams.set("pageNumber", pageNumber);

      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key]) queryParams.set(key, searchParams[key]);
      });

      navigate({ search: queryParams.toString() }, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch queries");
    }
  };

  const handleSearch = () => {
    setAllQueryList([]);
    setPageNumber(0);
    fetchAllQueries();
  };

  const handleReset = () => {
    setSearchParams({
        id: "",
        title: "",
        question: "",
        answer: "",
        queryResponse: "",
        active: "",
    });
    setSearchType("");
    setPageNumber(0);
    setPageSize(5);
    fetchAllQueries();
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

  const handleViewQuery = (queryId) => {
    setQuery(queryId)
    setShowQueryModal(true)
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };

  return (
    <div className="container">
      <Navbar />
      <h2 className="text-center mb-4">Query List</h2>

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

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Title</th>
            <th>Query Response</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queryList.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.email}</td>
              <td>{item.title}</td>
              <td>{item.queryResponse}</td>
              <td>{item.active ? "Yes" : "No"}</td>
              <td>
              <a
                  href="#!"
                  onClick={() => handleViewQuery(item)}
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                  View Query
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="table-footer">
        <Pagination
          pager={pageObject}
          onPageChange={(newPage) => pageObject.setPageNumber(newPage)}
        />
      </div>
      <Modal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
      >
        <ReplyToQuery
          query={query}
          setQuery={setQuery}
          onClose={() => setShowQueryModal(false)}
        />
      </Modal>
    </div>
  );
};
