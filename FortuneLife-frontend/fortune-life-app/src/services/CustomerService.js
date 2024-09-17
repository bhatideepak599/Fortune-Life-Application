import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;
const token = `Bearer ${localStorage.getItem("accessToken")}`;

export const getCustomerById = async ({ id }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/customer/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buyNewPolicy = async ({ customerId, schemeId, dataToSend }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/customer/${customerId}/Insurance-Scheme/${schemeId}/policy`,
      {
        premiumType: dataToSend.premiumType,
        policyAmount: dataToSend.policyAmount,
        time: dataToSend.time,
        premiumAmount: dataToSend.premiumAmount,
        nomineeName: dataToSend.nomineeName,
        relationStatusWithNominee: dataToSend.relationStatusWithNominee,
        submittedDocumentsDto: dataToSend.submittedDocumentsDto,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buyNewPolicyByAgent = async ({ customerId, schemeId, agentId, dataToSend }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/customer/${customerId}/Insurance-Scheme/${schemeId}/agent/${agentId}/policy`,
      {
        premiumType: dataToSend.premiumType,
        policyAmount: dataToSend.policyAmount,
        time: dataToSend.time,
        premiumAmount: dataToSend.premiumAmount,
        nomineeName: dataToSend.nomineeName,
        relationStatusWithNominee: dataToSend.relationStatusWithNominee,
        submittedDocumentsDto: dataToSend.submittedDocumentsDto,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async ({ userDto, addressDto }) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/customer`,
      {
        id: userDto.id ? userDto.id : null,
        username: userDto.username ? userDto.username : null,
        password: userDto.password ? userDto.password : null,
        firstName: userDto.firstName ? userDto.firstName : null,
        gender: userDto.gender ? userDto.gender : null,
        active: userDto.active ? userDto.active : null,
        lastName: userDto.lastName ? userDto.lastName : null,
        mobileNumber: userDto.mobileNumber ? userDto.mobileNumber : null,
        email: userDto.email ? userDto.email : null,
        dateOfBirth: userDto.dateOfBirth ? userDto.dateOfBirth : null,
        addressDto: addressDto ? addressDto : null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerByAdmin = async (customer) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/customer`, customer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllCustomers = async (pageSize, pageNumber, searchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/customer`, {
      headers: {
        Authorization: token,
      },
      params: {
        id: searchParams.id !== "" ? searchParams.id : null,
        userName: searchParams.username !== "" ? searchParams.username : null,
        name: searchParams.name !== "" ? searchParams.name : null,
        mobileNumber: searchParams.mobileNumber !== "" ? searchParams.mobileNumber : null,
        email: searchParams.email !== "" ? searchParams.email : null,
        active: searchParams.active !== "" ? searchParams.active : null,
        verified: searchParams.verified !== "" ? searchParams.verified : null,
        page: pageNumber,
        size: pageSize,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/fortuneLife/customer/${id}`, {
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

export const activateCustomer = async (id) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/customer/activate/${id}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPoliciesByCustomerId = async ({ policyId, schemeName, policyStatus, customerId, page, size }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/policy`, {
      headers: {
        Authorization: token,
      },
      params: {
        id: policyId ? policyId : null,
        schemeName: schemeName ? schemeName : null,
        policyStatus: policyStatus ? policyStatus : null,
        customerId: customerId ? customerId : null,
        page,
        size,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimByClaimId = async (claimId) => {
  try {
    const respnse = await axios.get(`${API_BASE_URL}/fortuneLife/claim/${claimId}`, {
      headers: {
        Authorization: token,
      },
    });

    return respnse.data;
  } catch (error) {
    throw error;
  }
};

export const applyForClaim = async (customerId, policyId, payload, claimAmount) => {
  console.log(claimAmount);
  console.log(payload);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/claim/customer/${customerId}/Insurance-policy/${policyId}`,
      {
        id: payload.id || null, // Correct: Lowercase 'id'
        claimAmount,
        bankName: payload.bankName || null,
        branchName: payload.branchName || null,
        bankAccountNumber: payload.bankAccountNumber || null,
        ifscCode: payload.ifscCode || null,
        remarks: payload.remarks || null,
      },
      {
        headers: {
          Authorization: token, // Ensure token is correctly formatted
          "Content-Type": "application/json", // Explicitly set Content-Type
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in applyForClaim:", error.response); // Log error response for more details
    throw error;
  }
};

export const addnewCustomer = async (userDto, addressDto) => {
  try {
    console.log(userDto);
    console.log(addressDto);

    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/customer`,
      {
        firstName: userDto.firstName ? userDto.firstName : null,
        lastName: userDto.lastName ? userDto.lastName : null,
        username: userDto.username ? userDto.username : null,
        password: userDto.password ? userDto.password : null,
        email: userDto.email ? userDto.email : null,
        mobileNumber: userDto.mobileNumber ? userDto.mobileNumber : null,
        gender: userDto.gender ? userDto.gender : null,
        dateOfBirth: userDto.dateOfBirth ? userDto.dateOfBirth : null,
        addressDto: addressDto ? addressDto : null,
      },
      {
        headers: {
          Authorization: token,
        },
        params: {
          role: "customer",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQueriesByCustomerEmail = async (params) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/query/${params.customerEmail}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        id: params.id || null,
        title: params.title || null,
        page: params.pageNumber,
        size: params.size,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching queries.";
  }
};

export const addNewQuery = async (queryData) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/query`, queryData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error creating new query.";
  }
};

export const updateSubmittedDocuments = async (policyId, documentDtos) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/policy/${policyId}/update-document`, documentDtos, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
