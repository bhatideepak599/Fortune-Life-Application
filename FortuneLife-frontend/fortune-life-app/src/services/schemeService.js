import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;

export const getAllPlans = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/plan`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    //console.log("plans22"+response.data[0].id);

    if (response) return response;
  } catch (error) {
    throw error;
  }
};
export const addNewPlan = async (newPlan) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/plan`,
      newPlan,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const getAllSchemesOfUnderAPlan = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    //console.log("planid"+id);

    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/scheme/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const getAllSchemes = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/scheme`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const updateCommission = async (planId, id, formData) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/scheme/update-commission/${planId}/${id}`,
      null, // No request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          profitRatio: formData.profitRatio,
          registrationAmount: formData.registrationAmount,
          installmentRatio: formData.installmentRatio,
        },
      }
    );

    //console.log("Response data:", response.data);

    return response.data;
  } catch (error) {
    //console.error("Error updating commission:", error);
    throw error;
  }
};

export const addNewSchemeUnderAPlan = async (planId, schemeDto) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/scheme/${planId}`, // Adjust URL to match the @PathVariable
      schemeDto, // Pass schemeDto as request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );

    //console.log("Response data:", response.data);

    return response.data;
  } catch (error) {
    //console.error("Error adding new scheme:", error);
    throw error;
  }
};

export const updateSchemeUnderAPlan = async (planId, schemeDto) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/scheme/${planId}`, // Adjust URL to match the @PathVariable
      schemeDto, // Pass schemeDto as request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );

    // console.log("Response data:", response.data);

    return response.data;
  } catch (error) {
    //console.error("Error adding new scheme:", error);
    throw error;
  }
};
export const activateScheme = async (planId, id, schemeDto) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/scheme/activate/${planId}/${id}`,
      schemeDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteASchemeUnderAPlan = async (planId, id) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/fortuneLife/scheme/${planId}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAPlan = async (planId) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/fortuneLife/plan/${planId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const activatePlan = async (planId, schemeDto) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/plan/activate/${planId}`,
      schemeDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
