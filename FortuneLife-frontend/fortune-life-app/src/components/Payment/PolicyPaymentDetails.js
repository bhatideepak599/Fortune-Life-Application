import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoggedInUser, verifyUser } from "../../services/authService";
import { toast } from "react-toastify";
import { getPolicyByPolicyId } from "../../services/commonService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./PolicyPaymentDetails.css"; // Add this for custom styles if needed
import Navbar from "../customerDashBoard/LandingPage/Navbar/Navbar";

const PolicyPaymentDetails = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [policy, setPolicy] = useState(null);
  console.log(policyId);

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const verifyToken = async () => {
      if (accessToken) {
        try {
          const isValid = await verifyUser(accessToken, "customer");
          if (isValid) {
            setIsVerified(true);
          } else {
            toast.error("Please Login to access this resource");
            navigate("/");
          }
        } catch (error) {
          toast.error("Verification failed. Please login again.");
          navigate("/");
        }
      } else {
        toast.error("Please Login to access this resource");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const response = await getLoggedInUser();
        if (!response) {
          toast.error("Please login to access this resource");
          navigate("/");
        }
        console.log(response);

        setCurrentUser(response);
      } catch (error) {
        toast.error("Error fetching user details.");
      }
    };

    getCustomer();
  }, [navigate, setCurrentUser]);

  useEffect(() => {
    refreshPolicyData();
  }, [policyId]);

  const refreshPolicyData = async () => {
    try {
      const response = await getPolicyByPolicyId(policyId);
      console.log(response);
      
      setPolicy(response);
    } catch (error) {
      toast.error(error.message || "Failed to load policy.");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshPolicyData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [policyId]);

  if (!policy) {
    return <div>Loading...</div>;
  }

  const { issueDate, maturityDate, premiumType, premiumAmount, paymentList ,policyStatus} = policy;

  const calculateInstallments = () => {
    const installments = [];
    const startDate = new Date(issueDate);
    const endDate = new Date(maturityDate);
    const time = endDate.getFullYear() - startDate.getFullYear();
    const numberOfInstallments = getInstallmentCount(premiumType);
    const intervalMonths = numberOfInstallments;

    for (let i = 0; i < numberOfInstallments * time; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i * (12 / intervalMonths));

      const isPaid = paymentList.some((payment) => new Date(payment.paymentDate) <= dueDate);

      installments.push({
        serialNo: i + 1,
        premiumAmount,
        dueDate: dueDate.toISOString().split("T")[0],
        isPaid,
      });
    }
    const countPaid = paymentList.filter((payment) => payment.paymentStatus === "PAID").length;

    for (let i = 0; i < countPaid; i++) {
      installments[i].isPaid = "Paid";
    }

    if(policyStatus!=="ACTIVE" && countPaid!==0){
      if (countPaid > 0 && countPaid <= installments.length) {
        return installments.slice(0, countPaid);
    }
    return [];
    }

    for (let i = countPaid + 1; i < numberOfInstallments * time; i++) {
      installments[i].isPaid = "Unpaid";
    }
    for (let i = countPaid + 1; i < numberOfInstallments * time; i++) {
      installments[i].isPaid = "UnPaid";
    }

    return installments;
  };

  const getInstallmentCount = (premiumType) => {
    switch (premiumType) {
      case "YEARLY":
        return 1;
      case "HALF_YEARLY":
        return 2;
      case "QUARTERLY":
        return 4;
      case "MONTHLY":
        return 12;
      default:
        return 1;
    }
  };

  const installments = calculateInstallments();

  const handlePayment = () => {
    window.open(`/policy-payment/${policyId}`, "_blank");
  };

  const downloadPDF = () => {
    const input = document.getElementById("policy-details");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("payments.pdf");
    });
  };

  if (!isVerified) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-dark " onClick={downloadPDF}>
            Download Report
          </button>
        </div>

        <div className="policy-details-container d-flex justify-content-center" id="policy-details">
          <div className="card w-75 shadow-lg border-0">
            <div className="card-body p-5">
              <h4 className="card-title text-center mb-4 text-dark">Policy Details</h4>
              <ul className="list-group mb-4">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Policy ID</h6>
                  </div>
                  <span>{policy.id}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Issue Date</h6>
                  </div>
                  <span>{policy.issueDate}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Maturity Date</h6>
                  </div>
                  <span>{policy.maturityDate}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Premium Type</h6>
                  </div>
                  <span>{policy.premiumType}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Sum Assured</h6>
                  </div>
                  <span>{policy.sumAssured}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Premium Amount</h6>
                  </div>
                  <span>{policy.premiumAmount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Policy Status</h6>
                  </div>
                  <span>{policy.policyStatus}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Scheme Name</h6>
                  </div>
                  <span>{policy.schemeName}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Agent Name</h6>
                  </div>
                  <span>{policy.agentName || "N/A"}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Agent ID</h6>
                  </div>
                  <span>{policy.agentId || "N/A"}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Claim Status</h6>
                  </div>
                  <span>{policy.claimId ? "Claimed" : "Not Claimed"}</span>
                </li>
              </ul>

              <h4 className="card-title text-center mb-4 text-dark">Installments</h4>

              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">Serial No.</th>
                      <th scope="col">Premium Amount</th>
                      <th scope="col">Due Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((installment) => (
                      <tr key={installment.serialNo}>
                        <th scope="row">{installment.serialNo}</th>
                        <td>{installment.premiumAmount.toFixed(2)}</td>
                        <td>{installment.dueDate}</td>
                        <td>{installment.isPaid === "Paid" ? "Paid" : "Unpaid"}</td>
                        <td>
                          {!installment.isPaid && (
                            <button className="btn btn-primary px-4" onClick={handlePayment} style={{ backgroundColor: "hsl(245, 67%, 59%)", color: "white" }}>
                              Pay
                            </button>
                          )}
                          {installment.isPaid && (
                            <button className="btn btn-secondary px-4" disabled>
                              {installment.isPaid === "Paid" ? "Paid" : "Pay"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyPaymentDetails;
