import axios from "axios";

const API_BASE_URL = `http://localhost:8080`;

const NGROK_URL = `null`;

export const createPaymentIntent = async ({ policyId, paymentMethodId, paymentType, amount, tax, totalPayment }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/payments/charge`, {
      policyId,
      paymentMethodId,
      paymentType,
      amount,
      tax,
      totalPayment,
    });
    console.log(response.data);
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return { error: error.message }; // Handle error case if necessary
  }
};
