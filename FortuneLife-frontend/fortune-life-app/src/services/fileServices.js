import axios from "axios";
const API_BASE_URL = "http://localhost:8082";

export const uploadFile = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;

  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/file/upload`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const fetchFile = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/file/view/${name}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    if (url == null) {
      return;
    }

    return url;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

export const uploadCustomerFile = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fortuneLife/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const fetchImageFile = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/file/view/${name}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: "image/png" }));
    if (url == null) {
      return;
    }

    return url;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

export const fetchSvgFile = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/file/view/${name}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: "image/svg+xml" }));
    if (url == null) {
      return;
    }

    return url;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};

export const fetchPdfFile = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fortuneLife/file/view/${name}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    if (url == null) {
      return;
    }

    return url;
  } catch (error) {
    console.error("Error fetching file:", error);
  }
};
