import React, { useState } from "react";
import { Plus, CornerDownRight, ChevronDown } from "lucide-react";
import AddSubModal from "./AddSubModal"; 
import TabelSub from "./TabelSub";

export default function TabelKegiatan({ kegiatans = [], YEARS = [], onSuccess }) {
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  
  // State untuk kontrol accordion (expand/collapse)
  const [expandedKegiatans, setExpandedKegiatans] = useState({});

  const toggleKegiatan = (kegiatanId) => {
    setExpandedKegiatans(prev => ({
      ...prev,
      [kegiatanId]: !prev[kegiatanId]
    }));
  };

  const handleOpenAddSub = (e, kegiatan) => {
    e.stopPropagation(); // Stop bubbling agar row tidak toggle saat klik tombol tambah
    setSelectedKegiatan(kegiatan);
    setShowSubModal(true);
  };

  if (!kegiatans || kegiatans.length === 0) {
    return (
      <tr>
        <td colSpan={YEARS.length * 2 + 5} className="py-6 text-center bg-slate-50 border-b border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">
            -- Belum ada data kegiatan --
          </span>
        </td>
      </tr>
    );
  }

  return (
    <>
      {kegiatans.map((k) => (
        <React.Fragment key={`group-keg-${k.id}`}>
          {/* BARIS KEGIATAN UTAMA */}
          <tr 
            className="bg-amber-50/20 hover:bg-amber-50/50 transition-colors group cursor-pointer"
            onClick={() => toggleKegiatan(k.id)}
          >
            <td className="sticky left-0 z-30 bg-amber-50/10 group-hover:bg-amber-50/50 pl-12 pr-6 py-4 border-b border-r border-slate-200 font-bold text-slate-700 shadow-[4px_0_10px_rgba(0,0,0,0.01)]">
              <div className="flex gap-2 items-start">
                <div className={`mt-1 p-0.5 rounded transition-all ${expandedKegiatans[k.id] ? 'bg-amber-500 text-white rotate-180' : 'text-amber-500'}`}>
                   <ChevronDown size={12} />
                </div>
                <div>
                  <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase mb-1 inline-block font-black">
                    Kegiatan
                  </span>
                  <div className="leading-tight text-[11px] uppercase tracking-tighter">
                    <span className="text-amber-700 font-black mr-1">{k.kodering}</span> 
                    {k.nama_kegiatan}
                  </div>
                </div>
              </div>
            </td>

            <td className="px-4 py-4 border-b border-r border-slate-200 text-[10px] font-bold text-amber-700 italic">
              {k.indikator_kegiatan || "-"}
            </td>
            <td className="px-4 py-4 border-b border-r border-slate-200 text-[10px] font-medium text-slate-400 italic">
              {k.output_kegiatan || "-"}
            </td>
            <td className="px-4 py-4 border-b border-r border-slate-200 text-center font-bold text-slate-500 text-[10px]">
              {k.satuan || "-"}
            </td>
            
            {/* KOLOM ANGGARAN DINAMIS PER TAHUN */}
            {YEARS.map(y => {
              // Cari data anggaran berdasarkan tahun dari array k.anggaran
              const ang = k.anggaran?.find(a => Number(a.tahun) === Number(y));
              
              return (
                <React.Fragment key={`v-keg-${y}-${k.id}`}>
                  {/* Target Kegiatan */}
                  <td className="px-3 py-4 border-b border-r border-slate-200 text-center font-bold text-slate-500 text-[10px]">
                    {ang ? parseFloat(ang.target).toLocaleString('id-ID') : "0"}
                  </td>
                  {/* Pagu Kegiatan (Hasil Agregasi Backend) */}
                  <td className="px-3 py-4 border-b border-r border-slate-200 text-right font-black text-amber-700 bg-amber-50/30 text-[10px]">
                    {ang ? Number(ang.pagu).toLocaleString('id-ID') : "0"}
                  </td>
                </React.Fragment>
              );
            })}

            {/* AKSI TAMBAH SUB KEGIATAN */}
            <td className="sticky right-0 z-30 bg-amber-50/10 group-hover:bg-amber-50/50 px-4 py-4 border-b border-l border-slate-200 text-center">
               <button 
                  type="button"
                  onClick={(e) => handleOpenAddSub(e, k)}
                  className="p-1.5 border border-amber-400 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-sm group/btn"
               >
                  <Plus size={12} className="group-hover/btn:rotate-90 transition-transform" />
               </button>
            </td>
          </tr>

          {/* RENDER TABEL SUB KEGIATAN (LEVEL 3) */}
          {expandedKegiatans[k.id] && (
             <TabelSub kegiatanId={k.id} YEARS={YEARS} />
          )}
        </React.Fragment>
      ))}

      {/* MODAL TAMBAH SUB KEGIATAN */}
      <AddSubModal 
        open={showSubModal}
        onClose={() => setShowSubModal(false)}
        onSuccess={onSuccess} 
        kegiatanId={selectedKegiatan?.id}
        kegiatanName={selectedKegiatan?.nama_kegiatan}
      />
    </>
  );
}