// src/components/RkaTable.jsx
import React from "react";

function fmtIdr(v) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v || 0));
}

export default function RkaTable({ data = [], onEdit = () => {} }) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full table-auto">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2">No</th>
            <th className="px-3 py-2">Program</th>
            <th className="px-3 py-2">Kegiatan</th>
            <th className="px-3 py-2">Sub Kegiatan</th>
            <th className="px-3 py-2">Keterangan</th>
            <th className="px-3 py-2">Renstra Tahun</th>
            <th className="px-3 py-2">Murni</th>
            <th className="px-3 py-2">Pergeseran I</th>
            <th className="px-3 py-2">Pergeseran II</th>
            <th className="px-3 py-2">Efisiensi</th>
            <th className="px-3 py-2">Perubahan</th>
            <th className="px-3 py-2">Realisasi</th>
            <th className="px-3 py-2">Capaian</th>
            <th className="px-3 py-2">Eviden</th>
            <th className="px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan={15} className="p-6 text-center text-sm text-slate-500">Belum ada data RKA.</td></tr>
          )}

          {data.map((row, idx) => (
            <tr key={row.id} className="border-t">
              <td className="px-2 py-2">{idx + 1}</td>
              <td className="px-2 py-2">{row.program_name}</td>
              <td className="px-2 py-2">{row.kegiatan_name}</td>
              <td className="px-2 py-2">{row.subkegiatan_name}</td>
              <td className="px-2 py-2">{row.keterangan || "-"}</td>
              <td className="px-2 py-2">{row.renstra_year || "-"}</td>
              <td className="px-2 py-2">{fmtIdr(row.murni)}</td>
              <td className="px-2 py-2">{fmtIdr(row.pergeseran_i)}</td>
              <td className="px-2 py-2">{fmtIdr(row.pergeseran_ii)}</td>
              <td className="px-2 py-2">{fmtIdr(row.efisiensi)}</td>
              <td className="px-2 py-2">{fmtIdr(row.perubahan)}</td>
              <td className="px-2 py-2">{fmtIdr(row.realisasi)}</td>
              <td className="px-2 py-2">{row.capaian || "-"}</td>
              <td className="px-2 py-2">{row.eviden || "-"}</td>
              <td className="px-2 py-2"><button onClick={() => onEdit(row)} className="px-2 py-1 border rounded">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
