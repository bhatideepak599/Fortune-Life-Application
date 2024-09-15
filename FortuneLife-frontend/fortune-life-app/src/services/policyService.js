import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllPolicies = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      customerId: searchParams.customerId || undefined,
      agentId: searchParams.agentId || undefined,
      schemeId: searchParams.schemeId || undefined,
      schemeName: searchParams.schemeName || undefined,
      customerName: searchParams.customerName || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      page: pageNumber,
      size: pageSize,
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

export const getAllCommissions = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      policyId: searchParams.policyId || undefined,
      agentId: searchParams.agentId || undefined,
      commissionType: searchParams.commissionType || undefined,
      customerName: searchParams.agentName || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/policy/commission`,
      {
        headers: {
          Authorization: accessToken,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCommissionsOfLoggedAdmin = async (
  pageSize,
  pageNumber,
  searchParams
) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      policyId: searchParams.policyId || undefined,
      commissionType: searchParams.commissionType || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/policy/all-commission`,
      {
        headers: {
          Authorization: accessToken,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllClient = async (pageSize, pageNumber, searchParams) => {
  try {
    const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;
    const params = {
      id: searchParams.id || undefined,
      customerId: searchParams.customerId || undefined,
      name: searchParams.name || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      page: pageNumber,
      size: pageSize,
    };
    console.log("aya");
    
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/all-clients`, {
      headers: {
        Authorization: accessToken1,
      },
      params,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
