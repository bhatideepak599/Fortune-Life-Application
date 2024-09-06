import React, { useEffect, useState } from "react";
import Navbar from "../../customerDashBoard/LandingPage/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { errorToast } from "../../../utils/Toast";
import { getSchemesByPlanId } from "../../../services/commonService";
import "./InsuranceSchemes.css";
import Footer from "../../customerDashBoard/LandingPage/Footer/Footer";

const InsuranceSchemes = () => {
  const { id } = useParams();
  const [schemes, setSchemes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSchemesById = async () => {
      try {
        const response = await getSchemesByPlanId(id);
        setSchemes(response);
      } catch (error) {
        errorToast(error);
      }
    };

    fetchAllSchemesById();
  }, [id, navigate]);

  const handleViewDetails = (schemeId) => {
    console.log("Scheme ID:", schemeId);
    navigate(`scheme-details/${schemeId}`);
  };

  return (
    <>
      <Navbar />

      <section className="popular" id="popular">
        <div className="container">
          <h2 className="h2 section-title">Our Most Popular Schemes</h2>

          {schemes.map((scheme, index) => (
            <div key={scheme.id} className={`mt-5 popular-wrapper ${index % 2 === 0 ? "left" : "right"}`}>
              <figure className="popular-banner">
                <img src={`${scheme.schemeDetails.schemeImage}`} alt={scheme.schemeName} style={{ width: "80%" }} />
              </figure>

              <div className="popular-content">
                <p className="popular-content-subtitle">
                  <ion-icon name="sparkles"></ion-icon>
                  <span>
                    <strong>{scheme.schemeName}</strong>
                  </span>
                </p>

                <h3 className="popular-content-title">
                  Build <strong>specially</strong> for <strong>your</strong> health <strong>and loved ones</strong>
                </h3>

                <p className="popular-content-text">{scheme.schemeDetails.description}</p>

                <ul className="popular-list">
                  <li className="popular-list-item">
                    <ion-icon name="layers-outline"></ion-icon>
                    <p>Min Amount: {scheme.schemeDetails.minAmount}</p>
                  </li>
                  <li className="popular-list-item">
                    <ion-icon name="megaphone-outline"></ion-icon>
                    <p>Max Amount: {scheme.schemeDetails.maxAmount}</p>
                  </li>
                </ul>

                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => handleViewDetails(scheme.id)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default InsuranceSchemes;
