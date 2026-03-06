import React, { useMemo } from "react";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(v || 0));
}

export default function RankingProgram({ data = [] }) {
  const ranking = useMemo(() => {
    const rows = [];
    
    // Pastikan data adalah array
    if (!Array.isArray(data)) return [];

    data.forEach(p => {
      let total = 0;

      // Gunakan ?. dan || [] di setiap level nesting
      (p?.kegiatans || []).forEach(k => {
        (k?.subs || []).forEach(s => {
          (s?.rka?.belanja || []).forEach(b => {
            total += Number(b.murni || 0);
          });
        });
      });

      rows.push({
        name: p?.name || "Program Tanpa Nama",
        total
      });
    });

    // Urutkan dari yang terbesar dan ambil top 5
    return rows.sort((a, b) => b.total - a.total).slice(0, 5);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
        Ranking Program Anggaran
      </h3>

      {ranking.length === 0 ? (
        <p className="text-slate-400 text-sm italic text-center py-4">Tidak ada data anggaran</p>
      ) : (
        <ul className="space-y-4">
          {ranking.map((r, i) => (
            <li key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
              <span className="text-slate-600 font-medium truncate max-w-[180px]">
                <span className="text-slate-400 mr-2 font-bold">{i + 1}.</span> {r.name}
              </span>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {fmtIdr(r.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}