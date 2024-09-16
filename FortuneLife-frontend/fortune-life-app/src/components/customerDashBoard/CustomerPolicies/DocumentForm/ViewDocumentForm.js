import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchFile, fetchImageFile, fetchSvgFile, uploadFile } from "../../../../services/fileServices";
import { getPolicyByPolicyId } from "../../../../services/commonService";

const ViewDocumentForm = ({ policyId, onClose }) => {
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const [fileInputs, setFileInputs] = useState({});

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        if (response) {
          setSubmittedDocuments(response.submittedDocumentsDto || []);
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
      } else {
        url = await fetchFile(documentImage);
      }
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to view document.");
    }
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    setFileInputs((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmitAll = async () => {
    const updates = [];

    for (const [documentId, file] of Object.entries(fileInputs)) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await uploadFile(formData);
          if (response) {
            const documentName = submittedDocuments.find((doc) => doc.id === documentId)?.documentName;
            updates.push({
              id: documentId,
              documentImage: response.name,
              documentName: documentName,
              documentStatus: "PENDING",
            });
          }
        } catch (error) {
          toast.error("Failed to upload file.");
          return;
        }
      }
    }
  };

  return (
    <div className="container">
      <h1>Rejected Documents</h1>
      {submittedDocuments.map((doc) => (
        <div key={doc.id} className="document-item">
          <span>{doc.documentName}</span>
          <button onClick={() => handleViewDocument(doc.documentImage)}>View</button>
          <input type="file" onChange={(e) => handleFileChange(doc.id, e)} />
        </div>
      ))}
      <button onClick={handleSubmitAll}>Submit All Documents</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ViewDocumentForm;
