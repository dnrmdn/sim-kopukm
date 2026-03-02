import { useNavigate, useParams } from "react-router-dom";
import { 
  getPegawaiById, 
  updatePegawai, 
  getPegawai
} from "../../../services/pegawaiService";
import FormPegawai from "./formPegawai";
import { useEffect, useState } from "react";

export default function EditPegawai() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pegawai, setPegawai] = useState(null);
  const [pegawaiList, setPegawaiList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          getPegawaiById(id),   // ambil detail pegawai
          getPegawai(),      // ambil semua pegawai untuk dropdown atasan
        ]);

        setPegawai(detailRes.data.data);
        setPegawaiList(listRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (data) => {
  console.log("DATA DIKIRIM KE UPDATE:", data); // ⬅️ debug

  try {
    await updatePegawai(id, data);
    alert("Berhasil update");
    navigate("/dokumen/pegawai");
  } catch (error) {
    console.error("Gagal update pegawai:", error);
    alert("Update gagal");
  }
};

  if (!pegawai) {
    return <div className="p-10">Memuat data...</div>;
  }

  return (
    <FormPegawai
      initialData={pegawai}
      onSubmit={handleUpdate}
      isEdit
      pegawaiList={
        pegawaiList.filter(p => p.id_pegawai !== pegawai.id_pegawai)
      }
    />
  );
}