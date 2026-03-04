import React from "react";
import { BarChart3, Users, Target, CheckCircle } from "lucide-react";

export default function SkmStatistik({ data }) {
  if (!data) return null;

  const ketercapaianPercent = data.ketercapaian || 0;
  const isCompleted = ketercapaianPercent >= 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl">
      {/* Decorative orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-blue-500 to-cyan-300" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-purple-500 to-pink-300" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Analisis Statistik</h2>
            <p className="text-slate-400 text-sm">Ringkasan data survei kepuasan masyarakat</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox
            icon={Users}
            label="Populasi"
            value={data.populasi}
            color="from-blue-500 to-cyan-400"
          />
          <StatBox
            icon={Target}
            label="Sampel Min."
            value={data.sampel_min}
            color="from-emerald-500 to-green-400"
          />
          <StatBox
            icon={CheckCircle}
            label="Aktual"
            value={data.aktual}
            color="from-amber-500 to-yellow-400"
          />
          <StatBox
            icon={BarChart3}
            label="Ketercapaian"
            value={`${ketercapaianPercent}%`}
            color="from-purple-500 to-pink-400"
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Pencapaian Target Survei</span>
            <span className={`text-sm font-bold ${isCompleted ? "text-emerald-400" : "text-cyan-300"}`}>
              {ketercapaianPercent}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10 border border-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isCompleted
                  ? "bg-linear-to-r from-emerald-500 to-green-400"
                  : "bg-linear-to-r from-blue-500 to-cyan-400"
              } shadow-lg shadow-blue-500/30 transition-all duration-700`}
              style={{ width: `${Math.min(ketercapaianPercent, 100)}%` }}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mt-4">
            {isCompleted ? (
              <>
                <div className="p-1 rounded-full bg-emerald-500/20">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
                <span className="text-sm text-emerald-100 font-medium">Target survei telah tercapai</span>
              </>
            ) : (
              <>
                <div className="p-1 rounded-full bg-cyan-500/20">
                  <BarChart3 size={16} className="text-cyan-400" />
                </div>
                <span className="text-sm text-cyan-100 font-medium">
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
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-linear-to-br ${color} shadow-lg`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? 0}</p>
    </div>
  );
}