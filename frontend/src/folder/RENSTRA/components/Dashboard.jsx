import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import logo_baru from "@/assets/logo_baru.png";
import logo_kabkar from "@/assets/logo_karawang.png";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get("/renstra/dashboard/stats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Gagal memuat statistik", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full bg-white p-8 border-b border-slate-200">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
        
        {/* LOGO SECTION */}
        <div className="flex gap-4 items-center">
          <img src={logo_baru} alt="Logo Disperindag" className="h-16 w-auto" />
          <img src={logo_kabkar} alt="Logo Karawang" className="h-16 w-auto" />
        </div>

        {/* INFO SECTION */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-lg font-black text-slate-900 uppercase">
            Dinas Perindustrian dan Perdagangan
          </h1>
          <h2 className="text-sm font-bold text-slate-600">
            Kabupaten Karawang
          </h2>
          <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
            Rencana Strategis (RENSTRA) 2025-2030
          </p>
        </div>
      </div>

      {/* STATS SECTION */}
      {stats && (
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          {[
            { label: "Total Program", val: stats.total_program },
            { label: "Total Kegiatan", val: stats.total_kegiatan },
            { label: "Total Sub Kegiatan", val: stats.total_sub_kegiatan },
            { label: "Total Dokumen", val: stats.total_dokumen },
          ].map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">{item.label}</p>
              <p className="text-xl font-black text-blue-800">{item.val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}