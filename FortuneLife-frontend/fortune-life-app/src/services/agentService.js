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
 
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/agent`,agentDto,
      
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAgents = async (pageSize,
  pageNumber,
  searchParams) => {
    const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;
 
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/agent`, {
      headers: {
        Authorization: accessToken1, 
      },
      params:{
        id: searchParams.id!==""?searchParams.id:null, 
        userName: searchParams.username!==""?searchParams.username:null, 
        name: searchParams.name!==""?searchParams.name:null, 
        mobileNumber: searchParams.mobileNumber!==""?searchParams.mobileNumber:null, 
        email: searchParams.email!==""?searchParams.email:null,
        active: searchParams.active!==""?searchParams.active:null, 
        verified: searchParams.verified!==""?searchParams.verified:null, 
        page: pageNumber,
        size: pageSize
      }
   
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

export const getLoggedAgent = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/agent/loggedAgent`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
