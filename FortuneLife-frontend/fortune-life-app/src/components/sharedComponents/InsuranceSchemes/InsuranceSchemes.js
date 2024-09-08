import React, { useEffect, useState } from "react";
import Navbar from "../../customerDashBoard/LandingPage/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { errorToast } from "../../../utils/Toast";
import { getSchemesByPlanId } from "../../../services/commonService";
import { fetchFile } from "../../../services/fileServices"; // Import the fetchFile function
import "./InsuranceSchemes.css";
import Footer from "../../customerDashBoard/LandingPage/Footer/Footer";

const InsuranceSchemes = () => {
  const { planId } = useParams();
  const [schemes, setSchemes] = useState([]);
  const [schemeImages, setSchemeImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSchemesById = async () => {
      try {
        const response = await getSchemesByPlanId(planId);
        setSchemes(response);

        const images = {};
        for (const scheme of response) {
          const name = scheme.schemeDetails.schemeImage;
          const imageUrl = await fetchFile(name);
          images[scheme.id] = imageUrl;
        }
        setSchemeImages(images);
      } catch (error) {
        errorToast(error);
      }
    };

    fetchAllSchemesById();
  }, [planId, navigate]);

  const handleViewDetails = (schemeId) => {
    //console.log("Scheme ID:", schemeId);
    navigate(`scheme-details/${schemeId}`);
  };

  return (
    <>
      <Navbar />

      <section className="popular" id="popular">
        <div className="container">
          {schemes.length > 0 ? (
            <>
              <h2 className="h2 section-title">Our Most Popular Schemes</h2>
              {schemes.map((scheme, index) => (
                <div key={scheme.id} className={`mt-5 popular-wrapper ${index % 2 === 0 ? "left" : "right"}`}>
                  <figure className="popular-banner">{schemeImages[scheme.id] ? <img src={schemeImages[scheme.id]} alt={scheme.schemeName} style={{ width: "80%" }} /> : <p>Loading image...</p>}</figure>

                  <div className="popular-content p-4 border border-2 rounded-3">
                    <p className="popular-content-subtitle fs-2">
                      <ion-icon name="sparkles"></ion-icon>
                      <span>
                        <strong>{scheme.schemeName}</strong>
                      </span>
                    </p>

                    <h5 className="popular-content-title fs-4">{scheme.schemeDetails.description}</h5>

                    <ul className="popular-list">
                      <li className="popular-list-item">
                        <ion-icon name="remove-circle-sharp"></ion-icon>
                        <p>Min Amount: {scheme.schemeDetails.minAmount}</p>
                      </li>
                      <li className="popular-list-item">
                        <ion-icon name="add-circle-sharp"></ion-icon>
                        <p>Max Amount: {scheme.schemeDetails.maxAmount}</p>
                      </li>
                    </ul>

                    <div className="btn-group col-6 mx-auto">
                      <button className="btn btn-primary " style={{ backgroundColor: "hsl(245, 67%, 59%)" }} onClick={() => handleViewDetails(scheme.id)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <h2 className="h2 section-title">No are schemes available in this plan yet</h2>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default InsuranceSchemes;
