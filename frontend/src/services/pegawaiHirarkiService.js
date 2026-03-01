import axios from "axios";

/**
 * 🌐 Backend API URL for Pegawai Hirarki
 */
const API_URL = "http://127.0.0.1:4849/api/pegawai-hirarki";

/**
 * 🔑 Helper to attach JWT token
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
 * 📋 Get all hirarki relationships
 * Returns: id, id_pegawai, id_atasan, valid_dari, valid_sampai
 */
export const getAllHirarki = async () => {
  return axios.get(API_URL, getAuthHeader());
};

/**
 * 🔍 Get hirarki by ID
 */
export const getHirarkiById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * ➕ Create new hirarki
 * Expects: { id_pegawai, id_atasan, valid_dari, valid_sampai }
 */
export const createHirarki = async (hirarkiData) => {
  return axios.post(API_URL, hirarkiData, getAuthHeader());
};

/**
 * ✏️ Update hirarki
 */
export const updateHirarki = async (id, hirarkiData) => {
  return axios.put(`${API_URL}/${id}`, hirarkiData, getAuthHeader());
};

/**
 * 🗑️ Delete hirarki
 */
export const deleteHirarki = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};