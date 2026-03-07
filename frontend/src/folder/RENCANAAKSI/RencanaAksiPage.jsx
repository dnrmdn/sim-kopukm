// src/pages/RencanaAksiPage.jsx
import React, { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import RencanaAksiTable from "@/folder/RENCANAAKSI/components/RencanaAksiTable";
import { CalendarDays, Search, AlertCircle, ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RencanaAksiPage() {
  const [tahun, setTahun] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoad = async () => {
    if (!tahun) {
      setError("Pilih tahun terlebih dahulu");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get(`/rencana-aksi?tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data. Silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-gray-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-blue-300" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-cyan-300" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/40 border-b border-blue-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <ClipboardList size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">Rencana Aksi Tahunan</h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Tampilkan dan kelola rencana aksi berdasarkan tahun perencanaan</p>
              </div>

              <button
                onClick={() => navigate(-1)}
                className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-red-200/50">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button onClick={() => setError("")} className="shrink-0 px-3 py-1 rounded-lg bg-red-200/70 hover:bg-red-300 text-red-700 font-medium text-xs transition-all duration-200">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          {/* Filter card */}
          <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
            <div className="p-6 sm:p-8">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
                <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                  <CalendarDays size={16} className="text-white" />
                </div>
                Filter Tahun Perencanaan
              </h2>

              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex flex-col w-56">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Tahun</label>
                  <select
                    value={tahun}
                    onChange={(e) => {
                      setTahun(e.target.value);
                      setError("");
                    }}
                    className="px-4 py-3 rounded-xl bg-white/70 border border-blue-200 text-gray-700 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">— Pilih Tahun —</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <button
                  onClick={handleLoad}
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-blue-300 disabled:to-cyan-300 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center gap-2 text-white disabled:cursor-not-allowed"
                >
                  <Search size={16} />
                  {loading ? "Memuat..." : "Tampilkan Data"}
                </button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Memuat data rencana aksi...</p>
            </div>
          )}

          {/* Empty state after load */}
          {!loading && data.length === 0 && tahun && !error && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-3xl bg-linear-to-br from-blue-100/30 to-cyan-100/30">
              <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
                <ClipboardList size={48} className="text-blue-400" />
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">Tidak ada data</p>
              <p className="text-gray-600 text-sm text-center max-w-sm">Tidak ditemukan rencana aksi untuk tahun {tahun}</p>
            </div>
          )}

          {/* Table */}
          {!loading && data.length > 0 && (
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
              <div className="p-1">
                <RencanaAksiTable data={data} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-white/40 border-t border-blue-200/50 mt-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                {tahun && <span>Tahun: {tahun}</span>}
                {data.length > 0 && <span>Total Data: {data.length}</span>}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
