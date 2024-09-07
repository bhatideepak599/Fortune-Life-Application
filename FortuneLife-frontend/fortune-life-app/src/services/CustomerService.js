import axios from "axios";

const API_BASE_URL = `http://localhost:8082`;
const token = `Bearer ${localStorage.getItem("accessToken")}`;

export const createPaymentIntent = async ({ policyId, paymentMethodId, paymentType, amount, tax, totalPayment }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/payments/charge`,
      {
        policyId,
        paymentMethodId,
        paymentType,
        amount,
        tax,
        totalPayment,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return { error: error.message };
  }
};

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

export const buyNewPolicy = async ({ customerId, schemeId, premiumAmount, policyAmount, time, premiumType, nomineeName, relationStatusWithNominee, submittedDocumentsDto }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/customer/${customerId}/Insurance-Scheme/${schemeId}/policy`,
      {
        premiumType,
        policyAmount,
        time,
        premiumAmount,
        nomineeName,
        relationStatusWithNominee,
        submittedDocumentsDto: submittedDocumentsDto,
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

// const submittedDocumentsDto = [
//   {
//     documentName: "Document 1",
//     documentImage: "base64EncodedImageData1",
//   },
//   {
//     documentName: "Document 2",
//     documentImage: "base64EncodedImageData2",
//   },
// ];

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

export const getLoggedInCustomer = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/loggedCustomer`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
