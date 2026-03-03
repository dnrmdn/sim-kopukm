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

  const handleDelete = async (id, nama) => {
    const result = await Swal.fire({
      title: "Hapus Sub Kegiatan?",
      text: `Seluruh data anggaran untuk "${nama}" akan ikut terhapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", 
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus Semua!",
      cancelButtonText: "Batal",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/renstra/sub-kegiatan-anggaran/remove-all/${id}`);
        Swal.fire({
          title: "Terhapus!",
          text: "Data berhasil dibersihkan.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        fetchData(); 
      } catch (err) {
        Swal.fire("Gagal!", err.response?.data?.message || "Terjadi kesalahan", "error");
      }
    }
  };

  if (loading) {
    return (
      <tr>
        <td colSpan={YEARS.length * 2 + 5} className="py-4 pl-20 bg-slate-50/30">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold italic">
            <Loader2 size={14} className="animate-spin text-indigo-500" /> 
            Menyusun Sub Kegiatan...
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
          className="bg-white hover:bg-slate-50/80 transition-colors group text-[12px]"
        >
          {/* IDENTITAS: Gunakan bg-white SOLID agar sticky tidak tumpang tindih */}
          <td className="sticky left-0 z-20 bg-white group-hover:bg-[#f8fafc] pl-20 pr-6 py-4 border-b border-r border-slate-200">
            <div className="flex gap-3 items-start">
              <CornerDownRight size={16} className="text-slate-300 mt-1 shrink-0" />
              <div>
                <span className="text-[7px] bg-slate-800 text-white px-1.5 py-0.5 rounded-sm uppercase font-black tracking-tighter mb-1 inline-block">
                  Sub Kegiatan
                </span>
                <div className="leading-tight text-slate-600 font-semibold lowercase first-letter:uppercase tracking-tight">
                  <span className="font-black mr-1 text-indigo-600">{s.kodering}</span> {s.nama_sub}
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-4 border-b border-r border-slate-200 text-slate-500 italic">
            {s.indikator_sub || "-"}
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-200 text-slate-400 italic font-light">
            {s.output_sub || "-"}
          </td>
          <td className="px-4 py-4 border-b border-r border-slate-200 text-center font-bold text-slate-400">
            {s.satuan || "-"}
          </td>

          {/* ANGGARAN */}
          {YEARS.map((y) => {
            const ang = s.anggaran?.find((a) => Number(a.tahun) === Number(y));
            return (
              <React.Fragment key={`v-sub-${y}-${s.id}`}>
                <td className="px-3 py-4 border-b border-r border-slate-100 text-center font-bold text-slate-500">
                  {ang ? parseFloat(ang.target).toLocaleString('id-ID') : "0"}
                </td>
                <td className="px-3 py-4 border-b border-r border-slate-200 text-right font-black text-indigo-600 bg-indigo-50/30">
                  {ang ? Number(ang.pagu).toLocaleString('id-ID') : "0"}
                </td>
              </React.Fragment>
            );
          })}

          {/* AKSI: Gunakan bg-white SOLID */}
          <td className="sticky right-0 z-20 bg-white group-hover:bg-[#f8fafc] px-4 py-4 border-b border-l border-slate-200">
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => {
                  setSelectedSub(s);
                  setShowEditModal(true);
                }} 
                className="p-2 bg-amber-500 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-all active:scale-90"
                title="Edit Sub"
              >
                <Edit3 size={12} />
              </button>
              <button 
                onClick={() => handleDelete(s.id, s.nama_sub)} 
                className="p-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 shadow-sm transition-all active:scale-90"
                title="Hapus Sub"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </td>
        </tr>
      ))}

      {selectedSub && (
        <EditSubModal 
          open={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedSub(null);
          }} 
          onSuccess={fetchData} 
          subData={selectedSub}
          YEARS={YEARS}
        />
      )}
    </>
  );
}