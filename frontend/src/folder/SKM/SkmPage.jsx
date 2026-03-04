import React, { useEffect, useState, useCallback } from "react";
import { Plus, ArrowLeft, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import SkmCard from "./SkmCard";
import SkmStatistik from "./SkmStatistik";

export default function SkmPage() {
  const navigate = useNavigate();
  const [tahun, setTahun] = useState(2026);
  const [data, setData] = useState([]);
  const [statistik, setStatistik] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama_layanan: "",
    nilai: "",
    tahun: 2026,
  });

  // ================= FETCH SKM =================
  const fetchSkm = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/skm/dashboard", {
        params: { tahun },
      });
      setData(res.data?.layanan || []);
      setStatistik(res.data?.statistik || null);
    } catch (err) {
      console.error("Gagal mengambil data SKM:", err);
      setError("Gagal memuat data SKM");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [tahun]);

  useEffect(() => {
    fetchSkm();
  }, [fetchSkm]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama_layanan.trim()) {
      alert("Nama layanan wajib diisi");
      return;
    }

    if (!form.nilai || Number(form.nilai) < 1 || Number(form.nilai) > 100) {
      alert("Nilai harus antara 1-100");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/skm", {
        ...form,
        tahun,
        nilai: Number(form.nilai),
      });
      setShowModal(false);
      setForm({ nama_layanan: "", nilai: "", tahun });
      await fetchSkm();
      alert("Survey berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-blue-500" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-slate-900/40 border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Kembali</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Survey Kepuasan Masyarakat
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                  Dinas Koperasi & UKM - Kelola dan pantau kepuasan layanan
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-500/30 bg-linear-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg flex items-center gap-4">
              <div className="shrink-0 p-2 rounded-lg bg-red-500/20">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-100">{error}</p>
              </div>
              <button
                onClick={() => fetchSkm()}
                className="shrink-0 px-3 py-1 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-100 font-medium text-xs transition-all duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Filter Tahun
              </label>
              <select
                className="rounded-lg bg-white/10 border border-white/20 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
              >
                <option value={2026} className="bg-slate-900">
                  Tahun 2026
                </option>
                <option value={2025} className="bg-slate-900">
                  Tahun 2025
                </option>
                <option value={2024} className="bg-slate-900">
                  Tahun 2024
                </option>
              </select>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-white"
            >
              <Plus size={18} />
              Tambah Survey
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">Memuat data SKM...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-3xl bg-linear-to-br from-slate-800/20 to-slate-700/10">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-xl font-bold text-white mb-2">Tidak ada data survey</p>
              <p className="text-slate-400 text-sm text-center max-w-sm">
                Mulai dengan menambahkan survey kepuasan masyarakat untuk tahun {tahun}
              </p>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((item, i) => (
                  <SkmCard key={i} data={item} />
                ))}
              </div>

              {/* Statistik */}
              {statistik && (
                <div className="mt-8">
                  <SkmStatistik data={statistik} />
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-slate-900/40 border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total Survey: {data.length}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl max-w-md w-full">
            {/* Decorative orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-blue-500 to-cyan-300" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-linear-to-br from-purple-500 to-pink-300" />

            <form onSubmit={handleSubmit} className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Tambah Survey SKM</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pelayanan UMKM"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                    value={form.nama_layanan}
                    onChange={(e) =>
                      setForm({ ...form, nama_layanan: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Nilai Kepuasan (1–100)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Masukkan nilai 1-100"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200"
                    value={form.nilai}
                    onChange={(e) =>
                      setForm({ ...form, nilai: e.target.value })
                    }
                    required
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Semakin tinggi nilai, semakin baik tingkat kepuasan masyarakat
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-white/10 bg-white/5 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}