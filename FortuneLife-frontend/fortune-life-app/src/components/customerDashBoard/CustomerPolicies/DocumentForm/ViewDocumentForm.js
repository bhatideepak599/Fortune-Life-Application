import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchFile, fetchImageFile, fetchPdfFile, fetchSvgFile, uploadFile } from "../../../../services/fileServices";
import { getPolicyByPolicyId } from "../../../../services/commonService";
import { updateSubmittedDocuments } from "../../../../services/CustomerService";

const ViewDocumentForm = ({ policyId, onClose }) => {
  const [submittedDocuments, setSubmittedDocuments] = useState([]);

  const [fileInputs, setFileInputs] = useState({});

  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [rejectedDocuments, setRejectedDocuments] = useState([]);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        if (response) {
          setSelectedPolicy(response);

          setSubmittedDocuments(response.submittedDocumentsDto || []);

          const rejectedDocs = response.submittedDocumentsDto?.filter((doc) => doc.documentStatus === "REJECTED") || [];
          setRejectedDocuments(rejectedDocs);
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

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      setFileInputs((prev) => ({ ...prev, [id]: file }));
    }
  };

  const handleSubmitAll = async () => {
    const updates = [];

    for (const [documentId, file] of Object.entries(fileInputs)) {
      const numericId = Number(documentId);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await uploadFile(formData);

          if (response && response.data && response.data.name) {
            const document = submittedDocuments.find((doc) => doc.id === numericId);
            if (!document) {
              toast.error(`Document with ID ${documentId} not found.`);
              return;
            }

            updates.push({
              id: numericId,
              documentImage: response.data.name,
              documentStatus: "PENDING",
            });
          } else {
            toast.error("Invalid response from upload.");
            return;
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload file.");
          return;
        }
      }
    }

    if (updates.length > 0) {
      try {
        const updatedDocuments = submittedDocuments.map((doc) => {
          const update = updates.find((u) => u.id === doc.id);
          return update ? { ...doc, ...update } : doc;
        });

        await updateSubmittedDocuments(policyId, updatedDocuments);
        toast.success("Documents updated successfully.");

        setSubmittedDocuments(updatedDocuments);

        const remainingRejected = updatedDocuments.filter((doc) => doc.documentStatus === "REJECTED");
        setRejectedDocuments(remainingRejected);

        setFileInputs({});
      } catch (error) {
        console.error("Update error:", error);
        toast.error("Failed to update documents.");
        return;
      }
    } else {
      toast.info("No documents to update.");
    }

    onClose();
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Rejected Documents</h1>
      <div className="row justify-content-center">
        {rejectedDocuments.length > 0 ? (
          rejectedDocuments.map((doc) => (
            <div key={doc.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center d-flex flex-column justify-content-between">
                  <h5 className="card-title">{doc.documentName}</h5>
                  <button className="btn btn-primary mb-3" onClick={() => handleViewDocument(doc.documentImage)}>
                    View
                  </button>
                  <input type="file" className="form-control mb-2" onChange={(e) => handleFileChange(doc.id, e)} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No rejected documents to display.</p>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-success me-2" onClick={handleSubmitAll} disabled={selectedPolicy?.verified === true || rejectedDocuments.length === 0} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
          Submit All Documents
        </button>
      </div>
    </div>
  );
};

export default ViewDocumentForm;
