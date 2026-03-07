// src/components/RkaTable.jsx
import React, { useMemo } from "react";
import axiosInstance from "@/utils/axiosInstance";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));
}

export default function RkaTable({ data = [], onEdit = () => {}, onDeleteSuccess = () => {} }) {
  const hierarchicalData = useMemo(() => {
    const programs = {};
    data.forEach((item) => {
      const pId = item.program_id;
      const kId = item.kegiatan_id;

      if (!programs[pId]) {
        programs[pId] = { 
          id: pId, code: item.program_code || "8.01.01", name: item.program_name, 
          renstra: 0, murni: 0, p1: 0, p2: 0, efs: 0, ubah: 0, real: 0, 
          kegiatans: {} 
        };
      }
      if (!programs[pId].kegiatans[kId]) {
        programs[pId].kegiatans[kId] = { 
          id: kId, code: item.kegiatan_code || "8.01.01.2.01", name: item.kegiatan_name, 
          renstra: 0, murni: 0, p1: 0, p2: 0, efs: 0, ubah: 0, real: 0, 
          subKegiatans: [] 
        };
      }
      programs[pId].kegiatans[kId].subKegiatans.push(item);

      const vals = ["renstra_val", "murni", "pergeseran_i", "pergeseran_ii", "efisiensi", "perubahan", "realisasi"];
      vals.forEach(val => {
        const num = Number(item[val] || 0);
        const key = val === "renstra_val" ? "renstra" : val;
        programs[pId].kegiatans[kId][key] = (programs[pId].kegiatans[kId][key] || 0) + num;
        programs[pId][key] = (programs[pId][key] || 0) + num;
      });
    });
    return Object.values(programs);
  }, [data]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus sub kegiatan ini?")) return;
    try {
      await axiosInstance.delete(`/rka/${id}`);
      onDeleteSuccess();
    } catch (err) {
      alert("Gagal hapus data.");
    }
  };

  const thStyle = "px-2 py-3 text-[10px] font-black text-white uppercase tracking-tighter bg-[#1e293b] border-r border-slate-700 sticky top-0 z-30";
  const moneyStyle = "font-mono text-right text-[10px] px-2 whitespace-nowrap align-middle";

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="overflow-x-auto max-h-[85vh]">
        <table className="min-w-full text-left border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={`${thStyle} w-10 text-center`}>NO</th>
              <th className={`${thStyle} min-w-[150px]`}>PROGRAM / KEGIATAN / SUB KEGIATAN</th>
              <th className={`${thStyle} min-w-[250px]`}>KETERANGAN</th>
              <th className={`${thStyle} text-right w-28`}>RENSTRA</th>
              <th className={`${thStyle} text-right w-28`}>MURNI</th>
              <th className={`${thStyle} text-right w-28 text-slate-400`}>P I</th>
              <th className={`${thStyle} text-right w-28 text-slate-400`}>P II</th>
              <th className={`${thStyle} text-right w-28 text-slate-400`}>EFISIENSI</th>
              <th className={`${thStyle} text-right w-32 bg-blue-900`}>PERUBAHAN</th>
              <th className={`${thStyle} text-right w-32 bg-emerald-900`}>REALISASI</th>
              <th className={`${thStyle} text-center w-16`}>TARGET</th>
              <th className={`${thStyle} text-center w-16`}>CAPAIAN</th>
              <th className={`${thStyle} text-center w-12`}>EVIDEN</th>
              <th className={`${thStyle} w-16 text-center sticky right-0 bg-slate-900 z-40`}>AKSI</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {hierarchicalData.map((prog, pIdx) => (
              <React.Fragment key={`prog-${prog.id}`}>
                {/* --- LEVEL 1: PROGRAM --- */}
                <tr className="bg-[#1e293b] text-white font-bold">
                  <td className="p-2 text-center border-b border-slate-700 font-black">{pIdx + 1}</td>
                  <td className="p-2 border-b border-slate-700">
                    <div className="text-[9px] text-blue-400 font-mono">{prog.code}</div>
                    <div className="uppercase leading-tight">{prog.name}</div>
                  </td>
                  <td className="p-2 border-b border-slate-700 italic text-[10px] text-slate-400 uppercase">Total Program</td>
                  <td className={`${moneyStyle} border-b border-slate-700`}>{fmtIdr(prog.renstra)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700`}>{fmtIdr(prog.murni)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700`}>{fmtIdr(prog.p1)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700`}>{fmtIdr(prog.p2)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700`}>{fmtIdr(prog.efs)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700 bg-blue-800`}>{fmtIdr(prog.ubah)}</td>
                  <td className={`${moneyStyle} border-b border-slate-700 bg-emerald-800`}>{fmtIdr(prog.real)}</td>
                  <td colSpan={4} className="border-b border-slate-700 bg-[#1e293b]"></td>
                </tr>

                {Object.values(prog.kegiatans).map((keg) => (
                  <React.Fragment key={`keg-${keg.id}`}>
                    {/* --- LEVEL 2: KEGIATAN --- */}
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <td className="border-b border-slate-200"></td>
                      <td className="p-2 pl-4 border-b border-slate-200">
                        <div className="text-[9px] text-slate-500 font-mono">{keg.code}</div>
                        <div className="uppercase leading-tight text-blue-800">{keg.name}</div>
                      </td>
                      <td className="p-2 border-b border-slate-200 italic text-[10px] text-slate-500 uppercase">Total Kegiatan</td>
                      <td className={`${moneyStyle} border-b border-slate-200`}>{fmtIdr(keg.renstra)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200`}>{fmtIdr(keg.murni)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200`}>{fmtIdr(keg.p1)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200`}>{fmtIdr(keg.p2)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200`}>{fmtIdr(keg.efs)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200 bg-blue-100`}>{fmtIdr(keg.ubah)}</td>
                      <td className={`${moneyStyle} border-b border-slate-200 bg-emerald-100`}>{fmtIdr(keg.real)}</td>
                      <td colSpan={4} className="border-b border-slate-200 bg-slate-100"></td>
                    </tr>

                    {/* --- LEVEL 3: SUB KEGIATAN (DETAIL AS PER IMAGE) --- */}
                    {/* --- LEVEL 3: SUB KEGIATAN --- */}
{keg.subKegiatans.map((sub) => (
  <tr key={`sub-${sub.id_rka}`} className="hover:bg-blue-50/30 transition-colors group">
    <td className="border-b border-slate-100"></td>
    <td className="p-2 pl-8 border-b border-slate-100">
      <div className="text-[9px] text-purple-600 font-mono font-bold">{sub.subkegiatan_code}</div>
      <div className="text-slate-600 font-medium leading-tight">{sub.subkegiatan_name}</div>
    </td>

    {/* --- LEVEL 3: SUB KEGIATAN --- */}
<td className="p-2 border-b border-slate-100">
  {/* Judul Uraian Utama */}
  <div className="font-black text-slate-700 uppercase text-[10px] mb-1.5 leading-tight">
    {sub.uraian || sub.subkegiatan_name}
  </div>

  {/* Baris Badge Keterangan */}
  <div className="flex flex-wrap gap-1.5">
    {/* BADGE PJ */}
    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
      {sub.pj_nama || "N/A"}
    </span>

    {/* BADGE TRIWULAN */}
    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold border border-amber-100">
      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      TW {sub.triwulan || "-"}
    </span>

    {/* BADGE TARGET & SATUAN (UPDATE TERBARU) */}
    <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-black border border-emerald-200 shadow-sm transition-all hover:bg-emerald-100">
  {/* Icon Check-Circle untuk melambangkan Target Output */}
  <svg 
    className="w-3 h-3 text-emerald-600" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="3" 
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  
  <span className="tracking-tight">
    TARGET: <span className="text-emerald-900">{sub.target_angka || "0"}</span> {sub.target_satuan || "SATUAN"}
  </span>
</span>
  </div>
</td>
                        <td className={`${moneyStyle} border-b border-slate-100 text-slate-400`}>{fmtIdr(sub.renstra_val)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 font-bold text-slate-600`}>{fmtIdr(sub.murni)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 text-slate-400`}>{fmtIdr(sub.pergeseran_i)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 text-slate-400`}>{fmtIdr(sub.pergeseran_ii)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 text-slate-400`}>{fmtIdr(sub.efisiensi)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 font-black text-blue-700 bg-blue-50/50`}>{fmtIdr(sub.perubahan)}</td>
                        <td className={`${moneyStyle} border-b border-slate-100 font-black text-emerald-700 bg-emerald-50/50`}>{fmtIdr(sub.realisasi)}</td>
                        
                        <td className="p-2 text-center border-b border-slate-100">
                          <div className="font-black text-slate-700">{sub.target_angka || 0}</div>
                          <div className="text-[7px] text-slate-400 uppercase">{sub.target_satuan || "-"}</div>
                        </td>
                        <td className="p-2 text-center border-b border-slate-100">
                          <div className="font-black text-red-600 leading-none">{sub.capaian_persen || 0}%</div>
                          <div className="text-[7px] text-slate-400 font-bold">TERCAPAI</div>
                        </td>
                        <td className="p-2 text-center border-b border-slate-100">
                          <button className="text-purple-600 p-1 hover:bg-purple-100 rounded transition-colors border border-purple-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                        </td>
                        <td className="p-2 sticky right-0 bg-white group-hover:bg-blue-50/90 border-b border-slate-100 shadow-[-5px_0_10px_rgba(0,0,0,0.05)]">
                          <div className="flex flex-col gap-1 items-center">
                            <button onClick={() => onEdit(sub)} className="w-full py-1 bg-amber-400 text-white rounded-[3px] text-[8px] font-black uppercase shadow-sm">Edit</button>
                            <button onClick={() => handleDelete(sub.id)} className="w-full py-1 bg-red-500 text-white rounded-[3px] text-[8px] font-black uppercase shadow-sm">Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}