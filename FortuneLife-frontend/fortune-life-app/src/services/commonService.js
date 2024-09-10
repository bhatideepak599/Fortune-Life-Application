import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;
const token = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllInsurancePlans = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/plan`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchemesByPlanId = async (planId) => {
  try {
    const reponse = await axios.get(`${API_BASE_URL}/fortuneLife/scheme/${planId}`);

    return reponse.data;
  } catch (error) {
    throw error;
  }
};

export const getSchemeByPlanId = async (planId, schemeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/scheme/${planId}/${schemeId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPolicyByPolicyId = async (policyId) => {
  try {
    const reponse = await axios.get(`${API_BASE_URL}/fortuneLife/policy/${policyId}`, {
      headers: {
        Authorization: token,
      },
    });

    return reponse.data;
  } catch (error) {
    throw error;
  }
};

export const getGlobalTax = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/tax/get-tax`, {
      headers: {
        Authorization: token,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createPaymentIntent = async ({ policyId, paymentMethodId, paymentType, amount, tax, totalPayment }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/payments/charge`,
      {
        policyId,
        paymentMethodId,
        paymentType,
        amount,
        tax,
        totalPayment,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return { error: error.message };
  }
};