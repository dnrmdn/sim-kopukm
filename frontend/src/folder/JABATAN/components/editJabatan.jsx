import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, AlertCircle, PencilLine, RotateCcw } from "lucide-react";
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
        setError(error.response?.data?.message || "Gagal memuat data jabatan");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchJabatan();
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
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSimpan();
  };

  const handleReset = () => {
    setNamaJabatan(originalNama);
    setError("");
    setSuccess(false);
  };

  const isChanged = namaJabatan !== originalNama && namaJabatan.trim() !== "";

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
                    <PencilLine size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Edit Jabatan
                  </h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Perbarui informasi jabatan dalam organisasi Anda</p>
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

        {/* Main */}
        <main className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-cyan-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Memuat data jabatan...</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Success */}
              {success && (
                <div className="rounded-2xl border border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-2 rounded-lg bg-emerald-200/50">
                      <CheckCircle size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-emerald-800 font-semibold text-sm">Data berhasil diperbarui!</p>
                      <p className="text-emerald-700 text-xs mt-0.5">Mengalihkan ke halaman sebelumnya...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-red-300 bg-linear-to-br from-red-50 to-red-100/50 backdrop-blur-sm p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 p-2 rounded-lg bg-red-200/50">
                      <AlertCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-red-800 font-semibold text-sm">Terjadi Kesalahan</p>
                      <p className="text-red-700 text-xs mt-0.5">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />

                <div className="p-6 sm:p-8 space-y-6">

                  {/* Original value badge */}
                  {originalNama && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/70 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-blue-100 shrink-0 mt-0.5">
                        <PencilLine size={13} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-0.5">Nilai Saat Ini</p>
                        <p className="text-sm text-gray-800 font-medium">{originalNama}</p>
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <PencilLine size={14} className="text-blue-500" />
                      Nama Jabatan
                      <span className="text-red-400 ml-0.5">*</span>
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
                      disabled={isSaving}
                      className={`w-full px-4 py-3 rounded-xl bg-white/70 border text-gray-800 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 disabled:opacity-60 ${
                        error ? "border-red-300 focus:ring-red-400" : "border-blue-200 focus:ring-blue-400"
                      }`}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{namaJabatan.length} karakter</span>
                      {isChanged && (
                        <span className="text-xs font-semibold text-blue-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                          Ada perubahan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-blue-100" />

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleReset}
                      disabled={isSaving || !isChanged}
                      className="px-5 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={15} />
                      Reset
                    </button>

                    <button
                      onClick={() => navigate(-1)}
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <ArrowLeft size={15} />
                      Batal
                    </button>

                    <button
                      onClick={handleSimpan}
                      disabled={isSaving || !isChanged}
                      className="flex-1 px-5 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-blue-300 disabled:to-cyan-300 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2 text-white disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={15} />
                      {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-xl border border-blue-200/70 bg-linear-to-br from-white/60 to-blue-50/60 backdrop-blur-sm flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-100 shrink-0 mt-0.5">
                  <AlertCircle size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">Tips</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Gunakan nama jabatan yang jelas dan deskriptif agar memudahkan identifikasi posisi dalam organisasi. Anda dapat melihat nilai sebelumnya di atas.
                  </p>
                </div>
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
                <span>Mode: Edit Jabatan</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}