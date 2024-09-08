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
          role: "agent",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAgentByAdmin = async (agentDto) => {
 

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/agent`,agentDto,
      
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data;
  } catch (error) {
    //console.error("Error updating agent:", error);
    throw error;
  }
};

export const getAllAgents = async (searchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/agent`, {
      headers: {
        Authorization: accessToken, // Add the correct authorization format
      },
   
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/fortuneLife/agent/${id}`,
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const activateAgent = async (id) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/agent/activate/${id}`,
      {},
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};
