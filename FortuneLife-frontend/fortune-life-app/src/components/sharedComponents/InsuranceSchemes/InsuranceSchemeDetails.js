import React, { useEffect, useState } from "react";
import GuestNavbar from "../CommonNavbarFooter/Navbar";
import CustomerNavbar from "../../customerDashBoard/LandingPage/Navbar/Navbar";
import AgentNavbar from "../../agentDashboard/landingPage/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { getSchemeByPlanId } from "../../../services/commonService";
import { fetchFile } from "../../../services/fileServices";
import { errorToast } from "../../../utils/Toast";
import Modal from "../../../utils/Modals/Modal";
import InsurancePolicy from "../InsurancePolicy/InsurancePolicy";
import { toast } from "react-toastify";
import { getLoggedInUser } from "../../../services/authService";

const InsuranceSchemeDetails = () => {
  const { planId, schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [schemeImage, setSchemeImage] = useState();
  const [isPolicyOpen, setPolicyOpen] = useState(false);
  const [uploadingDocuments, SetUploadingDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchemeByPlanId = async () => {
      try {
        const response = await getSchemeByPlanId(planId, schemeId);
        console.log(response);
        setScheme(response);
        const name = response.schemeDetails.schemeImage;
        const imageUrl = await fetchFile(name);
        setSchemeImage(imageUrl);

        const documentNames = response.schemeDetails.documents.map((doc) => doc.documentName);
        SetUploadingDocuments(documentNames);
      } catch (error) {
        errorToast(error);
      }
    };

    fetchSchemeByPlanId();
  }, [planId, schemeId, navigate]);

  const handleShowMore = async () => {
    try {
      setPolicyOpen(true);
    } catch (error) {
      toast.error(error);
    }
  };

  if (!scheme) {
    return <div>Loading...</div>;
  }

  const role = localStorage.getItem("role");

  return (
    <>
      {role === "ROLE_CUSTOMER" ? <CustomerNavbar /> : role === "ROLE_AGENT" ? <AgentNavbar /> : <GuestNavbar />}

      <img src={schemeImage} alt="schemeImge" className="border border-2 rounded-5" style={{ width: "35%", marginLeft: "auto", marginRight: "auto" }} />
      <div className="col-md-7 col-lg-8" style={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}>
        <form key={scheme.id} className="needs-validation" noValidate>
          <h2 className="mb-3 text-center">{scheme.schemeName}</h2>

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" disabled value={scheme.schemeDetails.description}></textarea>
            </div>

            <div className="col-sm-6">
              <label className="form-label">Min Age</label>
              <input type="text" className="form-control" value={scheme.schemeDetails.minAge} disabled />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Max Age</label>
              <input type="text" className="form-control" value={scheme.schemeDetails.maxAge} disabled />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Min Investment Amount</label>
              <input type="text" className="form-control" value={`₹${scheme.schemeDetails.minAmount}`} disabled />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Max Investment Amount</label>
              <input type="text" className="form-control" value={`₹${scheme.schemeDetails.maxAmount}`} disabled />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Min Investment Time (Years)</label>
              <input type="text" className="form-control" value={scheme.schemeDetails.minInvestmentTime} disabled />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Max Investment Time (Years)</label>
              <input type="text" className="form-control" value={scheme.schemeDetails.maxInvestmentTime} disabled />
            </div>

            <div className="col-12">
              <label className="form-label">Profit Ratio (%)</label>
              <input type="text" className="form-control" value={scheme.schemeDetails.profitRatio} disabled />
            </div>

            <div className="col-12">
              <label className="form-label">Documents Required</label>
              <ul className="list-group">
                {scheme.schemeDetails.documents.map((document) => (
                  <li key={document.id} className="list-group-item">
                    {document.documentName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="my-4" />

          <button className="w-100 btn btn-primary btn-lg mb-5" type="button" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={handleShowMore}>
            Show More Details
          </button>
        </form>

        <Modal isOpen={isPolicyOpen} onClose={() => setPolicyOpen(false)}>
          <InsurancePolicy scheme={scheme} documentNames={uploadingDocuments} onClose={() => setPolicyOpen(false)} />
        </Modal>
      </div>
    </>
  );
};

export default InsuranceSchemeDetails;
