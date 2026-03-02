import axios from "axios";

/**
 * 🌐 Backend API URL
 * Adjust the port if your backend runs on a different one (e.g., 4849 or 5000)
 */
const API_URL = "http://127.0.0.1:4849/api/pegawai";

/**
 * 🔑 Helper to get the auth header
 * Ensures every request sends the JWT token from localStorage
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
 * 📋 Get all pegawai records
 * Fetches: id, nama, nip, jabatan, email
 */
export const getPegawai = async () => {
  return axios.get(API_URL, getAuthHeader());
};

/**
 * 🔍 Get a single pegawai by ID
 * Useful for the "Edit" form initialization
 */
export const getPegawaiById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeader());
};

/**
 * ➕ Create a new pegawai
 * Expects: { nama, nip, jabatan, email }
 */
export const createPegawai = async (pegawaiData) => {
  return axios.post(API_URL, pegawaiData, getAuthHeader());
};

/**
 * ✏️ Update an existing pegawai
 * Expects: id and { nama, nip, jabatan, email }
 */
export const updatePegawai = async (id, pegawaiData) => {
  return axios.put(`${API_URL}/${id}`, pegawaiData, getAuthHeader());
};

/**
 * 🗑️ Delete a pegawai
 */
export const deletePegawai = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeader());
};