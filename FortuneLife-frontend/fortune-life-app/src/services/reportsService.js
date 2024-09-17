import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;
const token = `Bearer ${localStorage.getItem("accessToken")}`;

export const getCustomersPdfReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/reports/customer/pdf-report/download`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCustomersExcelReport = async () => {
  try {
    // return response;
  } catch (error) {
    throw error;
  }
};

export const getAgentsPdfReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/reports/agent/pdf-report/download`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getAgentsExcelReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/reports/agent/excel-report/download`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getWithdrawalsPdfReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/reports/agent/withdrawal/pdf-report/download`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getWithdrawalsExcelReport = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/reports/agent/withdrawal/excel-report/download`, {
      headers: {
        Authorization: token,
      },
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getReportCount = async () => {
  const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;
  try {
    const reponse = await axios.get(`${API_BASE_URL}/fortuneLife/admin/count`, {
      headers: {
        Authorization: accessToken1,
      },
    });
    console.log(reponse);
    return reponse.data;
  } catch (error) {
    throw error;
  }
};
