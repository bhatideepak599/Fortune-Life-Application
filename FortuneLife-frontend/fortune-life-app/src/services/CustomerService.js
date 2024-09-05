import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;

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
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return { error: error.message };
  }
};

export const getCustomerById = async ({ id }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buyNewPolicy = async({customerId, schemeId})=>{
  try{
const response = await axios.post(`${API_BASE_URL}/fortuneLife/customer/${customerId}/Insurance-Scheme/${schemeId}/policy`,{
  
})
  }catch(error){
    throw error;
  }
}
