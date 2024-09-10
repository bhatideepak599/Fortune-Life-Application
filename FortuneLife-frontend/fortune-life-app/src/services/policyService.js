import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllPolicies = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      customerId: searchParams.agentId || undefined,
      agentId: searchParams.customerId || undefined,
      schemeId: searchParams.schemeId || undefined,
      schemeName: searchParams.schemeName || undefined,
      customerName: searchParams.customerName || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      page: pageNumber,
      size: pageSize
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy`, {
      headers: {
        Authorization: accessToken,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
