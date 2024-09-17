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

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/commission`, {
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

export const getAllCommissionsOfLoggedAdmin = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.id || undefined,
      policyId: searchParams.policyId || undefined,
      commissionType: searchParams.commissionType || undefined,
      page: pageNumber,
      size: pageSize,
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/all-commission`, {
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

export const getPolociesReport = async () => {
  try {
    const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy/policy-report`, {
      headers: {
        Authorization: accessToken1,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getRevenueReports = async (startDate, endDate) => {
  try {
    const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/payments/revenue`, {
      headers: {
        Authorization: accessToken,
      },
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    throw new Error(error);
  }
};


export const verifyPolicy = async (policyId, documentDtos) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/policy/${policyId}/verify-policy`, documentDtos, {
      headers: {
        Authorization: accessToken,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPoliciesByEmployee = async (pageSize, pageNumber, searchParams) => {
  try {
    const params = {
      id: searchParams.policyId || undefined,
      customerId: searchParams.customerId || undefined,
      agentId: searchParams.agentId || undefined,
      schemeName: searchParams.schemeName || undefined,
      policyStatus: searchParams.policyStatus || undefined,
      verified: searchParams.verificationStatus || undefined,
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
