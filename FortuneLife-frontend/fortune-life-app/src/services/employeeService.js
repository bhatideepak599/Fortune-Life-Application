import axios from "axios";
import { verifyUser } from "./authService";
import { warnToast } from "../utils/Toast";
const accessToken = localStorage.getItem("accessToken");
const API_BASE_URL = `http://localhost:8082`;
//const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

// export const updateCustomer = async ({ userDto }) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/fortuneLife/employee`,
//       {
//         id: userDto.id,
//         username: userDto.username,
//         password: userDto.password,
//         firstName: userDto.firstName,
//         gender: userDto.gender,
//         active: userDto.active,
//         lastName: userDto.lastName,
//         mobileNumber: userDto.mobileNumber,
//         email: userDto.email,
//         dateOfBirth: userDto.dateOfBirth,
//         addressDto: addressDto,
//       },
//       {
//         headers: {
//           Authorization: accessToken,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const addEmployee = async (employeeDto) => {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/employee`,
      employeeDto,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          role: "employee", 
        },
      }
    );
    return response.data; 
  } catch (error) {
    throw error; 
  }
};

export const validateEmployee = (accessToken1) => {
  if (!accessToken1 || !  verifyUser(accessToken1, "employee")) {
    return false;
  }
  return true;
};

export const getEmployee = async () => {
  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.get(
      `${API_BASE_URL}/fortuneLife/employee/logged`,
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

export const updateEmployee = async (id, userDto, addressDto) => {
  const payload = {
    id: id,
    userDto: {
      ...userDto,
      addressDto: addressDto || null,
    },
  };
  console.log("Payload being sent:", payload);

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/employee`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response);

    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error; 
  }
};
