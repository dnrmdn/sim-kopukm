import React, { useEffect, useState } from "react";
import { CornerDownRight, Loader2, Edit3, Trash2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import EditSubModal from "./EditSubModal";

export default function TabelSub({ kegiatanId, YEARS = [] }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSub, setSelectedSub] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/renstra/sub-kegiatan?kegiatan_id=${kegiatanId}`);
      setSubs(res.data || []);
    } catch (err) {
      console.error("Gagal ambil data sub:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kegiatanId) fetchData();
  }, [kegiatanId]);

  // HANDLE REMOVE ALL (GABREED LOGIC)
  const handleDelete = async (id, nama) => {
    const result = await Swal.fire({
      title: "Hapus Sub Kegiatan?",
      text: `Seluruh data anggaran untuk "${nama}" akan ikut terhapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#64748b", // slate-500
      confirmButtonText: "Ya, Hapus Semua!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        // Pake endpoint remove-all yang tadi kita buat
        await axiosInstance.delete(`/renstra/sub-kegiatan-anggaran/remove-all/${id}`);
        
        Swal.fire({
          title: "Terhapus!",
          text: "Data identitas & anggaran berhasil dibersihkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        fetchData(); // Refresh list setelah hapus
      } catch (err) {
        console.error("Gagal hapus:", err);
        Swal.fire("Gagal!", err.response?.data?.message || "Terjadi kesalahan", "error");
      }
    }
  };

  if (loading) {
    return (
      <tr>
        <td colSpan={YEARS.length * 2 + 5} className="py-2 pl-20 bg-slate-50/50">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
            <Loader2 size={12} className="animate-spin" /> Sedang memuat Sub Kegiatan...
          </div>
        </td>
      </tr>
    );
  }

  if (subs.length === 0) return null;

  return (
    <>
      {subs.map((s) => (
        <tr 
          key={`sub-${s.id}`} 
          className="bg-white hover:bg-slate-50 transition-colors group"
        >
          {/* IDENTITAS */}
          <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 pl-20 pr-6 py-3 border-b border-r border-slate-200">
            <div className="flex gap-2 items-start">
              <CornerDownRight size={14} className="text-slate-300 mt-1 shrink-0" />
              <div>
                <span className="text-[7px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded uppercase font-black">Sub Kegiatan</span>
                <div className="leading-tight text-[10px] text-slate-600 font-medium lowercase first-letter:uppercase">
                  <span className="font-bold mr-1 text-slate-800">{s.kodering}</span> {s.nama_sub}
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-3 border-b border-r border-slate-200 text-[10px] text-slate-500">{s.indikator_sub || "-"}</td>
          <td className="px-4 py-3 border-b border-r border-slate-200 text-[10px] text-slate-400 italic">{s.output_sub || "-"}</td>
          <td className="px-4 py-3 border-b border-r border-slate-200 text-center font-bold text-slate-500 text-[10px]">{s.satuan || "-"}</td>

          {/* DATA ANGGARAN 5 TAHUN */}
          {YEARS.map((y) => {
            const ang = s.anggaran?.find((a) => Number(a.tahun) === Number(y));
            return (
              <React.Fragment key={`v-sub-${y}-${s.id}`}>
                <td className="px-3 py-3 border-b border-r border-slate-100 text-center font-bold text-slate-400 text-[10px]">
                  {ang ? parseFloat(ang.target).toLocaleString('id-ID') : "0"}
                </td>
                <td className="px-3 py-3 border-b border-r border-slate-200 text-right font-bold text-indigo-600 bg-indigo-50/20 text-[10px]">
                  {ang ? Number(ang.pagu).toLocaleString('id-ID') : "0"}
                </td>
              </React.Fragment>
            );
          })}

          {/* AKSI */}
          <td className="sticky right-0 z-20 bg-white group-hover:bg-slate-50 px-4 py-3 border-b border-l border-slate-200 text-center shadow-[-2px_0_5px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-center gap-1.5">
              <button 
                onClick={() => {
                  setSelectedSub(s);
                  setShowEditModal(true);
                }} 
                className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-all active:scale-90"
              >
                <Edit3 size={11} />
              </button>
              <button 
                onClick={() => handleDelete(s.id, s.nama_sub)} 
                className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 shadow-sm transition-all active:scale-90"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </td>
        </tr>
      ))}

      {/* MODAL EDIT */}
      {selectedSub && (
        <EditSubModal 
          open={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedSub(null); // Clear selection pas tutup
          }} 
          onSuccess={fetchData} 
          subData={selectedSub}
          YEARS={YEARS}
        />
      )}
    </>
  );
}