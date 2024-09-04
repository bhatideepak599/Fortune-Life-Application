import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Payment.css";
import { createPaymentIntent } from "../../services/CustomerService";

const stripePromise = loadStripe("pk_test_51Puzcj2MY7JIifoyC6FTDIlzNncUaOmYkXtV5lKLTh7kkHhQe37YMWF9pbndceIKKYws4IQqwyWTIzYhZkgZ393v00oozKhdhP");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentData, setPaymentData] = useState({
    paymentType: "credit",
    amount: 2000.0,
    policyId: 3,
    tax: 90.0,
    totalPayment: 2090.0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {},
      });

      if (paymentMethodError) {
        console.error(paymentMethodError.message);
        alert(paymentMethodError.message);
        return;
      }

      console.log("PaymentMethod ID ---------> " + paymentMethod.id);

      // Create PaymentIntent on the server
      const paymentIntentResponse = await createPaymentIntent({
        policyId: paymentData.policyId,
        paymentMethodId: paymentMethod.id,
        paymentType: paymentData.paymentType,
        amount: paymentData.amount,
        tax: paymentData.tax,
        totalPayment: paymentData.totalPayment,
      });

      console.log("Payment Intent Response:", paymentIntentResponse);

      if (paymentIntentResponse.error) {
        console.error("PaymentIntent Error:", paymentIntentResponse.error);
        alert(paymentIntentResponse.error);
        return;
      }

      const { clientSecret } = paymentIntentResponse;

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error("Confirmation Error:", confirmError.message);
        alert(confirmError.message);
      } else {
        alert("Payment successful!");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="cardDetails">Card Details</label>
        <div id="cardDetails" className="card-element-container">
          <CardElement />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cardType">Card Type</label>
        <select id="cardType" className="form-control" value={paymentData.paymentType} onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input id="amount" className="form-control disabled-input" type="text" value={paymentData.amount} disabled />
      </div>

      <div className="form-group">
        <label htmlFor="tax">Tax</label>
        <input id="tax" className="form-control disabled-input" type="text" value={paymentData.tax} disabled />
      </div>

      <div className="form-group">
        <label htmlFor="totalPayment">Total Payment</label>
        <input id="totalPayment" className="form-control disabled-input" type="text" value={paymentData.totalPayment} disabled />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={!stripe}>
        Pay Now
      </button>
    </form>
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
