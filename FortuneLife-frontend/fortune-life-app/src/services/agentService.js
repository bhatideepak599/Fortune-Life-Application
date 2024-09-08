import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const addAgent = async (agentDto) => {
    
    
  if (!accessToken) {
//    throw ("Access Denied");
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/agent`,
      agentDto,
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        params: {
          role: "agent", // Adjust the role value as needed
        },
      }
    );
    return response.data; // Return the data from the response
  } catch (error) {
    throw error; // Optional: re-throwing to be handled by the calling code
  }
};
