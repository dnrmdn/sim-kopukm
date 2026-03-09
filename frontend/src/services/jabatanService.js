import axios from "axios";

// Update the port/URL to match your backend configuration
const API_URL = "http://127.0.0.1:4849/api/jabatan";

/**
 * Helper to get the auth header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * 📋 Get all jabatan records
 */
export const getAllJabatan = async () => {
  return axios.get(API_URL, getAuthHeader());
};

/**
 * 📋 Get all jabatan records sorted by level
 */
export const getJabatanSortedByLevel = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    if (response?.data?.data) {
      const sorted = response.data.data.slice().sort((a, b) => {
        const levelA = a.level || 999;
        const levelB = b.level || 999;
        return levelA - levelB;
      });
      return { ...response, data: { ...response.data, data: sorted } };
    }
    return response;
  } catch (error) {
    console.error("Error fetching jabatan sorted by level:", error);
    throw error;
  }
};

/**
 * 🔍 Get a single jabatan by ID
 */
export const getJabatanById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * ➕ Create a new jabatan
 */
export const createJabatan = async (jabatanData) => {
  return axios.post(API_URL, jabatanData, getAuthHeader());
};

/**
 * ✏️ Update an existing jabatan
 */
export const updateJabatan = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, getAuthHeader());
};

/**
 * 🗑️ Delete a jabatan
 */
export const deleteJabatan = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * 🔍 Get jabatan by level
 */
export const getJabatanByLevel = async (level) => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    if (response?.data?.data) {
      const filtered = response.data.data.filter(j => j.level === level);
      return { ...response, data: { ...response.data, data: filtered } };
    }
    return response;
  } catch (error) {
    console.error(`Error fetching jabatan with level ${level}:`, error);
    throw error;
  }
};