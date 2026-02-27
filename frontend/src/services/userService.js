import axios from "axios";

const API_URL = "http://127.0.0.1:4849/api/auth";

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};