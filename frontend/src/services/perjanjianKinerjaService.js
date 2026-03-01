import axiosInstance from "@/utils/axiosInstance";

export const getPerjanjian = async (tahun, eselon) => {
  const res = await axiosInstance.get(
    `/perjanjian?tahun=${tahun}&eselon=${eselon}`
  );
  return res.data;
};