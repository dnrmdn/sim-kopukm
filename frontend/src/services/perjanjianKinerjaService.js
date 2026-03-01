import axiosInstance from "@/utils/axiosInstance";

export const getPerjanjianKinerjaEselon2 = async (tahun, perangkatId) => {
  const res = await axiosInstance.get(
    `/perjanjian-kinerja/eselon-2?tahun=${tahun}&perangkat_id=${perangkatId}`
  );
  return res.data;
};