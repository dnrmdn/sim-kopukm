import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};