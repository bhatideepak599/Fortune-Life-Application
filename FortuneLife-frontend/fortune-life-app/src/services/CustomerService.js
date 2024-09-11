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

export const updateCustomer = async ({ userDto, addressDto }) => {
  try {
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
          Authorization: token,
          
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

export const applyForClaim = async (customerId, policyId, claimDto, claimAmount) => {
  console.log(customerId + " " + policyId + " " + claimDto + " " + claimAmount);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/claim/customer/${customerId}/Insurance-policy/${policyId}`,
      {
        claimAmount, // Pass the claimAmount directly
        bankName: claimDto.bankName || null,
        branchName: claimDto.branchName || null,
        bankAccountNumber: claimDto.bankAccountNumber || null,
        ifscCode: claimDto.ifscCode || null,
        remarks: claimDto.remarks || null, // Make sure to pass customer remarks if any
      },
      {
        headers: {
          Authorization: token, // Ensure token is valid
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error in applyForClaim:", error.response); // Log error response for more details
    throw error;
  }
};
