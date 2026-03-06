import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler // Tambahkan filler untuk efek area bawah garis
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function RealisasiBulanan({ data = [] }) {
  const bulanLabels = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const chartData = useMemo(() => {
    const realisasiArray = new Array(12).fill(0);

    // 1. Safety check: pastikan data adalah array
    if (Array.isArray(data)) {
      data.forEach(p => {
        // 2. Gunakan ?. dan || [] di setiap level
        (p?.kegiatans || []).forEach(k => {
          (k?.subs || []).forEach(s => {
            (s?.rka?.belanja || []).forEach(b => {
              // Cek apakah ada tanggal realisasi (atau gunakan tanggal input rka)
              const tgl = b.tanggal_realisasi || b.tanggal; 
              if (!tgl) return;

              const dateObj = new Date(tgl);
              // Pastikan date valid sebelum ambil bulan
              if (!isNaN(dateObj.getTime())) {
                const m = dateObj.getMonth();
                realisasiArray[m] += Number(b.realisasi || 0);
              }
            });
          });
        });
      });
    }

    return {
      labels: bulanLabels,
      datasets: [
        {
          label: "Total Realisasi (IDR)",
          data: realisasiArray,
          borderColor: "#10b981", // Emerald 500
          backgroundColor: "rgba(16, 185, 129, 0.1)", // Efek area transparan
          borderWidth: 4,
          tension: 0.4, // Membuat garis lebih melengkung (smooth)
          pointRadius: 4,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
          fill: true, // Mengaktifkan efek area di bawah garis
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Sembunyikan legend agar lebih bersih
      tooltip: {
        callbacks: {
          label: (context) => `Realisasi: Rp ${context.raw.toLocaleString("id-ID")}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { size: 10 },
          callback: (value) => value.toLocaleString("id-ID", { notation: 'compact' })
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 tracking-tight">Tren Realisasi Bulanan</h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">Tahun 2024</span>
      </div>
      
      <div className="h-[250px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}