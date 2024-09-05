import axios from 'axios';
const API_BASE_URL = "http://localhost:8082";

export const loginAuth = async (username, password, role) => {
   // console.log(username+" "+password+" "+role+"=====================");
    
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/auth/login`, {
        usernameOrEmail: username,
      password: password,
      role: role
    });
    
    const expirationTime = new Date().getTime() + 30 * 60 * 1000;
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("expirationTime", expirationTime);
  
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async() => {
  const accessToken=localStorage.getItem("accessToken")
  if(accessToken==null){
    return null;
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/auth/logout`, {
      params: {
        token: accessToken,
      },
    });
    if(response.data)
    {localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("expirationTime");
    return response;
  }
}catch(error){
  throw error;
}
};

export const verifyUser= async(accessToken,userRole)=>{
  try{
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/auth/user`, {
      params: {
        token: accessToken,
        role:  userRole
      },
    });
    return response.data;
  }catch(error){
    throw error;
  }
}