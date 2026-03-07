import React, { useEffect, useState, useCallback } from "react";
import { Plus, ArrowLeft, AlertCircle, X, BarChart2, CalendarDays } from "lucide-react";
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
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    nama_layanan: "",
    nilai: "",
    tahun: 2026,
  });

  const fetchSkm = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.get("/skm/dashboard", { params: { tahun } });
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

  useEffect(() => { fetchSkm(); }, [fetchSkm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.nama_layanan.trim()) { setFormError("Nama layanan wajib diisi"); return; }
    if (!form.nilai || Number(form.nilai) < 1 || Number(form.nilai) > 100) {
      setFormError("Nilai harus antara 1–100");
      return;
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.post("/skm", { ...form, tahun, nilai: Number(form.nilai) });
      setShowModal(false);
      setForm({ nama_layanan: "", nilai: "", tahun });
      await fetchSkm();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Gagal menyimpan survey");
    } finally {
      setIsSubmitting(false);
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
          <div className="w-full px-4 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-md shadow-blue-500/30">
                    <BarChart2 size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Survey Kepuasan Masyarakat
                  </h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Dinas Koperasi & UKM — Kelola dan pantau kepuasan layanan</p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Kembali</span>
                </button>
                <button
                  onClick={() => { setFormError(""); setShowModal(true); }}
                  className="px-4 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2 text-white"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Tambah Survey</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error Box */}
        {error && (
          <div className="w-full px-4 sm:px-8 pt-6">
            <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-red-200/50">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <div className="flex-1"><p className="text-red-700">{error}</p></div>
                <button
                  onClick={fetchSkm}
                  className="shrink-0 px-3 py-1 rounded-lg bg-red-200/70 hover:bg-red-300 text-red-700 font-medium text-xs transition-all duration-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="w-full px-4 sm:px-8 py-8 space-y-6">

          {/* Filter Tahun */}
          <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                <CalendarDays size={16} className="text-white" />
              </div>
              <label className="text-sm font-semibold text-gray-700">Filter Tahun</label>
              <select
                className="px-4 py-2 rounded-xl bg-white/70 border border-blue-200 text-gray-700 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
              >
                <option value={2026}>Tahun 2026</option>
                <option value={2025}>Tahun 2025</option>
                <option value={2024}>Tahun 2024</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Memuat data SKM...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-300 rounded-3xl bg-linear-to-br from-blue-100/30 to-cyan-100/30">
              <div className="p-4 rounded-2xl bg-blue-100 border border-blue-200 mb-4">
                <BarChart2 size={48} className="text-blue-400" />
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">Tidak ada data survey</p>
              <p className="text-gray-600 text-sm text-center max-w-sm mb-6">
                Mulai dengan menambahkan survey kepuasan masyarakat untuk tahun {tahun}
              </p>
              <button
                onClick={() => { setFormError(""); setShowModal(true); }}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 text-white flex items-center gap-2"
              >
                <Plus size={16} />
                Tambah Survey
              </button>
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
                <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
                  <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />
                  <div className="p-1">
                    <SkmStatistik data={statistik} />
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="backdrop-blur-xl bg-white/40 border-t border-blue-200/50 mt-20 shadow-sm">
          <div className="w-full px-4 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
              <p>© 2026 Management System v2.0</p>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <span>Total Survey: {data.length}</span>
                <span>Tahun: {tahun}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/95 to-blue-50/95 backdrop-blur-xl shadow-2xl max-w-md w-full">
            <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />

            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400">
                    <Plus size={14} className="text-white" />
                  </div>
                  <h2 className="text-base font-bold text-gray-800">Tambah Survey SKM</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-500 hover:text-gray-700 transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                {formError && (
                  <div className="rounded-xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 p-3 flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-600 shrink-0" />
                    <p className="text-red-700 text-sm">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Layanan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pelayanan UMKM"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-blue-200 text-gray-800 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    value={form.nama_layanan}
                    onChange={(e) => setForm({ ...form, nama_layanan: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nilai Kepuasan (1–100) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Masukkan nilai 1–100"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-blue-200 text-gray-800 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    value={form.nilai}
                    onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Semakin tinggi nilai, semakin baik tingkat kepuasan masyarakat
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-blue-100 bg-blue-50/50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-blue-300 disabled:to-cyan-300 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none disabled:cursor-not-allowed"
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