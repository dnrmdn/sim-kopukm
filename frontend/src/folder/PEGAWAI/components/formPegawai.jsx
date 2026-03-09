import React, { useEffect, useState } from "react";
import { User, Hash, TrendingUp, Users, Save, X, AlertCircle, ArrowLeft, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FormPegawai({ 
  initialData = {}, 
  onSubmit, 
  isEdit = false, 
  pegawaiList = [],
  jabatanList = [] 
}) {
  const [form, setForm] = useState({
    nama_lengkap: "",
    nip: "",
    level: "",
    id_atasan: "",
    id_jabatan: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localJabatan, setLocalJabatan] = useState([]);
  const navigate = useNavigate();

  // Fetch jabatan data jika belum ada
  useEffect(() => {
    if (jabatanList && jabatanList.length > 0) {
      setLocalJabatan(jabatanList);
    } else {
      // Fallback: fetch dari API jika tidak diberikan sebagai prop
      fetchJabatan();
    }
  }, [jabatanList]);

  const fetchJabatan = async () => {
    try {
      const response = await fetch("/api/jabatan"); // Sesuaikan endpoint
      if (response.ok) {
        const data = await response.json();
        setLocalJabatan(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching jabatan:", error);
    }
  };

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        nama_lengkap: initialData.nama_lengkap || "",
        nip: initialData.nip || "",
        level: initialData.level?.toString() || "",
        id_atasan: initialData.id_atasan?.toString() || "",
        id_jabatan: initialData.id_jabatan?.toString() || "",
      });
    }
  }, [initialData, isEdit]);

  const handleChange = (field, value) => {
    if (field === "nip") {
      value = value.replace(/[^0-9]/g, "").slice(0, 18);
    }
    
    // HANYA check validity ketika LEVEL yang berubah
    if (field === "level") {
      const newLevel = parseInt(value);
      
      // Check atasan validity
      if (form.id_atasan && form.id_atasan !== "0") {
        const atasanLevel = parseInt(pegawaiList.find(p => p.id_pegawai.toString() === form.id_atasan.toString())?.level || 999);
        
        // Jika atasan tidak valid lagi, clear atasan
        if (atasanLevel >= newLevel || atasanLevel === 0) {
          setForm((prev) => ({ ...prev, [field]: value, id_atasan: "0" }));
          if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
          return;
        }
      }
      
      // Check jabatan validity
      if (form.id_jabatan) {
        const jabatanLevel = parseInt(localJabatan.find(j => j.id_jabatan.toString() === form.id_jabatan.toString())?.level || 999);
        
        // Jika jabatan tidak sesuai level, clear jabatan
        if (jabatanLevel !== newLevel) {
          setForm((prev) => ({ ...prev, [field]: value, id_jabatan: "" }));
          if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
          return;
        }
      }
    }
    
    // Normal update tanpa validation (untuk field lain)
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.nama_lengkap.trim()) newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    if (!form.nip.trim()) newErrors.nip = "NIP wajib diisi";
    else if (form.nip.length !== 18) newErrors.nip = "NIP harus tepat 18 digit";
    if (!form.level) newErrors.level = "Level wajib dipilih";
    if (!form.id_jabatan) newErrors.id_jabatan = "Jabatan wajib dipilih";

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

  const getJabatanDisplayName = (id) => {
    if (!id || id === "") return "Pilih Jabatan";
    const jabatan = localJabatan.find((j) => j.id_jabatan.toString() === id.toString());
    return jabatan ? jabatan.nama_jabatan : "Jabatan Tidak Ditemukan";
  };

  const inputBase = "w-full px-4 py-3 rounded-xl bg-white/70 border text-gray-800 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200";
  const inputNormal = `${inputBase} border-blue-200 focus:ring-blue-400`;
  const inputError  = `${inputBase} border-red-300 focus:ring-red-400`;

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
                    <User size={20} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {isEdit ? "Perbarui Data Pegawai" : "Registrasi Pegawai Baru"}
                  </h1>
                </div>
                <p className="text-gray-600 text-sm pl-1">Pastikan data hierarki sesuai dengan struktur organisasi terbaru.</p>
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
        <main className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
          <div className="space-y-4">

            {/* Form Card */}
            <div className="rounded-2xl border border-blue-200/70 bg-linear-to-br from-white/80 to-blue-50/80 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-blue-500 to-cyan-400" />

              <div className="p-6 sm:p-8 space-y-6">

                {/* Grid fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* NAMA LENGKAP */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      Nama Lengkap
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Aditiya Wijaya"
                      value={form.nama_lengkap}
                      onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                      className={errors.nama_lengkap ? inputError : inputNormal}
                    />
                    {errors.nama_lengkap && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs">
                        <AlertCircle size={13} />
                        <span>{errors.nama_lengkap}</span>
                      </div>
                    )}
                  </div>

                  {/* NIP */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Hash size={14} className="text-blue-500" />
                      NIP
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="18 digit angka"
                      value={form.nip}
                      onChange={(e) => handleChange("nip", e.target.value)}
                      maxLength="18"
                      className={errors.nip ? inputError : inputNormal}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{form.nip.length}/18 digit</span>
                      {form.nip.length === 18 && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          NIP lengkap
                        </span>
                      )}
                    </div>
                    {errors.nip && (
                      <div className="flex items-center gap-1.5 mt-1 text-red-600 text-xs">
                        <AlertCircle size={13} />
                        <span>{errors.nip}</span>
                      </div>
                    )}
                  </div>

                  {/* LEVEL */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-blue-500" />
                      Level
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => handleChange("level", e.target.value)}
                      className={`${errors.level ? inputError : inputNormal} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Pilih Level</option>
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>Level {lvl}</option>
                      ))}
                    </select>
                    {errors.level && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs">
                        <AlertCircle size={13} />
                        <span>{errors.level}</span>
                      </div>
                    )}
                  </div>

                  {/* JABATAN DEFINITIF */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Briefcase size={14} className="text-blue-500" />
                      Jabatan Definitif
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <select
                      value={form.id_jabatan}
                      onChange={(e) => handleChange("id_jabatan", e.target.value)}
                      className={`${errors.id_jabatan ? inputError : inputNormal} appearance-none cursor-pointer`}
                      disabled={!form.level}
                    >
                      <option value="" disabled>
                        {form.level ? "Pilih Jabatan" : "Pilih Level terlebih dahulu"}
                      </option>
                      {form.level && localJabatan.length > 0 ? (
                        localJabatan
                          .filter((j) => {
                            // Filter jabatan berdasarkan level yang dipilih
                            const jabatanLevel = j.level ? parseInt(j.level) : null;
                            const pegawaiLevel = parseInt(form.level);
                            return jabatanLevel === pegawaiLevel;
                          })
                          .slice()
                          .sort((a, b) => {
                            const levelA = a.level || 999;
                            const levelB = b.level || 999;
                            return levelA - levelB;
                          })
                          .map((jabatan) => (
                            <option key={jabatan.id_jabatan} value={jabatan.id_jabatan.toString()}>
                              {jabatan.nama_jabatan}
                            </option>
                          ))
                      ) : form.level ? (
                        <option disabled>Tidak ada jabatan untuk level {form.level}</option>
                      ) : (
                        <option disabled>Memuat data jabatan...</option>
                      )}
                    </select>
                    {errors.id_jabatan && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs">
                        <AlertCircle size={13} />
                        <span>{errors.id_jabatan}</span>
                      </div>
                    )}
                    {form.id_jabatan && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
                        <span className="font-semibold">Jabatan dipilih:</span>
                        <span>{getJabatanDisplayName(form.id_jabatan)}</span>
                      </div>
                    )}
                    {form.level && localJabatan.filter((j) => {
                      const jabatanLevel = j.level ? parseInt(j.level) : null;
                      const pegawaiLevel = parseInt(form.level);
                      return jabatanLevel === pegawaiLevel;
                    }).length === 0 && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
                        <span className="text-amber-600">⚠️</span>
                        <span>Tidak ada jabatan untuk level {form.level}</span>
                      </div>
                    )}
                  </div>

                  {/* ATASAN */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Users size={14} className="text-blue-500" />
                      Atasan
                    </label>
                    <select
                      value={form.id_atasan}
                      onChange={(e) => handleChange("id_atasan", e.target.value)}
                      className={`${inputNormal} appearance-none cursor-pointer`}
                      disabled={!form.level}
                    >
                      <option value="0">
                        {form.level ? "— Tidak Ada (Level Tertinggi) —" : "Pilih Level terlebih dahulu"}
                      </option>
                      {form.level && pegawaiList
                        .filter((p) => {
                          // Filter: atasan harus level lebih rendah dari yang dipilih
                          const pegawaiLevel = parseInt(form.level);
                          const atasanLevel = parseInt(p.level);
                          // Atasan hanya bisa yg levelnya lebih kecil (lebih tinggi di hierarki)
                          // Exclude level 0 dan level sama
                          return atasanLevel < pegawaiLevel && 
                                 atasanLevel > 0 &&
                                 p.id_pegawai.toString() !== initialData.id_pegawai?.toString();
                        })
                        .slice()
                        .sort((a, b) => parseInt(a.level) - parseInt(b.level))
                        .map((p) => (
                          <option key={p.id_pegawai} value={p.id_pegawai.toString()}>
                            {p.nama_lengkap} — Level {p.level}
                          </option>
                        ))}
                    </select>
                    {form.level && !form.id_atasan || form.id_atasan === "0" && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
                        <span className="text-blue-600">ℹ️</span>
                        <span>Posisi ini tidak memiliki atasan (Level Tertinggi)</span>
                      </div>
                    )}
                    {form.id_atasan && form.id_atasan !== "0" && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
                        <span className="font-semibold">Atasan dipilih:</span>
                        <span>{getAtasanDisplayName(form.id_atasan)}</span>
                      </div>
                    )}
                    {form.level && pegawaiList.filter((p) => {
                      const pegawaiLevel = parseInt(form.level);
                      const atasanLevel = parseInt(p.level);
                      return atasanLevel < pegawaiLevel && 
                             atasanLevel > 0 &&
                             p.id_pegawai.toString() !== initialData.id_pegawai?.toString();
                    }).length === 0 && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2">
                        <span className="text-amber-600">⚠️</span>
                        <span>Tidak ada atasan dengan level lebih tinggi</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-100" />

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 rounded-lg bg-white/60 hover:bg-white/80 border border-blue-200 text-gray-700 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X size={15} />
                    Batal
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-blue-300 disabled:to-cyan-300 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:shadow-none flex items-center justify-center gap-2 text-white disabled:cursor-not-allowed"
                  >
                    <Save size={15} />
                    {isSubmitting ? "Memproses..." : isEdit ? "Simpan Perubahan" : "Daftarkan Pegawai"}
                  </button>
                </div>
              </div>
            </div>

            {/* Tips box */}
            <div className="p-4 rounded-xl border border-blue-200/70 bg-linear-to-br from-white/60 to-blue-50/60 backdrop-blur-sm flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-blue-100 shrink-0 mt-0.5">
                <AlertCircle size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-0.5">Tips</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pastikan level pegawai sesuai dengan posisi dalam organisasi. Atasan harus memiliki level yang lebih tinggi dari subordinat. Pilih jabatan definitif yang sesuai dengan struktur organisasi.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}