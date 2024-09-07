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

export const getSchemesByPlanId = async (id) => {
  try {
    const reponse = await axios.get(`${API_BASE_URL}/fortuneLife/scheme/${id}`);

    return reponse.data;
  } catch (error) {
    throw error;
  }
};
