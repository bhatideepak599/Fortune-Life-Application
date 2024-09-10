import axios from "axios";

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
    const accessToken = localStorage.getItem("accessToken"); 
  
    if (!accessToken) {
      console.error("No access token available.");
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
            role: "employee", // Adjust the role value as needed
          },
        }
      );
      return response.data; // Return the data from the response
    } catch (error) {
     
      throw error; // Optional: re-throwing to be handled by the calling code
    }
  };