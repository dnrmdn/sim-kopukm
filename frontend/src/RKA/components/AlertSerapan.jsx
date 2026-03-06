import React from "react";

export default function AlertSerapan({ data = [] }) {
  const alerts = [];

  // Tambahkan pengecekan jika data bukan array
  if (!Array.isArray(data)) return null;

  data.forEach((p) => {
    // Gunakan ?. dan || [] agar tidak error jika kegiatans kosong
    (p?.kegiatans || []).forEach((k) => {
      let anggaran = 0;
      let realisasi = 0;

      (k?.subs || []).forEach((s) => {
        (s?.rka?.belanja || []).forEach((b) => {
          anggaran += Number(b.murni || 0);
          realisasi += Number(b.realisasi || 0);
        });
      });

      const percent = anggaran ? (realisasi / anggaran) * 100 : 0;

      // Ambil k.name atau k.nama (sesuaikan dengan field database Anda)
      if (percent < 30 && anggaran > 0) {
        alerts.push({
          kegiatan: k.name || k.nama || "Kegiatan Tanpa Nama",
          percent: percent,
        });
      }
    });
  });

  if (!alerts.length) return null;

  return (
    <div className="bg-red-50 border border-red-100 p-5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <h3 className="font-bold text-red-700 text-sm uppercase tracking-wider">
          Peringatan Serapan Rendah (&lt; 30%)
        </h3>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((a, i) => (
          <li key={i} className="bg-white/50 border border-red-200/50 p-3 rounded-xl flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 truncate mr-2">{a.kegiatan}</span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold whitespace-nowrap">
              {a.percent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}