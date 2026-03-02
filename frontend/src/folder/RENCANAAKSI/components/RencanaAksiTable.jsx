import React from "react";
import { Check } from "lucide-react";

const months = [
  "jan","feb","mar",
  "apr","mei","jun",
  "jul","agu","sep",
  "okt","nov","des"
];

export default function RencanaAksiTable({ data }) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-auto">
      <table className="min-w-[1600px] text-xs border-collapse">
        
        {/* ================= HEADER LEVEL 1 ================= */}
        <thead className="sticky top-0 z-20">
          <tr className="bg-slate-200 text-slate-700">
            <th rowSpan="3" className="border p-2 min-w-[180px]">Program</th>
            <th rowSpan="3" className="border p-2 min-w-[180px]">Kegiatan</th>
            <th rowSpan="3" className="border p-2 min-w-[200px]">Sub Kegiatan</th>
            <th rowSpan="3" className="border p-2 min-w-[180px]">Indikator</th>
            <th rowSpan="3" className="border p-2 w-[80px] text-center">Target</th>
            <th rowSpan="3" className="border p-2 w-[120px] text-right">Anggaran</th>

            <th colSpan="12" className="border p-2 text-center">
              Pelaksanaan
            </th>
          </tr>

          {/* ================= HEADER LEVEL 2 ================= */}
          <tr className="bg-slate-100">
            <th colSpan="3" className="border text-center">TW I</th>
            <th colSpan="3" className="border text-center">TW II</th>
            <th colSpan="3" className="border text-center">TW III</th>
            <th colSpan="3" className="border text-center">TW IV</th>
          </tr>

          {/* ================= HEADER LEVEL 3 ================= */}
          <tr className="bg-slate-50">
            {months.map((m, i) => (
              <th key={i} className="border w-[45px] text-center uppercase">
                {m}
              </th>
            ))}
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="border p-2">{item.program}</td>
              <td className="border p-2">{item.kegiatan}</td>
              <td className="border p-2">{item.sub_kegiatan}</td>
              <td className="border p-2">{item.indikator}</td>

              <td className="border p-2 text-center font-medium">
                {item.target}
              </td>

              <td className="border p-2 text-right text-sky-600 font-semibold">
                Rp {Number(item.anggaran).toLocaleString("id-ID")}
              </td>

              {months.map((m, i) => (
                <td key={i} className="border text-center">
                  {item.realisasi_bulanan?.[m] ? (
                    <div className="flex justify-center">
                      <div className="bg-green-100 text-green-600 w-5 h-5 flex items-center justify-center rounded">
                        <Check size={14} />
                      </div>
                    </div>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}