import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const addCityToAState = async (selectedState,pincode,cityName) => {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/city/${selectedState}`,
      {
        pincode: pincode,
        name: cityName,

      },
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSchemeToACity = async (schemeId, pincode) => {
  if (!accessToken) {
    //    throw ("Access Denied");
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/city/${pincode}/scheme/${schemeId}`,{},

      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllStates = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/state`, {
      headers: {
        Authorization: accessToken,
      },
    });
    //console.log(response.data);
    
    return response.data;

  } catch (error) {
    throw error;
  }
};

export const removeSchemeFromACity = async (schemeId, pincode) => {
  if (!accessToken) {
    //    throw ("Access Denied");
    return null;
  }

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/fortuneLife/city/${pincode}/scheme/${schemeId}`,
      {
        headers: {
          Authorization: accessToken,
         
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
