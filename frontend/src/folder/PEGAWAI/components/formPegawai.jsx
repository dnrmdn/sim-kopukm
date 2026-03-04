import React, { useEffect, useState } from "react";
import { User, Hash, TrendingUp, Users, Save, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormPegawai({ initialData = {}, onSubmit, isEdit = false, pegawaiList = [] }) {
  const [form, setForm] = useState({
    nama_lengkap: "",
    nip: "",
    level: "",
    id_atasan: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        nama_lengkap: initialData.nama_lengkap || "",
        nip: initialData.nip || "",
        level: initialData.level?.toString() || "",
        id_atasan: initialData.id_atasan?.toString() || "",
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (field, value) => {
    // Validasi NIP - hanya angka dan maksimal 18 karakter
    if (field === "nip") {
      // Hanya izinkan angka
      value = value.replace(/[^0-9]/g, "");
      // Batasi maksimal 18 karakter
      if (value.length > 18) {
        value = value.slice(0, 18);
      }
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!form.nama_lengkap.trim()) {
      newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    }
    if (!form.nip.trim()) {
      newErrors.nip = "NIP wajib diisi";
    } else if (form.nip.length !== 18) {
      newErrors.nip = "NIP harus tepat 18 digit";
    }
    if (!form.level) {
      newErrors.level = "Level wajib dipilih";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const levels = ["1", "2", "3", "4", "5"];

  const getAtasanDisplayName = (id) => {
    if (!id || id === "0") return "— Tidak Ada (Level Tertinggi) —";
    const atasan = pegawaiList.find((p) => p.id_pegawai.toString() === id.toString());
    return atasan ? `${atasan.nama_lengkap} (Level ${atasan.level})` : "Pilih Atasan";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden py-8 sm:py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-blue-500" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-purple-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
              <X size={20} />
              <span className="text-sm">Kembali</span>
            </button>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">{isEdit ? "Perbarui Data Pegawai" : "Registrasi Pegawai Baru"}</h1>
              <p className="text-slate-400 text-sm">Pastikan data hierarki sesuai dengan struktur organisasi terbaru.</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/40 to-slate-800/30 backdrop-blur-xl shadow-xl">
            {/* Decorative orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-gradient-to-br from-blue-500 to-cyan-300" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl bg-gradient-to-br from-purple-500 to-pink-300" />

            <div className="relative p-6 sm:p-10">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* NAMA LENGKAP */}
                <div className="md:col-span-2">
                  <label className="block text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
                    <User size={16} className="text-cyan-400" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Aditiya Wijaya"
                    value={form.nama_lengkap}
                    onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.nama_lengkap ? "border-red-500/50 focus:ring-red-400/50 focus:border-red-500" : "border-white/20 focus:ring-blue-400/50 focus:border-white/40"
                    }`}
                  />
                  {errors.nama_lengkap && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.nama_lengkap}</span>
                    </div>
                  )}
                </div>

                {/* NIP */}
                <div>
                  <label className="block text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
                    <Hash size={16} className="text-cyan-400" />
                    NIP
                  </label>
                  <input
                    type="text"
                    placeholder="18 digit angka"
                    value={form.nip}
                    onChange={(e) => handleChange("nip", e.target.value)}
                    maxLength="18"
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.nip ? "border-red-500/50 focus:ring-red-400/50 focus:border-red-500" : "border-white/20 focus:ring-blue-400/50 focus:border-white/40"
                    }`}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-slate-400">{form.nip.length}/18 digit</div>
                    {form.nip.length === 18 && <div className="text-xs text-emerald-400 font-semibold">✓ NIP lengkap</div>}
                  </div>
                  {errors.nip && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.nip}</span>
                    </div>
                  )}
                </div>

                {/* LEVEL */}
                <div>
                  <label className="block text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-cyan-400" />
                    Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => handleChange("level", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer ${
                      errors.level ? "border-red-500/50 focus:ring-red-400/50 focus:border-red-500" : "border-white/20 focus:ring-blue-400/50 focus:border-white/40"
                    }`}
                  >
                    <option value="" disabled>
                      Pilih Level
                    </option>
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-slate-800">
                        Level {lvl}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.level}</span>
                    </div>
                  )}
                </div>

                {/* ATASAN */}
                <div className="md:col-span-2">
                  <label className="block text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
                    <Users size={16} className="text-cyan-400" />
                    Atasan
                  </label>
                  <select
                    value={form.id_atasan}
                    onChange={(e) => handleChange("id_atasan", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-white/40 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="0" className="bg-slate-800">
                      — Tidak Ada (Level Tertinggi) —
                    </option>
                    {pegawaiList
                      .filter((p) => p.id_pegawai.toString() !== initialData.id_pegawai?.toString())
                      .map((p) => (
                        <option key={p.id_pegawai} value={p.id_pegawai.toString()} className="bg-slate-800">
                          {p.nama_lengkap} - Level {p.level}
                        </option>
                      ))}
                  </select>
                  {form.id_atasan && form.id_atasan !== "0" && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
                      <span className="font-semibold">✓ Atasan dipilih:</span>
                      <span>{getAtasanDisplayName(form.id_atasan)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12 pt-8 border-t border-white/10">
                <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 text-white">
                  <X size={16} />
                  Batal
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-white"
                >
                  <Save size={16} />
                  {isSubmitting ? "Memproses..." : isEdit ? "Simpan Perubahan" : "Daftarkan Pegawai"}
                </button>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm text-slate-300 text-sm flex items-start gap-3">
            <AlertCircle size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 mb-1">💡 Tips</p>
              <p>Pastikan level pegawai sesuai dengan posisi dalam organisasi. Atasan harus memiliki level yang lebih tinggi dari subordinat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
