import React from "react";
import { TrendingUp } from "lucide-react";

export default function SkmCard({ data }) {
  if (!data) return null;

  const nilai = Number(data.nilai || 0);

  function kategori(nilai) {
    if (nilai >= 88) return "Sangat Baik";
    if (nilai >= 76) return "Baik";
    if (nilai >= 65) return "Cukup";
    return "Kurang";
  }

  function warna(kat) {
    return {
      "Sangat Baik": "from-blue-500 to-cyan-400",
      "Baik": "from-emerald-500 to-green-400",
      "Cukup": "from-amber-500 to-yellow-400",
      "Kurang": "from-red-500 to-orange-400",
    }[kat];
  }

  function textColor(kat) {
    return {
      "Sangat Baik": "text-cyan-100",
      "Baik": "text-emerald-100",
      "Cukup": "text-amber-100",
      "Kurang": "text-red-100",
    }[kat];
  }

  const kat = kategori(nilai);
  const gradientColor = warna(kat);
  const textColorClass = textColor(kat);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl hover:border-white/40 transition-all duration-300 group">
      {/* Decorative orbs */}
      <div className="absolute -top-40 -right-40 w-60 h-60 rounded-full opacity-10 blur-3xl bg-linear-to-br from-blue-500 to-cyan-300" />
      <div className="absolute -bottom-40 -left-40 w-60 h-60 rounded-full opacity-10 blur-3xl bg-linear-to-br from-purple-500 to-pink-300" />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-100 transition-colors">
              {data.nama_layanan}
            </h3>
            <p className="text-xs text-slate-400">Survey Kepuasan</p>
          </div>
          <div className={`p-2 rounded-lg bg-linear-to-br ${gradientColor} shadow-lg`}>
            <TrendingUp size={20} className="text-white" />
          </div>
        </div>

        {/* Nilai */}
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold bg-linear-to-r ${gradientColor} bg-clip-text text-transparent`}>
            {nilai}
          </span>
          <span className="text-slate-400 text-sm">/100</span>
        </div>

        {/* Kategori Badge */}
        <div className="flex items-center gap-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r ${gradientColor} text-white shadow-lg`}>
            {kat}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Progres</span>
            <span className={`text-xs font-semibold ${textColorClass}`}>{nilai}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 border border-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full bg-linear-to-r ${gradientColor} shadow-lg shadow-blue-500/30 transition-all duration-500`}
              style={{ width: `${nilai}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}