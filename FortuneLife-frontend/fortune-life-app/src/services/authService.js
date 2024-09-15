import axios from "axios";
const API_BASE_URL = "http://localhost:8082";

export const loginAuth = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/auth/login`, {
      usernameOrEmail: username,
      password: password,
      role: role,
    });

    if (response) {
      const expirationTime = new Date().getTime() + 30 * 60 * 1000;
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("expirationTime", expirationTime);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/fortuneLife/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("expirationTime");

      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getAdmin = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/admin/logged`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response) return response;
  } catch (error) {
    // throw error;
  }
};

export const verifyUser = async (accessToken, userRole) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/auth/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        role: userRole,
      },
    });

    if (response.data === false) {
      localStorage.clear();
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminDetails = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/admin`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response) return response;
  } catch (error) {
    throw error;
  }
};

export const getLoggedInUser = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/auth/loggedUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (registerDto, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/auth/register`, registerDto, {
      params: { tempRole: role },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (userDto) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken == null) {
    return null;
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/fortuneLife/auth/change-Password`, userDto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response) {
      // const expirationTime = new Date().getTime() + 30 * 60 * 1000;
      localStorage.setItem("accessToken", response.data.accessToken);
      //localStorage.setItem("role", response.data.role);
      // localStorage.setItem("expirationTime", expirationTime);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (sourceType, sourceValue) => {
  const response = await axios.get(`${API_BASE_URL}/fortuneLife/auth/send-otp`, { params: { sourceType, sourceValue } });
  return response.data;
};

export const submitNewPassword = async (data) => {
  const response = await axios.put(`${API_BASE_URL}/fortuneLife/auth/forget-Password`, data);
  return response.data;
};
