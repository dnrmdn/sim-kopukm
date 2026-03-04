import React from "react";

/**
 * Props data:
 * {
 *   populasi: number
 *   sampel_min: number
 *   aktual: number
 *   ketercapaian: number (0-100)
 * }
 */
export default function SkmStatistik({ data }) {
  if (!data) return null;

  return (
    <section className="border border-slate-200 bg-slate-50 p-6">
      <h3 className="font-medium text-slate-800 mb-4">
        Analisis Statistik
      </h3>

      {/* STAT BOX */}
      <div className="grid grid-cols-4 gap-4 text-center text-sm">
        <StatBox label="POPULASI" value={data.populasi} />
        <StatBox label="SAMPEL MIN." value={data.sampel_min} />
        <StatBox label="AKTUAL" value={data.aktual} />
        <StatBox
          label="KETERCAPAIAN"
          value={`${data.ketercapaian}%`}
        />
      </div>

      {/* PROGRESS */}
      <div className="mt-4">
        <div className="h-2 bg-slate-200">
          <div
            className="h-2 bg-green-600"
            style={{ width: `${data.ketercapaian}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value }) {
  return (
    <div>
      <p className="text-lg font-semibold text-slate-900">
        {value ?? 0}
      </p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}