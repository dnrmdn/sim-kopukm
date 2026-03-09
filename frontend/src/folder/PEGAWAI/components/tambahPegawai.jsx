import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPegawai, getPegawai } from "../../../services/pegawaiService";
import { getJabatanSortedByLevel } from "../../../services/jabatanService";
import FormPegawai from "./formPegawai";

export default function TambahPegawai() {
  const navigate = useNavigate();
  const [pegawaiList, setPegawaiList] = useState([]);
  const [jabatanList, setJabatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch pegawai list
      const pegawaiResponse = await getPegawai();
      setPegawaiList(pegawaiResponse?.data?.data || []);

      // Fetch jabatan list (sorted by level)
      const jabatanResponse = await getJabatanSortedByLevel();
      setJabatanList(jabatanResponse?.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createPegawai(data);
      navigate("/dokumen/pegawai");
    } catch (error) {
      console.error("Gagal menambahkan pegawai:", error);
      alert(error?.response?.data?.message || "Gagal menambahkan pegawai");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <FormPegawai
      onSubmit={handleCreate} 
      pegawaiList={pegawaiList}
      jabatanList={jabatanList}
    />
  );
}