import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = localStorage.getItem("accessToken");

export const setTaxGlobally = async (tax) => {
  if (!accessToken) {
    //    throw ("Access Denied");
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/tax/set-tax`,{},

      {
       
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          taxRate: tax.taxRate,
          deductionRate: tax.deductionRate,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getTax = async () => {
 
  try {
    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/tax/get-tax`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
};
