import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllWithdrawals = async (pageSize, pageNumber, searchParams) => {
  const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
  try {
    const params = {
      id: searchParams.id || undefined,
      agentId: searchParams.agentId || undefined,
      status: searchParams.status ||undefined,
      page: pageNumber,
      size: pageSize
    };

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/agent/withdrawal-requests`, {
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


export const approveWithdrawal = async (id) => {
  const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/fortuneLife/agent/withdrawal/approve/${id}`,
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
  export const rejectWithdrawal = async (id) => {
    const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/fortuneLife/agent/withdrawal/reject/${id}`,
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

  export const getAllWithdrawalOfAnAgent = async (pageSize, pageNumber, searchParams) => {
    const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    try {
      const params = {
        id: searchParams.id || undefined,
        agentId: searchParams.agentId || undefined,
        status: searchParams.status || undefined,
        page: pageNumber,
        size: pageSize
      };
  
      const response = await axios.get(`${API_BASE_URL}/fortuneLife/agent/allwithdrawal`, {
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
  

  export const claimAmount = async (agentId,amount,agentDto) => {
    const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;
    if (!accessToken) {
      return null;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/fortuneLife/agent/withdrawal/${agentId}`,
        agentDto,
        {
          headers: {
            Authorization: accessToken,
          
          },
          params: {
            amount: amount,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };