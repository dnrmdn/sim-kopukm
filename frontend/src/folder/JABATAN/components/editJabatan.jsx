import React, { useEffect, useState } from "react";
import { PlusCircle, CheckCircle, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getJabatanById, updateJabatan } from "@/services/jabatanService";

export default function EditJabatan() {
  const [namaJabatan, setNamaJabatan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [originalNama, setOriginalNama] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch data jabatan saat component mount
  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await getJabatanById(id);
        const jabatan = response.data.data;
        setNamaJabatan(jabatan.nama_jabatan);
        setOriginalNama(jabatan.nama_jabatan);
      } catch (error) {
        console.error("Error fetching jabatan:", error);
        setError(
          error.response?.data?.message || "Gagal memuat data jabatan"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJabatan();
    }
  }, [id]);

  const handleSimpan = async () => {
    setError("");
    setSuccess(false);

    if (!namaJabatan.trim()) {
      setError("Nama jabatan harus diisi");
      return;
    }

    if (namaJabatan === originalNama) {
      setError("Tidak ada perubahan data");
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateJabatan(id, namaJabatan);

      if (response.data.success) {
        setSuccess(true);
        setOriginalNama(namaJabatan);
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving jabatan:", error);
      setError(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSimpan();
    }
  };

  const handleReset = () => {
    setNamaJabatan(originalNama);
    setError("");
    setSuccess(false);
  };

  const isChanged = namaJabatan !== originalNama && namaJabatan.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden py-8 sm:py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-blue-500" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Kembali</span>
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/30">
                  <PlusCircle size={24} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Edit Jabatan
                </h1>
              </div>
              <p className="text-slate-400 text-sm pl-1">
                Perbarui informasi jabatan dalam organisasi Anda
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">Memuat data jabatan...</p>
            </div>
          ) : (
            <>
              {/* Success Message */}
              {success && (
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg flex items-center gap-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-500/20">
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-100 font-semibold">✓ Data berhasil diperbarui!</p>
                    <p className="text-emerald-200 text-sm">Mengalihkan ke halaman sebelumnya...</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur-sm p-4 sm:p-5 shadow-lg flex items-center gap-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/20">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-100 font-semibold">Terjadi Kesalahan</p>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl">
                {/* Decorative orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-gradient-to-br from-blue-500 to-cyan-300" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-gradient-to-br from-purple-500 to-pink-300" />

                <div className="relative p-6 sm:p-10">
                  {/* Form */}
                  <div className="space-y-8">
                    {/* Nama Jabatan Input */}
                    <div>
                      <label className="block text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
                        <PlusCircle size={16} className="text-cyan-400" />
                        Nama Jabatan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Manager IT, Senior Developer, HR Specialist..."
                        value={namaJabatan}
                        onChange={(e) => {
                          setNamaJabatan(e.target.value);
                          if (error) setError("");
                        }}
                        onKeyPress={handleKeyPress}
                        className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          error && !isChanged
                            ? "border-red-500/50 focus:ring-red-400/50 focus:border-red-500"
                            : "border-white/20 focus:ring-blue-400/50 focus:border-white/40"
                        }`}
                        disabled={isSaving}
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          {namaJabatan.length} karakter
                        </div>
                        {isChanged && (
                          <div className="text-xs text-cyan-400 font-semibold">
                            ● Ada perubahan
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Original Value Info */}
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
                      <p className="font-semibold text-slate-200 mb-1">Nilai Sebelumnya:</p>
                      <p className="text-slate-400">{originalNama}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 text-white disabled:opacity-50"
                        disabled={isSaving || !isChanged}
                      >
                        <ArrowLeft size={16} />
                        Reset
                      </button>

                      <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 text-white disabled:opacity-50"
                        disabled={isSaving}
                      >
                        <ArrowLeft size={16} />
                        Batal
                      </button>

                      <button
                        onClick={handleSimpan}
                        disabled={isSaving || !isChanged}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-white disabled:shadow-none"
                      >
                        <CheckCircle size={16} />
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm text-slate-300 text-sm flex items-start gap-3">
                <AlertCircle size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200 mb-1">💡 Tips</p>
                  <p>Gunakan nama jabatan yang jelas dan deskriptif agar memudahkan identifikasi posisi dalam organisasi. Anda dapat melihat nilai sebelumnya di atas.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}