import React from "react";
import { Plus, CornerDownRight } from "lucide-react";

export default function TabelKegiatan({ kegiatans = [], YEARS = [] }) {
  if (!kegiatans || kegiatans.length === 0) {
    return (
      <tr>
        {/* Colspan disesuaikan: 1(Nomen) + 1(Ind) + 1(Out) + 1(Sat) + (Years*2) + 1(Aksi) */}
        <td colSpan={YEARS.length * 2 + 5} className="py-6 text-center bg-slate-50 border-b border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">-- Belum ada data kegiatan --</span>
        </td>
      </tr>
    );
  }

  return (
    <>
      {kegiatans.map((k) => (
        <tr key={`keg-${k.id}`} className="bg-amber-50/20 hover:bg-amber-50/50 transition-colors group">
          <td className="sticky left-0 z-30 bg-amber-50/10 group-hover:bg-amber-50/50 pl-12 pr-6 py-4 border-b border-r border-slate-200 font-bold text-slate-700 shadow-[4px_0_10px_rgba(0,0,0,0.01)]">
            <div className="flex gap-2 items-start">
              <CornerDownRight size={14} className="text-amber-500 mt-1 shrink-0" />
              <div>
                <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase mb-1 inline-block font-black">Kegiatan</span>
                <div className="leading-tight text-[11px] uppercase tracking-tighter">{k.kodering} {k.nama_kegiatan}</div>
              </div>
            </div>
          </td>

          {/* INDIKATOR KEGIATAN (DIPISAH) */}
          <td className="px-4 py-4 border-b border-r border-slate-200 text-[10px] font-bold text-amber-700 italic">
            {k.indikator_kegiatan || "-"}
          </td>

          {/* OUTPUT KEGIATAN (DIPISAH) */}
          <td className="px-4 py-4 border-b border-r border-slate-200 text-[10px] font-medium text-slate-400 italic">
            {k.output_kegiatan || "-"}
          </td>

          <td className="px-4 py-4 border-b border-r border-slate-200 text-center font-bold text-slate-400 text-[10px]">{k.satuan || "-"}</td>
          
          {YEARS.map(y => (
            <React.Fragment key={`v-keg-${y}-${k.id}`}>
              <td className="px-3 py-4 border-b border-r border-slate-200 text-center font-bold text-slate-500 text-[10px]">0</td>
              <td className="px-3 py-4 border-b border-r border-slate-200 text-right font-black text-amber-700 bg-amber-50/30 text-[10px]">0</td>
            </React.Fragment>
          ))}

          <td className="sticky right-0 z-30 bg-amber-50/10 group-hover:bg-amber-50/50 px-4 py-4 border-b border-l border-slate-200 text-center">
             <button className="p-1.5 border border-amber-400 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition-all active:scale-95 shadow-sm">
                <Plus size={12} />
             </button>
          </td>
        </tr>
      ))}
    </>
  );
}