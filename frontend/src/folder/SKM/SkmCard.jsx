import React from "react";
import { TrendingUp } from "lucide-react";

export default function SkmCard({ data }) {
  if (!data) return null;

  const nilai = Number(data.nilai || 0);

  function kategori(n) {
    if (n >= 88) return "Sangat Baik";
    if (n >= 76) return "Baik";
    if (n >= 65) return "Cukup";
    return "Kurang";
  }

  const gradientMap = {
    "Sangat Baik": "from-blue-500 to-cyan-400",
    "Baik":        "from-emerald-500 to-green-400",
    "Cukup":       "from-amber-500 to-yellow-400",
    "Kurang":      "from-red-500 to-orange-400",
  };

  const badgeBgMap = {
    "Sangat Baik": "bg-blue-100 text-blue-700 border-blue-200",
    "Baik":        "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Cukup":       "bg-amber-100 text-amber-700 border-amber-200",
    "Kurang":      "bg-red-100 text-red-700 border-red-200",
  };

  const progressShadowMap = {
    "Sangat Baik": "shadow-blue-400/40",
    "Baik":        "shadow-emerald-400/40",
    "Cukup":       "shadow-amber-400/40",
    "Kurang":      "shadow-red-400/40",
  };

  const kat = kategori(nilai);
  const gradient = gradientMap[kat];
  const badgeBg  = badgeBgMap[kat];
  const progressShadow = progressShadowMap[kat];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group">
      {/* Accent bar */}
      <div className={`h-1 w-full bg-linear-to-r ${gradient}`} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800 mb-0.5 group-hover:text-blue-700 transition-colors leading-snug">
              {data.nama_layanan}
            </h3>
            <p className="text-xs text-gray-500">Survey Kepuasan Masyarakat</p>
          </div>
          <div className={`p-2 rounded-lg bg-linear-to-br ${gradient} shadow-md shrink-0`}>
            <TrendingUp size={18} className="text-white" />
          </div>
        </div>

        {/* Nilai */}
        <div className="flex items-baseline gap-1.5">
          <span className={`text-5xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent leading-none`}>
            {nilai}
          </span>
          <span className="text-gray-400 text-sm font-medium">/100</span>
        </div>

        {/* Kategori Badge */}
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeBg}`}>
            {kat}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Progres</span>
            <span className="text-xs font-bold text-gray-700">{nilai}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-100 border border-blue-200/70 overflow-hidden">
            <div
              className={`h-full rounded-full bg-linear-to-r ${gradient} shadow-sm ${progressShadow} transition-all duration-500`}
              style={{ width: `${nilai}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}