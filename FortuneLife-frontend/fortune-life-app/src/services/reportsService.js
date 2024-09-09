import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;
const token = `Bearer ${localStorage.getItem("accessToken")}`;

export const getCustomersPdfReport = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/reports/customer/pdf-report/download`,
      {
        headers: {
          Authorization: token,
        },
        responseType: 'blob',
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCustomersExcelReport = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/reports/customer/excel-report/download`,
      {
        headers: {
          Authorization: token,
        },
        responseType: 'blob', 
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};


export const getAgentsPdfReport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fortuneLife/reports/agent/pdf-report/download`,
        {
          headers: {
            Authorization: token,
          },
          responseType: 'blob',
        }
      );
  
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  export const getAgentsExcelReport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fortuneLife/reports/agent/excel-report/download`,
        {
          headers: {
            Authorization: token,
          },
          responseType: 'blob', 
        }
      );
  
      return response;
    } catch (error) {
      throw error;
    }
  };
  