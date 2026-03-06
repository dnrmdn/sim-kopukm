import React, { useMemo } from "react";

export default function HeatmapKegiatan({ data = [] }) {

  const rows = useMemo(() => {
    const list = [];
    
    // 1. Pastikan data adalah array
    if (!Array.isArray(data)) return [];

    data.forEach(p => {
      // 2. Gunakan ?. dan || [] di setiap level nesting
      (p?.kegiatans || []).forEach(k => {
        let anggaran = 0;
        let realisasi = 0;

        (k?.subs || []).forEach(s => {
          (s?.rka?.belanja || []).forEach(b => {
            anggaran += Number(b.murni || 0);
            realisasi += Number(b.realisasi || 0);
          });
        });

        const percent = anggaran ? (realisasi / anggaran) * 100 : 0;

        list.push({
          kegiatan: k?.name || k?.nama || "Kegiatan Tanpa Nama",
          percent
        });
      });
    });

    return list;
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
        <div className="w-2 h-4 bg-orange-400 rounded-sm"></div>
        Heatmap Serapan Kegiatan
      </h3>

      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-slate-400 text-sm italic text-center py-4">Belum ada data kegiatan</p>
        ) : (
          rows.map((r, i) => {
            const color =
              r.percent > 70
                ? "bg-emerald-500"
                : r.percent > 40
                ? "bg-amber-400"
                : "bg-rose-400";

            return (
              <div key={i} className="group flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  <span className="truncate max-w-[200px] group-hover:text-blue-600 transition-colors">
                    {r.kegiatan}
                  </span>
                  <span className="font-mono">{r.percent.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-1000 ease-out shadow-inner`}
                      style={{ width: `${Math.min(r.percent, 100)}%` }} // Cap 100% agar tidak luber
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}