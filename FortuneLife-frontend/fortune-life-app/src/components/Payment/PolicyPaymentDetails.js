import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLoggedInUser } from "../../services/authService";
import { toast } from "react-toastify";
import { getPolicyByPolicyId } from "../../services/commonService";
import Navbar from "../sharedComponents/CommonNavbarFooter/Navbar";

const PolicyPaymentDetails = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [policy, setPolicy] = useState(null);
  console.log(policyId);

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
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        console.log(response);
        setPolicy(response);
      } catch (error) {
        toast.error(error.message || "Failed to load policy.");
      }
    };
    fetchPolicyData();
  }, [policyId]);

  if (!policy) {
    return <div>Loading...</div>;
  }

  const { issueDate,maturityDate, premiumType, premiumAmount, paymentList } = policy;

  const calculateInstallments = () => {
    const installments = [];
    const startDate = new Date(issueDate);
    const endDate=new Date(maturityDate)
    const time=endDate.getFullYear()-startDate.getFullYear();
    const numberOfInstallments = getInstallmentCount(premiumType);
    const intervalMonths = numberOfInstallments;

    for (let i = 0; i < numberOfInstallments*time; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i) *(12/ intervalMonths));

      const isPaid = paymentList.some((payment) => new Date(payment.paymentDate) <= dueDate);

      installments.push({
        serialNo: i + 1,
        premiumAmount,
        dueDate: dueDate.toISOString().split("T")[0], // format as YYYY-MM-DD
        isPaid,
      });
    }
     const countPaid = paymentList.filter(payment => payment.paymentStatus == "PAID").length;
    console.log(paymentList[0].status);
    
    for(let i=0;i<countPaid;i++){
      installments[i].isPaid="Paid"
    }
    for(let i=countPaid+1;i<numberOfInstallments*time;i++){
      installments[i].isPaid="UnPaid"
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

  const handlePayment=()=>{
      window.open(`/policy-payment/${policyId}`, "_blank");
  }

  if (!policy) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center my-5">
        <div className="card w-75 shadow">
          <div className="card-body">
            <h4 className="card-title text-center mb-4">Policy Details</h4>
            <ul className="list-group mb-4">
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Policy ID</h6>
                </div>
                <span className="text-body-secondary">{policy.id}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Issue Date</h6>
                </div>
                <span className="text-body-secondary">{policy.issueDate}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Maturity Date</h6>
                </div>
                <span className="text-body-secondary">{policy.maturityDate}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Premium Type</h6>
                </div>
                <span className="text-body-secondary">{policy.premiumType}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Sum Assured</h6>
                </div>
                <span className="text-body-secondary">{policy.sumAssured}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Premium Amount</h6>
                </div>
                <span className="text-body-secondary">{policy.premiumAmount}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Policy Status</h6>
                </div>
                <span className="text-body-secondary">{policy.policyStatus}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Scheme Name</h6>
                </div>
                <span className="text-body-secondary">{policy.schemeName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Agent Name</h6>
                </div>
                <span className="text-body-secondary">{policy.agentName ? policy.agentName : "N/A"}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Agent ID</h6>
                </div>
                <span className="text-body-secondary">{policy.agentId ? policy.agentId : "N/A"}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between lh-sm">
                <div>
                  <h6 className="my-0">Claim Status</h6>
                </div>
                <span className="text-body-secondary">{policy.claimId ? "Claimed" : "Not Claimed"}</span>
              </li>
            </ul>

            <h4 className="card-title text-center mb-4">Installments</h4>

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
                      <td>{installment.isPaid=="Paid" ? "Paid" : "Unpaid"}</td>
                      <td>
                        {!installment.isPaid && <button className="btn btn-primary" onClick={handlePayment}>Pay</button>}
                        {installment.isPaid && (
                          <button className="btn btn-secondary" disabled>
                           {installment.isPaid=="Paid"? "Paid": "Pay"}
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
    </>
  );
};

export default PolicyPaymentDetails;
