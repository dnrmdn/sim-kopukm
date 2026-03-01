// src/pages/RencanaAksiPage.jsx
import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RencanaAksiTable from "@/components/rencana-aksi/RencanaAksiTable";

export default function RencanaAksiPage() {
  const [tahun, setTahun] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    if (!tahun) {
      alert("Pilih tahun dulu");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/rencana-aksi?tahun=${tahun}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-100 to-teal-100 p-4 rounded-xl shadow">
        <h1 className="text-lg font-semibold text-slate-700">
          Rencana Aksi Tahunan
        </h1>
      </div>

      {/* Filter Tahun */}
      <div className="bg-white p-4 rounded-xl shadow border flex flex-wrap gap-4 items-end">
        <div className="flex flex-col w-64">
          <label className="text-sm text-slate-500 mb-1">
            Tahun Perencanaan
          </label>
          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-400"
          >
            <option value="">-- Pilih Tahun --</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <button
          onClick={handleLoad}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg shadow"
        >
          {loading ? "Loading..." : "Tampilkan Data"}
        </button>
      </div>

      {/* Table */}
      {data.length > 0 && (
        <RencanaAksiTable data={data} />
      )}
    </div>
  );
}