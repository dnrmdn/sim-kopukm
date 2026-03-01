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
 * 🔍 Get a single jabatan by ID
 */
export const getJabatanById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * ➕ Create a new jabatan
 */
export const createJabatan = async (nama_jabatan) => {
  return axios.post(API_URL, { nama_jabatan }, getAuthHeader());
};

/**
 * ✏️ Update an existing jabatan
 */
export const updateJabatan = async (id, nama_jabatan) => {
  return axios.put(`${API_URL}/${id}`, { nama_jabatan }, getAuthHeader());
};

/**
 * 🗑️ Delete a jabatan
 */
export const deleteJabatan = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};