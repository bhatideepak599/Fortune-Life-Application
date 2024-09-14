import React, { useEffect, useState, useRef } from "react";
import { getLoggedInUser, verifyUser } from "../../../services/authService";
import { getQueriesByCustomerEmail } from "../../../services/CustomerService";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sanitizedData } from "../../../utils/SanitizeData";
import Pagination from "../../sharedComponents/Pagination/Pagination";
import Modal from "../../../utils/Modals/Modal";
import Navbar from "../LandingPage/Navbar/Navbar";
import styles from "./CustomerQueries.module.css";
import QueryTable from "./QueryTable";

const CustomerQueries = () => {
  const [sanitizedQueries, setSanitizedQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedQueryResponse, setSelectedQueryResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    id: urlSearchParams.get("id") || "",
    title: urlSearchParams.get("title") || "",
  });


  const [shouldSearch, setShouldSearch] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "customer");
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
    const fetchCurrentUser = async () => {
      try {
        const user = await getLoggedInUser();
        if (!user) {
          toast.error("Please login to access this resource");
          navigate("/");
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        toast.error("Error fetching user details.");
        navigate("/");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser?.email) {
      getAllQueries();
    }
  }, [pageNumber, pageSize, currentUser]);

  useEffect(() => {
    setUrlSearchParams({
      ...searchParams,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  }, [pageNumber, pageSize, searchParams, setUrlSearchParams]);

  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(0);
    setShouldSearch(true);
    setUrlSearchParams({
      ...searchParams,
      pageNumber: "0",
      pageSize: pageSize.toString(),
    });
    getAllQueries();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      id: "",
      title: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setShouldSearch(false); // Reset search flag
    setUrlSearchParams({ pageNumber: "0", pageSize: "5" });
    getAllQueries();
  };

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
    getAllQueries();
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };

  const getAllQueries = async () => {
    if (!currentUser || !currentUser.email) {
      console.error("User is not defined or doesn't have an email.");
      return;
    }
    setLoading(true);
    try {
      const params = {
        customerEmail: currentUser.email,
        size: pageSize,
        pageNumber,
      };

      if (shouldSearch) {
        params.id = searchParams.id;
        params.title = searchParams.title;
      }

      const response = await getQueriesByCustomerEmail(params);

      if (response.content) {
        const keysTobeSelected = ["id", "title", "queryResponse", "answer"];

        const sanitized = sanitizedData({
          data: response.content,
          keysTobeSelected,
        });

        setSanitizedQueries(sanitized);
        setTotalPages(response.totalPages);
      } else {
        setSanitizedQueries([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error fetching queries.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponse = (queryId) => {
    const query = sanitizedQueries.find((q) => q.id === queryId);
    if (query) {
      setSelectedQueryResponse(query.answer || "N/A");
      setIsModalOpen(true);
    }
  };

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <form className="mb-4" ref={searchRef} onSubmit={handleSearch}>
          <div className="row align-items-end">
            <div className="col-md-3">
              <label htmlFor="id" className="form-label">
                Query ID
              </label>
              <input id="id" className="form-control" type="text" placeholder="Search by Query ID" value={searchParams.id || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input id="title" className="form-control" type="text" placeholder="Search by Title" value={searchParams.title || ""} onChange={handleSearchChange} />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary me-5" style={{ backgroundColor: "hsl(245, 67%, 59%)" }}>
                Search
              </button>
              <button type="reset" className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </form>

        {sanitizedQueries.length === 0 ? (
          <div>No queries found.</div>
        ) : (
          <>
            <QueryTable data={sanitizedQueries} onViewResponse={handleViewResponse} />

            <div className="d-flex align-items-center justify-content-between mt-5">
              <Pagination pager={pageObject} onPageChange={onPageChange} />
            </div>
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQueryResponse("");
          }}
          width="50%"
        >
          <div className="modal-body">
            <form>
              <div className={styles.heading}>
                <h1 className="">Query Response</h1>
              </div>
              <input type="text" id="queryResponse" className="form-control" value={selectedQueryResponse} disabled />
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CustomerQueries;
