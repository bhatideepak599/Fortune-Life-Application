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
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/customer`, {
      id: userDto.id,
      username: userDto.username,
      password: userDto.password,
      firstName: userDto.firstName,
      gender: userDto.gender,
      active: userDto.active,
      lastName: userDto.lastName,
      mobileNumber: userDto.mobileNumber,
      email: userDto.email,
      dateOfBirth: userDto.dateOfBirth,
      addressDto: addressDto,
    });

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
  //console.log(searchParams + "================================");

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
        id: policyId,
        schemeName,
        policyStatus,
        customerId,
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
