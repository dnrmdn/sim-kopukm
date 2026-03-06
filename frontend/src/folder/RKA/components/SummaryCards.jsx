import React from "react";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));
}

export default function SummaryCards({ anggaran, realisasi }) {

  const sisa = anggaran - realisasi;
  const persen = anggaran ? ((realisasi / anggaran) * 100).toFixed(1) : 0;

  const card =
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      <div className={card}>
        <span className="text-xs text-slate-400 uppercase font-bold">
          Total Anggaran
        </span>
        <span className="text-xl font-black text-blue-700 mt-2">
          {fmtIdr(anggaran)}
        </span>
      </div>

      <div className={card}>
        <span className="text-xs text-slate-400 uppercase font-bold">
          Realisasi
        </span>
        <span className="text-xl font-black text-green-600 mt-2">
          {fmtIdr(realisasi)}
        </span>
      </div>

      <div className={card}>
        <span className="text-xs text-slate-400 uppercase font-bold">
          Sisa Anggaran
        </span>
        <span className="text-xl font-black text-orange-600 mt-2">
          {fmtIdr(sisa)}
        </span>
      </div>

      <div className={card}>
        <span className="text-xs text-slate-400 uppercase font-bold">
          Serapan
        </span>
        <span className="text-xl font-black text-indigo-600 mt-2">
          {persen}%
        </span>
      </div>

    </div>
  );
}