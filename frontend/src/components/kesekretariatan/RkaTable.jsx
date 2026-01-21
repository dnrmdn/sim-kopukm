// src/components/RkaTable.jsx
import React from "react";

// Helper Format Rupiah
function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(v || 0));
}

// --- Komponen Mobile: Menampilkan SEMUA data dalam bentuk Kartu ---
const MobileCard = ({ row, idx, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-4 overflow-hidden">
      {/* Header Kartu: Identitas Utama */}
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 rounded bg-blue-600 text-white text-xs font-bold mb-2">
            No. {idx + 1}
          </span>
          <h3 className="font-bold text-slate-800 text-sm leading-snug">{row.subkegiatan_name}</h3>
        </div>
        <button
          onClick={() => onEdit(row)}
          className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded text-slate-700 font-medium shadow-sm active:bg-slate-50"
        >
          Edit
        </button>
      </div>

      {/* Body Kartu: Detail Hirarki */}
      <div className="p-4 space-y-3">
        <div className="text-xs text-slate-500 border-l-2 border-slate-200 pl-3">
          <p className="mb-1"><strong className="text-slate-700">Program:</strong> {row.program_name}</p>
          <p><strong className="text-slate-700">Kegiatan:</strong> {row.kegiatan_name}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-slate-100 pt-3">
          <div>
            <span className="block text-slate-400">Renstra Thn</span>
            <span className="font-medium text-slate-700">{row.renstra_year || "-"}</span>
          </div>
          <div>
            <span className="block text-slate-400">Ket</span>
            <span className="font-medium text-slate-700 truncate">{row.keterangan || "-"}</span>
          </div>
        </div>

        {/* Tabel Mini untuk Anggaran (Mobile) */}
        <div className="bg-slate-50 rounded p-3 text-xs space-y-2 border border-slate-100 mt-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Murni</span>
            <span className="font-mono text-slate-700">{fmtIdr(row.murni)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pergeseran I</span>
            <span className="font-mono text-slate-500">{fmtIdr(row.pergeseran_i)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pergeseran II</span>
            <span className="font-mono text-slate-500">{fmtIdr(row.pergeseran_ii)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Efisiensi</span>
            <span className="font-mono text-slate-500">{fmtIdr(row.efisiensi)}</span>
          </div>
          <div className="border-t border-slate-200 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-700 uppercase">Perubahan</span>
            <span className="font-mono font-bold text-blue-700 text-sm">{fmtIdr(row.perubahan)}</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 p-1 -mx-1 rounded">
            <span className="font-bold text-green-700 uppercase">Realisasi</span>
            <span className="font-mono font-bold text-green-700 text-sm">{fmtIdr(row.realisasi)}</span>
          </div>
        </div>
        
        {/* Footer Data Tambahan */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-2">
           <div>
             <span className="block text-slate-400">Capaian</span>
             <span className="text-slate-700">{row.capaian || "-"}</span>
           </div>
           <div>
             <span className="block text-slate-400">Eviden</span>
             <span className="text-slate-700 truncate">{row.eviden || "-"}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default function RkaTable({ data = [], onEdit = () => {} }) {
  // Style config untuk konsistensi
  const thStyle = "px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 whitespace-nowrap";
  const tdStyle = "px-4 py-3 text-sm border-b border-slate-100 text-slate-600 align-top";
  const moneyStyle = "font-mono text-right tracking-tight whitespace-nowrap";

  return (
    <div className="w-full bg-white">
      {/* --- Mobile View (< 1024px) --- */}
      <div className="lg:hidden p-2">
        {data.length === 0 ? (
          <div className="text-center p-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded">
            Belum ada data RKA.
          </div>
        ) : (
          data.map((row, idx) => (
            <MobileCard key={row.id || idx} row={row} idx={idx} onEdit={onEdit} />
          ))
        )}
      </div>

      {/* --- Desktop View (>= 1024px) --- */}
      <div className="hidden lg:block w-full overflow-hidden border border-slate-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto max-h-[85vh]">
          <table className="min-w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr>
                <th className={`${thStyle} w-12 text-center`}>No</th>
                <th className={`${thStyle} min-w-[200px]`}>Program</th>
                <th className={`${thStyle} min-w-[200px]`}>Kegiatan</th>
                <th className={`${thStyle} min-w-[250px]`}>Sub Kegiatan</th>
                <th className={`${thStyle} min-w-[120px]`}>Keterangan</th>
                <th className={`${thStyle} min-w-[80px]`}>Renstra</th>
                
                {/* Kelompok Anggaran Awal & Proses */}
                <th className={`${thStyle} text-right min-w-[140px] bg-slate-50/50`}>Murni</th>
                <th className={`${thStyle} text-right min-w-[140px] text-slate-400`}>Geser I</th>
                <th className={`${thStyle} text-right min-w-[140px] text-slate-400`}>Geser II</th>
                <th className={`${thStyle} text-right min-w-[140px] text-slate-400`}>Efisiensi</th>
                
                {/* Kelompok Hasil Akhir - Highlighted Header */}
                <th className={`${thStyle} text-right min-w-[150px] bg-blue-50 text-blue-700 border-blue-100`}>Perubahan</th>
                <th className={`${thStyle} text-right min-w-[150px] bg-green-50 text-green-700 border-green-100`}>Realisasi</th>
                
                <th className={`${thStyle} min-w-[100px]`}>Capaian</th>
                <th className={`${thStyle} min-w-[100px]`}>Eviden</th>
                
                {/* Sticky Action Column */}
                <th className={`${thStyle} w-20 text-center sticky right-0 bg-slate-50 z-30 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.1)]`}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.length === 0 && (
                <tr>
                  <td colSpan={15} className="p-10 text-center text-slate-400 italic">
                    Belum ada data RKA yang tersedia.
                  </td>
                </tr>
              )}

              {data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className={`${tdStyle} text-center font-medium text-slate-400`}>
                    {idx + 1}
                  </td>
                  <td className={`${tdStyle} font-medium text-slate-800`}>{row.program_name}</td>
                  <td className={`${tdStyle}`}>{row.kegiatan_name}</td>
                  <td className={`${tdStyle}`}>{row.subkegiatan_name}</td>
                  <td className={`${tdStyle} text-xs italic text-slate-500`}>{row.keterangan || "-"}</td>
                  <td className={`${tdStyle} text-center`}>
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-xs">
                        {row.renstra_year || "-"}
                    </span>
                  </td>

                  {/* Anggaran Process */}
                  <td className={`${tdStyle} ${moneyStyle}`}>{fmtIdr(row.murni)}</td>
                  <td className={`${tdStyle} ${moneyStyle} text-slate-400`}>{fmtIdr(row.pergeseran_i)}</td>
                  <td className={`${tdStyle} ${moneyStyle} text-slate-400`}>{fmtIdr(row.pergeseran_ii)}</td>
                  <td className={`${tdStyle} ${moneyStyle} text-slate-400`}>{fmtIdr(row.efisiensi)}</td>

                  {/* Highlighted Results */}
                  <td className={`${tdStyle} ${moneyStyle} font-bold text-blue-700 bg-blue-50/30`}>
                    {fmtIdr(row.perubahan)}
                  </td>
                  <td className={`${tdStyle} ${moneyStyle} font-bold text-green-700 bg-green-50/30`}>
                    {fmtIdr(row.realisasi)}
                  </td>

                  <td className={`${tdStyle} text-xs`}>{row.capaian || "-"}</td>
                  <td className={`${tdStyle} text-xs truncate max-w-[100px]`} title={row.eviden}>{row.eviden || "-"}</td>

                  {/* Sticky Action Button */}
                  <td className={`${tdStyle} sticky right-0 bg-white shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] text-center align-middle`}>
                    <button
                      onClick={() => onEdit(row)}
                      className="inline-flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-600 hover:text-white transition-all duration-200"
                      title="Edit Data"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}