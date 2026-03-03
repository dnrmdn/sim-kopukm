import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Plus, ChevronDown, RefreshCw } from "lucide-react";
import AddKegiatanModal from "./AddKegiatanModal";
import TabelKegiatan from "./TabelKegiatan";

export default function TabelProgram({ apiBase = "/renstra/program" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPrograms, setExpandedPrograms] = useState({});
  const [kegiatanData, setKegiatanData] = useState({});

  const [isModalKegiatanOpen, setIsModalKegiatanOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState(null);
  
  // Konfigurasi tahun sesuai struktur tabel
  const YEARS = [2025, 2026, 2027, 2028, 2029];

  useEffect(() => { fetchData(); }, [apiBase]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(apiBase);
      setData(res.data || []);
    } catch (err) { 
      console.error("Gagal load program:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const toggleProgram = async (programId) => {
    const isExpanding = !expandedPrograms[programId];
    if (isExpanding && !kegiatanData[programId]) {
      try {
        // Mengambil data kegiatan yang sekarang juga sudah membawa array anggaran
        const res = await axiosInstance.get(`/renstra/kegiatan?program_id=${programId}`);
        setKegiatanData(prev => ({ ...prev, [programId]: res.data }));
      } catch (err) {
        console.error("Gagal load data kegiatan:", err);
      }
    }
    setExpandedPrograms(s => ({ ...s, [programId]: isExpanding }));
  };

  const openAddKegiatan = (prog) => {
    setActiveProgram(prog);
    setIsModalKegiatanOpen(true);
  };

  return (
    <div className="w-full bg-white overflow-hidden flex flex-col h-full">
      {/* TOOLBAR */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 italic uppercase">
            <span className="bg-blue-600 text-white px-2 py-1 rounded">RENSTRA</span>
            Matriks Program & Kegiatan
        </div>
        <button onClick={fetchData} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
          <RefreshCw size={16} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[800px]">
        <table className="w-full border-separate border-spacing-0 min-w-[2000px]">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px]">
              <th rowSpan={2} className="sticky left-0 z-50 w-[400px] px-6 py-4 text-left font-black border-r border-slate-700 bg-slate-900 uppercase">Nomenklatur Perencanaan</th>
              <th rowSpan={2} className="w-[250px] px-4 py-4 text-left font-black border-r border-slate-700 uppercase">Indikator</th>
              <th rowSpan={2} className="w-[250px] px-4 py-4 text-left font-black border-r border-slate-700 uppercase">Output</th>
              <th rowSpan={2} className="w-[100px] px-4 py-4 text-center font-black border-r border-slate-700 uppercase">Satuan</th>
              {YEARS.map(y => (
                <th key={y} colSpan={2} className="px-4 py-3 text-center font-black border-b border-r border-slate-700 bg-slate-800 uppercase text-[10px]">Tahun {y}</th>
              ))}
              <th rowSpan={2} className="sticky right-0 z-50 w-[100px] bg-slate-900 px-4 py-4 text-center font-black border-l border-slate-700 uppercase text-[10px]">Aksi</th>
            </tr>
            <tr className="bg-slate-800 text-slate-400 text-[10px] font-black uppercase">
              {YEARS.map(y => (
                <React.Fragment key={`h-${y}`}>
                  <th className="px-3 py-3 text-center border-r border-slate-700 w-[80px]">Target</th>
                  <th className="px-3 py-3 text-center border-r border-slate-700 w-[150px]">Pagu (Rp)</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody className="text-sm">
            {data.map((p) => (
              <React.Fragment key={`p-${p.id}`}>
                {/* --- ROW PROGRAM (LEVEL 1) --- */}
                <tr className="bg-blue-50/40 hover:bg-blue-50 transition-colors group">
                  <td 
                    className="sticky left-0 z-40 bg-white group-hover:bg-blue-50 px-6 py-5 border-b border-r border-slate-200 font-black text-blue-900 cursor-pointer"
                    onClick={() => toggleProgram(p.id)}
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`mt-1 p-1.5 rounded-xl border-2 transition-all ${expandedPrograms[p.id] ? 'bg-blue-600 border-blue-600 text-white rotate-180' : 'bg-white border-blue-200 text-blue-600'}`}>
                        <ChevronDown size={14} />
                      </div>
                      <div>
                        <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded uppercase mb-1 inline-block font-black">Program</span>
                        <div className="leading-tight uppercase tracking-tight">
                            <span className="text-blue-500 mr-1 font-black">{p.kodering}</span> {p.nama_program}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-5 border-b border-r border-slate-200 text-xs font-bold text-blue-700 italic bg-blue-50/20">
                    {p.indikator_program || "-"}
                  </td>
                  
                  <td className="px-4 py-5 border-b border-r border-slate-200 text-xs font-medium text-slate-500 italic">
                    {p.output_program || "-"}
                  </td>

                  <td className="px-4 py-5 border-b border-r border-slate-200 text-center font-black text-slate-400">{p.satuan || "-"}</td>
                  
                  {/* KOLOM ANGGARAN PROGRAM PER TAHUN */}
                  {YEARS.map(y => {
                    // Mencari data anggaran program yang sesuai tahun y
                    const ang = p.anggaran?.find(a => Number(a.tahun) === Number(y));
                    
                    return (
                      <React.Fragment key={`p-val-${y}`}>
                        {/* Target Program */}
                        <td className="px-3 py-5 border-b border-r border-slate-200 text-center font-black text-slate-700 text-xs">
                          {ang ? parseFloat(ang.target).toLocaleString('id-ID') : "0"}
                        </td>
                        {/* Pagu Program */}
                        <td className="px-3 py-5 border-b border-r border-slate-200 text-right font-black text-blue-700 bg-blue-50/10 text-xs">
                          {ang ? Number(ang.pagu).toLocaleString('id-ID') : "0"}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  <td className="sticky right-0 z-40 bg-white group-hover:bg-blue-50 px-4 py-5 border-b border-l border-slate-200 text-center text-[10px]">
                    <button onClick={() => openAddKegiatan(p)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform active:scale-95 shadow-md">
                      <Plus size={14} />
                    </button>
                  </td>
                </tr>

                {/* --- RENDER ANAK (KEGIATAN) --- */}
                {expandedPrograms[p.id] && (
                  <TabelKegiatan 
                    kegiatans={kegiatanData[p.id] || []} 
                    YEARS={YEARS} 
                    onSuccess={fetchData} // Teruskan fetchData agar saat input sub, angka program ikut refresh
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <AddKegiatanModal 
        open={isModalKegiatanOpen}
        onClose={() => setIsModalKegiatanOpen(false)}
        onSuccess={fetchData}
        programId={activeProgram?.id}
        programName={activeProgram?.nama_program}
      />
    </div>
  );
}