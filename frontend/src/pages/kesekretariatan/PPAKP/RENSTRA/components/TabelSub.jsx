import React, { useEffect, useState } from "react";
import { CornerDownRight, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

export default function TabelSub({ kegiatanId, YEARS = [] }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cukup panggil satu API saja karena data anggaran sudah include di dalamnya
        const res = await axiosInstance.get(`/renstra/sub-kegiatan?kegiatan_id=${kegiatanId}`);
        
        // Langsung set data dari response backend
        setSubs(res.data || []);
      } catch (err) {
        console.error("Gagal ambil data sub:", err);
      } finally {
        setLoading(false);
      }
    };

    if (kegiatanId) fetchData();
  }, [kegiatanId]);

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
        <tr key={`sub-${s.id}`} className="bg-white hover:bg-slate-50 transition-colors group">
          <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 pl-20 pr-6 py-3 border-b border-r border-slate-200">
            <div className="flex gap-2 items-start">
              <CornerDownRight size={14} className="text-slate-300 mt-1 shrink-0" />
              <div>
                <span className="text-[7px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded uppercase mb-1 inline-block font-black tracking-tighter">Sub Kegiatan</span>
                <div className="leading-tight text-[10px] text-slate-600 font-medium lowercase first-letter:uppercase">
                  <span className="font-bold mr-1">{s.kodering}</span> {s.nama_sub}
                </div>
              </div>
            </div>
          </td>

          <td className="px-4 py-3 border-b border-r border-slate-200 text-[10px] text-slate-500">{s.indikator_sub || "-"}</td>
          <td className="px-4 py-3 border-b border-r border-slate-200 text-[10px] text-slate-400 italic">{s.output_sub || "-"}</td>
          <td className="px-4 py-3 border-b border-r border-slate-200 text-center font-bold text-slate-500 text-[10px]">{s.satuan || "-"}</td>

          {/* Kolom Anggaran per Tahun */}
          {YEARS.map((y) => {
            // Kita cari di dalam s.anggaran yang sudah dibawa oleh backend
            // Gunakan Number(y) untuk memastikan perbandingan tipe data benar
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

          <td className="sticky right-0 z-20 bg-white group-hover:bg-slate-50 px-4 py-3 border-b border-l border-slate-200 text-center"></td>
        </tr>
      ))}
    </>
  );
}