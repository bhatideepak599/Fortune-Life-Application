import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Payment.css"; // Assuming a CSS file exists for styling
import { createPaymentIntent } from "../../services/commonService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getGlobalTax, getPolicyByPolicyId } from "../../services/commonService";
import payment from "../../images/undraw_Mobile_pay_re_copy.png";

const stripePromise = loadStripe("pk_test_51Puzcj2MY7JIifoyC6FTDIlzNncUaOmYkXtV5lKLTh7kkHhQe37YMWF9pbndceIKKYws4IQqwyWTIzYhZkgZ393v00oozKhdhP");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [policy, setPolicy] = useState(null);
  const [tax, setTax] = useState(null);
  const [taxPaid, setTaxPaid] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const { policyId } = useParams();

  // Fetch Policy Data
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicyByPolicyId(policyId);
        setPolicy(response);
      } catch (error) {
        toast.error(error.message || "Failed to load policy.");
      }
    };
    fetchPolicyData();
  }, [policyId]);

  // Fetch Tax Data
  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await getGlobalTax();
        if (response) {
          setTax(response);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load tax.");
      }
    };
    fetchTaxData();
  }, []);

  // Calculate Total Payment
  const getTotalPayment = (taxRate, installmentAmount) => {
    const taxAmount = (installmentAmount * taxRate) / 100;
    setTaxPaid(taxAmount);
    return installmentAmount + taxAmount;
  };

  const [paymentData, setPaymentData] = useState({
    paymentType: "credit",
    amount: "",
    policyId: "",
    tax: "",
    totalPayment: "",
  });

  // Update Payment Data when policy or tax changes
  useEffect(() => {
    if (policy && tax) {
      const totalPaymentAmount = getTotalPayment(tax.taxRate, policy.premiumAmount);
      setPaymentData((prevData) => ({
        ...prevData,
        amount: policy.premiumAmount || "",
        policyId: policy.id || "",
        tax: taxPaid || "",
        totalPayment: totalPaymentAmount || "",
      }));
    }
  }, [policy, tax, taxPaid]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !policy || !tax) {
      return; // Prevent submission if data is missing
    }

    const cardElement = elements.getElement(CardElement);

    try {
      setPaymentError(null); // Clear previous errors

      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {},
      });

      if (paymentMethodError) {
        console.error(paymentMethodError.message);
        setPaymentError(paymentMethodError.message); // Set error for display
        return;
      }

      // Create PaymentIntent on the server
      const paymentIntentResponse = await createPaymentIntent({
        policyId: paymentData.policyId,
        paymentMethodId: paymentMethod.id,
        paymentType: paymentData.paymentType,
        amount: paymentData.amount,
        tax: paymentData.tax,
        totalPayment: paymentData.totalPayment,
      });

      if (paymentIntentResponse.error) {
        console.error("PaymentIntent Error:", paymentIntentResponse.error);
        setPaymentError(paymentIntentResponse.error); // Set error for display
        return;
      }

      const { clientSecret } = paymentIntentResponse;

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error("Confirmation Error:", confirmError.message);
        setPaymentError(confirmError.message);
        return;
      }

      toast.success("Payment successful!");

      // Close the window after 5 seconds
      setTimeout(() => {
        window.close();
      }, 5000);
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentError("Payment failed!");
    }
  };

  // Render the form only if policy and tax are loaded
  if (!policy || !tax) {
    return <div>Loading...</div>; // Display loading state until data is ready
  }

  return (
    <>
      <div className="d-flex">
        <div className="justify-content-start payment-img">
          <img src={payment} alt="paymentImage" />
        </div>
        <div className="payment-container">
          <div className="payment-form-container mt-5">
            <h1 className="payment-title">Fortune Life Payments</h1>

            <div className="container mt-5">
              <form onSubmit={handleSubmit} className="payment-form">
                <div className="form-group">
                  <label htmlFor="cardDetails" className="form-label">
                    Card Details
                  </label>
                  <div id="cardDetails" className="card-element-container shadow-sm rounded">
                    <CardElement />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cardType" className="form-label">
                    Card Type
                  </label>
                  <select id="cardType" className="form-control rounded" value={paymentData.paymentType} onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input id="amount" className="form-control disabled-input rounded" type="text" value={paymentData.amount || ""} disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="tax" className="form-label">
                    Tax
                  </label>
                  <input id="tax" className="form-control disabled-input rounded" type="text" value={paymentData.tax || ""} disabled />
                </div>

                <div className="form-group">
                  <label htmlFor="totalPayment" className="form-label">
                    Total Payment
                  </label>
                  <input id="totalPayment" className="form-control disabled-input rounded" type="text" value={paymentData.totalPayment || ""} disabled />
                </div>

                {paymentError && <div className="alert alert-danger rounded">{paymentError}</div>}

                <button type="submit" className="btn btn-primary btn-block payment-button" style={{ backgroundColor: "hsl(245, 67%, 59%)" }} disabled={!stripe}>
                  Pay Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PaymentComponent = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentComponent;
