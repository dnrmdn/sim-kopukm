import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

export default function TopProgramChart({ data = [] }) {

  const chart = useMemo(() => {

    const rows = [];

    data.forEach(p => {

      let total = 0;

      p.kegiatans.forEach(k => {
        k.subs.forEach(s => {
          s.rka?.belanja?.forEach(b => {
            total += Number(b.murni || 0);
          });
        });
      });

      rows.push({
        name: p.name,
        total
      });

    });

    rows.sort((a, b) => b.total - a.total);

    const top = rows.slice(0, 5);

    return {
      labels: top.map(r => r.name),
      datasets: [
        {
          label: "Anggaran Terbesar",
          data: top.map(r => r.total)
        }
      ]
    };

  }, [data]);

  return (

    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

      <h3 className="font-bold mb-4 text-slate-700">
        Top Program Anggaran
      </h3>

      <Bar data={chart} />

    </div>

  );

}