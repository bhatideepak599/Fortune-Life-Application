import React, { useState, useEffect } from "react";
import { addNewQuery } from "../../../services/CustomerService";
import { getLoggedInUser } from "../../../services/authService";
import { toast } from "react-toastify";
import styles from "./QueryModal.module.css";

const QueryModal = ({ onClose }) => {
  const [queryTitle, setQueryTitle] = useState("");
  const [queryQuestion, setQueryQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getLoggedInUser();
        if (user) {
          setCurrentUser(user);
        } else {
          toast.error("Please login to submit a query.");
          onClose();
        }
      } catch (error) {
        toast.error("Error fetching user details.");
        onClose();
      }
    };

    fetchCurrentUser();
  }, [onClose]);

  const handleReset = () => {
    setQueryTitle("");
    setQueryQuestion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("User not logged in.");
      return;
    }
    setLoading(true);

    const queryData = {
      title: queryTitle,
      question: queryQuestion,
      email: currentUser.email,
      active: true,
      answer: "",
      queryResponse: "",
    };

    try {
      await addNewQuery(queryData);
      toast.success("Query submitted successfully!");
      handleReset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error submitting query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles["modal-header"]}>
        <h1 className={styles["modal-title"]}>Submit New Query</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles["modal-body"]}>
          <div className="mb-3">
            <label htmlFor="queryTitle" className="form-label">
              Query Title
            </label>
            <input type="text" className="form-control" id="queryTitle" value={queryTitle} onChange={(e) => setQueryTitle(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="queryQuestion" className="form-label">
              Explain Query
            </label>
            <textarea className="form-control" id="queryQuestion" rows="4" value={queryQuestion} onChange={(e) => setQueryQuestion(e.target.value)} required></textarea>
          </div>
        </div>
        <div className={styles["modal-footer"]}>
          <button type="submit" className="btn btn-primary me-3" disabled={loading} style={{backgroundColor : "hsl(245, 67%, 59%)"}}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="reset" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
};

export default QueryModal;
