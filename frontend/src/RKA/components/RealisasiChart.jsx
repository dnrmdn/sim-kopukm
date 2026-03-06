import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RealisasiChart({ data = [] }) {

  const chartData = useMemo(() => {
    const labels = [];
    const anggaran = [];
    const realisasi = [];

    // 1. Pastikan data adalah array
    if (!Array.isArray(data)) return { labels: [], datasets: [] };

    data.forEach(program => {
      let totalA = 0;
      let totalR = 0;

      // 2. Gunakan ?. dan || [] di setiap level nesting
      (program?.kegiatans || []).forEach(k => {
        (k?.subs || []).forEach(s => {
          (s?.rka?.belanja || []).forEach(b => {
            totalA += Number(b.murni || 0);
            totalR += Number(b.realisasi || 0);
          });
        });
      });

      // 3. Hanya tampilkan program yang punya nama
      labels.push(program?.name || "Tanpa Nama");
      anggaran.push(totalA);
      realisasi.push(totalR);
    });

    return {
      labels,
      datasets: [
        {
          label: "Anggaran",
          data: anggaran,
          backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue 500
          borderRadius: 6,
        },
        {
          label: "Realisasi",
          data: realisasi,
          backgroundColor: "rgba(16, 185, 129, 0.8)", // Emerald 500
          borderRadius: 6,
        }
      ]
    };

  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { size: 11, weight: 'bold' }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat("id-ID", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value);
          }
        }
      },
      x: {
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
        <h3 className="font-bold text-slate-800 tracking-tight">
          Perbandingan Anggaran vs Realisasi
        </h3>
      </div>
      
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
           <p className="text-sm italic">Data tidak tersedia</p>
        </div>
      )}
    </div>
  );
}