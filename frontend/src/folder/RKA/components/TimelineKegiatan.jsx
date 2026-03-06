import React, { useMemo } from "react";

export default function TimelineKegiatan({ data = [] }) {
  // Gunakan useMemo agar data tidak dihitung ulang setiap render
  const rows = useMemo(() => {
    const list = [];
    
    // Safety check: pastikan data adalah array
    if (!Array.isArray(data)) return [];

    data.forEach((p) => {
      // Gunakan ?. dan || [] untuk mencegah error undefined
      (p?.kegiatans || []).forEach((k) => {
        (k?.subs || []).forEach((s) => {
          list.push({
            program: p?.name || "Program Tanpa Nama",
            kegiatan: k?.name || "Kegiatan Tanpa Nama",
            sub: s?.name || "Sub Kegiatan Tanpa Nama",
            // Ambil tanggal dari RKA jika ada untuk mengurutkan timeline
            tgl: s?.rka?.tgl_mulai || null 
          });
        });
      });
    });

    // Opsional: Urutkan berdasarkan tanggal terbaru (jika ada data tanggal)
    return list;
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Timeline Kegiatan
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
          Total: {rows.length} Sub
        </span>
      </div>

      <div className="relative space-y-1">
        {/* Garis Vertikal Timeline */}
        {rows.length > 1 && (
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
        )}

        {rows.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm italic">
            Belum ada timeline kegiatan
          </div>
        ) : (
          rows.map((r, i) => (
            <div key={i} className="group relative flex gap-5 items-start p-3 hover:bg-slate-50 rounded-2xl transition-all duration-300">
              {/* Dot Timeline */}
              <div className="relative z-10 w-4 h-4 mt-1 rounded-full bg-white border-4 border-blue-500 group-hover:scale-125 transition-transform" />

              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-700 leading-snug group-hover:text-blue-700 transition-colors truncate">
                  {r.sub}
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5 flex items-center gap-1">
                  <span className="truncate max-w-[150px]">{r.program}</span>
                  <span className="text-slate-300">/</span>
                  <span className="truncate max-w-[150px] text-slate-500">{r.kegiatan}</span>
                </div>
              </div>

              {r.tgl && (
                <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  {new Date(r.tgl).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}