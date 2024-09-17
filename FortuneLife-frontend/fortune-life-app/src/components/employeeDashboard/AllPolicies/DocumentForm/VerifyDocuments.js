import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchFile, fetchImageFile, fetchPdfFile, fetchSvgFile } from "../../../../services/fileServices";
import { getPolicyByPolicyId } from "../../../../services/commonService";
import { verifyPolicy } from "../../../../services/policyService";

const VerifyDocuments = ({ policyId, onClose }) => {
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const [documentStatus, setDocumentStatus] = useState({});

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        if (response) {
          setSubmittedDocuments(response.submittedDocumentsDto || []);
          // Initialize the documentStatus state with current statuses
          const statusMap = {};
          response.submittedDocumentsDto.forEach((doc) => {
            statusMap[doc.id] = doc.documentStatus;
          });
          setDocumentStatus(statusMap);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load policy.");
      }
    };
    fetchPolicyData();
  }, [policyId]);

  const handleViewDocument = async (documentImage) => {
    try {
      let url;
      if (documentImage.endsWith(".png")) {
        url = await fetchImageFile(documentImage);
      } else if (documentImage.endsWith(".svg")) {
        url = await fetchSvgFile(documentImage);
      } else if (documentImage.endsWith(".pdf")) {
        url = await fetchPdfFile(documentImage);
      } else {
        url = await fetchFile(documentImage);
      }
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to view document.");
    }
  };

  const handleStatusChange = (documentId, status) => {
    setDocumentStatus((prevStatus) => ({
      ...prevStatus,
      [documentId]: status,
    }));
  };

  const handleSubmitAll = async () => {
    const updates = submittedDocuments.map((doc) => ({
      id: doc.id,
      documentImage: doc.documentImage,
      documentName: doc.documentName,
      documentStatus: documentStatus[doc.id],
    }));

    try {
      await verifyPolicy(policyId, updates);
      toast.success("Document statuses updated successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to update document statuses.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Verify Documents</h1>
      <div className="row justify-content-center">
        {submittedDocuments.map((doc) => (
          <div key={doc.id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center d-flex flex-column justify-content-between">
                <h5 className="card-title">{doc.documentName}</h5>
                <div className="mb-3">
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name={`status-${doc.id}`} id={`approve-${doc.id}`} value="APPROVED" checked={documentStatus[doc.id] === "APPROVED"} onChange={() => handleStatusChange(doc.id, "APPROVED")} />
                    <label className="form-check-label" htmlFor={`approve-${doc.id}`}>
                      Approve
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name={`status-${doc.id}`} id={`reject-${doc.id}`} value="REJECTED" checked={documentStatus[doc.id] === "REJECTED"} onChange={() => handleStatusChange(doc.id, "REJECTED")} />
                    <label className="form-check-label" htmlFor={`reject-${doc.id}`}>
                      Reject
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary mb-3" onClick={() => handleViewDocument(doc.documentImage)}>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button className="btn" onClick={handleSubmitAll} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default VerifyDocuments;
