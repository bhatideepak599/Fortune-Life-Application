import axios from "axios";
const API_BASE_URL = "http://localhost:8082";

 export const uploadFile = async (formData) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/fortuneLife/file/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Handle the response from the server
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
