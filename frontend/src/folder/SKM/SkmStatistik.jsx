import React from "react";
import { BarChart3, Users, Target, CheckCircle } from "lucide-react";

export default function SkmStatistik({ data }) {
  if (!data) return null;

  const ketercapaianPercent = data.ketercapaian || 0;
  const isCompleted = ketercapaianPercent >= 100;

  return (
    <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Analisis Statistik</h2>
            <p className="text-gray-500 text-sm">Ringkasan data survei kepuasan masyarakat</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox icon={Users}       label="Populasi"     value={data.populasi}  color="from-blue-500 to-cyan-400"     />
          <StatBox icon={Target}      label="Sampel Min."  value={data.sampel_min} color="from-emerald-500 to-green-400" />
          <StatBox icon={CheckCircle} label="Aktual"       value={data.aktual}    color="from-amber-500 to-yellow-400"  />
          <StatBox icon={BarChart3}   label="Ketercapaian" value={`${ketercapaianPercent}%`} color="from-violet-500 to-purple-400" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Pencapaian Target Survei</span>
            <span className={`text-sm font-bold ${isCompleted ? "text-emerald-600" : "text-blue-600"}`}>
              {ketercapaianPercent}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-blue-100 border border-blue-200/70 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted
                  ? "bg-linear-to-r from-emerald-500 to-green-400 shadow-sm shadow-emerald-400/40"
                  : "bg-linear-to-r from-blue-500 to-cyan-400 shadow-sm shadow-blue-400/40"
              }`}
              style={{ width: `${Math.min(ketercapaianPercent, 100)}%` }}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            {isCompleted ? (
              <>
                <div className="p-1 rounded-full bg-emerald-100">
                  <CheckCircle size={15} className="text-emerald-600" />
                </div>
                <span className="text-sm text-emerald-700 font-medium">Target survei telah tercapai</span>
              </>
            ) : (
              <>
                <div className="p-1 rounded-full bg-blue-100">
                  <BarChart3 size={15} className="text-blue-600" />
                </div>
                <span className="text-sm text-blue-700 font-medium">
                  Masih membutuhkan {ketercapaianPercent > 0 ? 100 - ketercapaianPercent : 100}% survei lagi
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/50 backdrop-blur-sm p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <div className="mb-3">
        <div className={`p-2 rounded-lg bg-linear-to-br ${color} shadow-md w-fit`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
    </div>
  );
}