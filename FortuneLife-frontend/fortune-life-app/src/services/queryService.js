import axios from "axios";
const API_BASE_URL = `http://localhost:8082`;
const accessToken = `Bearer ${localStorage.getItem("accessToken")}`;

export const getAllQueries = async (pageSize, pageNumber, searchParams) => {
  const accessToken1 = `Bearer ${localStorage.getItem("accessToken")}`;
  try {
   // console.log("aya");

    const response = await axios.get(`${API_BASE_URL}/fortuneLife/query`, {
      headers: {
        Authorization: accessToken1,
      },

      params: {
        id: searchParams.id !== "" ? searchParams.id : null,
        title: searchParams.title !== "" ? searchParams.title : null,
        question: searchParams.question !== "" ? searchParams.question : null,
        answer: searchParams.answer !== "" ? searchParams.answer : null,
        queryResponse:
          searchParams.queryResponse !== "" ? searchParams.queryResponse : null,
        active: searchParams.active !== "" ? searchParams.active : null,
        page: pageNumber,
        size: pageSize,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const answerQuery = async (query) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/fortuneLife/query/answer`,
      query,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
   // console.log(response);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
