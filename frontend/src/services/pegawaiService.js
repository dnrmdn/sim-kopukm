import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/pegawai`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * 📋 Get all pegawai (returns ARRAY)
 * Must call without ID to get all records
 */
export const getPegawai = async () => {
  // ✅ IMPORTANT: Call without ID to get all pegawai
  return axios.get(API_URL, getAuthHeader());
  // This calls: GET /api/pegawai (not /api/pegawai/something)
};

/**
 * 🔍 Get single pegawai by ID (returns SINGLE OBJECT)
 */
export const getPegawaiById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * ➕ Create new pegawai
 */
export const createPegawai = async (pegawaiData) => {
  return axios.post(API_URL, pegawaiData, getAuthHeader());
};

/**
 * ✏️ Update pegawai
 */
export const updatePegawai = async (id, pegawaiData) => {
  return axios.put(`${API_URL}/${id}`, pegawaiData, getAuthHeader());
};

/**
 * 🗑️ Delete pegawai
 */
export const deletePegawai = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};