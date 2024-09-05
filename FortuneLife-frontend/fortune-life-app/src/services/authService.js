import axios from 'axios';
const API_BASE_URL = "http://localhost:8082/fortuneLife/auth";

export const loginAuth = async (username, password, role) => {
    console.log(username+" "+password+" "+role+"=====================");
    
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
        usernameOrEmail: username,
      password: password,
      role: role
    });
    
    const expirationTime = new Date().getTime() + 30 * 60 * 1000;
    localStorage.setItem("authToken", response.data.accessToken);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("expirationTime", expirationTime);
  
    return response.data;
  } catch (error) {
    throw error;
  }
};