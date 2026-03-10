import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/userService";
import { Avatar } from "@heroui/react";
import axios from "axios";
import Footer from "@/components/Footer";
import Cropper from "react-easy-crop";
import { ArrowLeft, Camera, CheckCircle, AlertCircle, User, Hash, AtSign, Save, Loader2, Shield, X, ZoomIn, ZoomOut, RotateCcw, Crop } from "lucide-react";

const api = axios.create({ baseURL: "http://localhost:4849" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Helper: crop image dari canvas ───────────────────────────────────────────
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        },
        "image/jpeg",
        0.92,
      );
    });
    image.addEventListener("error", reject);
    image.src = imageSrc;
  });
};

// ── Modal Cropper ─────────────────────────────────────────────────────────────
function CropModal({ src, onDone, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels);
      const file = new File([blob], `avatar_crop_${Date.now()}.jpg`, { type: "image/jpeg" });
      onDone(file, URL.createObjectURL(blob));
    } catch {
      // silent
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20">
              <Crop size={15} className="text-sky-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Sesuaikan Foto</p>
              <p className="text-gray-400 text-[11px]">Geser, perbesar, atau perkecil foto</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="relative w-full bg-black" style={{ height: 320 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { borderRadius: 0 },
              cropAreaStyle: { border: "2px solid #38bdf8", boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)" },
            }}
          />
        </div>
        <div className="px-5 py-4 border-t border-white/10 bg-gray-900/80">
          <div className="flex items-center gap-3">
            <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <ZoomOut size={15} />
            </button>
            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-sky-500 cursor-pointer h-1.5" />
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-500 mt-2">Zoom: {zoom.toFixed(1)}x</p>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className="flex-1 py-2.5 rounded-xl bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/25"
          >
            {processing ? <Loader2 size={14} className="animate-spin" /> : <Crop size={14} />}
            {processing ? "Memproses..." : "Gunakan Foto Ini"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ProfilePage ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const usernameTimer = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");

  const [name, setName] = useState("");
  const [nip, setNip] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Cropper state
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Username availability
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null | true | false

  // ── Load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCurrentUser();
        const u = res.data.data;
        setUser(u);
        setName(u.name || "");
        setNip(u.nip || "");
        setUsername(u.username || "");
        setAvatarPreview(u.avatar || null);
      } catch {
        setGlobalError("Gagal memuat data profil. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Username availability check ─────────────────────────────────────────
  const checkUsernameAvailability = useCallback(async (val, currentUsername) => {
    if (!val.trim() || val.trim() === currentUsername) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const res = await api.get(`/api/user/check-username?username=${encodeURIComponent(val.trim())}`);
      setUsernameAvailable(res.data?.available ?? true);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Nama tidak boleh kosong";
    if (nip.trim()) {
      if (!/^\d+$/.test(nip.trim())) {
        e.nip = "NIP hanya boleh berisi angka";
      } else if (nip.trim().length !== 18) {
        e.nip = `NIP harus tepat 18 digit (sekarang ${nip.trim().length} digit)`;
      }
    }
    if (!username.trim()) {
      e.username = "Username tidak boleh kosong";
    } else if (usernameAvailable === false) {
      e.username = "Username sudah digunakan, pilih username lain";
    }
    return e;
  };

  // ── Avatar picker → buka cropper ────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((p) => ({ ...p, avatar: "Format tidak didukung. Gunakan JPG, PNG, atau WebP" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((p) => ({ ...p, avatar: "Ukuran foto maksimal 2 MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
    setErrors((p) => {
      const n = { ...p };
      delete n.avatar;
      return n;
    });
  };

  const handleCropDone = (file, previewUrl) => {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setShowCropper(false);
    setCropSrc(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCropSrc(null);
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar || null);
    if (fileRef.current) fileRef.current.value = "";
    setErrors((p) => {
      const n = { ...p };
      delete n.avatar;
      return n;
    });
  };

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccess("");

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("nip", nip.trim());
      fd.append("username", username.trim());
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await api.put("/api/user/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        const updated = res.data.data;
        setUser(updated);
        setAvatarFile(null);
        setAvatarPreview(updated.avatar || null);
        setSuccess("Profil berhasil diperbarui!");
        setTimeout(() => {
          setSuccess("");
          navigate("/overview");
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.toLowerCase().includes("username")) setErrors({ username: msg });
      else if (msg?.toLowerCase().includes("nip")) setErrors({ nip: msg });
      else setGlobalError(msg || "Terjadi kesalahan. Coba beberapa saat lagi.");
    } finally {
      setSaving(false);
    }
  };

  // ── Field helper ────────────────────────────────────────────────────────
  const fieldClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl bg-white border text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? "border-red-300 focus:ring-red-300 bg-red-50/30" : "border-slate-200 focus:ring-sky-400 focus:border-transparent"
    }`;

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 border-r-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      {showCropper && cropSrc && <CropModal src={cropSrc} onDone={handleCropDone} onCancel={handleCropCancel} />}

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50/20 to-blue-50/30 text-gray-900 overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] bg-linear-to-br from-sky-400 to-blue-300 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06] bg-linear-to-tr from-blue-400 to-cyan-300 blur-3xl" />
        </div>

        <div className="relative z-10">
          <header className="backdrop-blur-xl bg-white/70 border-b border-slate-200/80 sticky top-0 z-20 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-linear-to-br from-sky-500 to-blue-500 shadow-md shadow-sky-400/30">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-800 tracking-tight">Profil Saya</h1>
                  <p className="text-gray-400 text-[11px]">Kelola informasi akun Anda</p>
                </div>
              </div>
              <button onClick={() => navigate(-1)} className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-gray-600 font-medium text-sm transition-all flex items-center gap-2 shadow-sm">
                <ArrowLeft size={14} /> Kembali
              </button>
            </div>
          </header>

          <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-5">
            {globalError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm flex-1">{globalError}</p>
                <button onClick={() => setGlobalError("")} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Avatar Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-sky-500 via-blue-400 to-cyan-400" />
              <div className="h-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #cffafe 100%)" }}>
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 50%, #38bdf8 0%, transparent 50%)" }} />
              </div>
              <div className="px-6 sm:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-4">
                  <div className="relative w-24 h-24 shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg" />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <Avatar name={user?.name} showFallback className="w-full h-full rounded-none text-2xl" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 border-2 border-white flex items-center justify-center shadow-md transition-all"
                      title="Ganti foto"
                    >
                      <Camera size={14} className="text-white" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" />
                  </div>
                  <div className="sm:mb-1 flex-1">
                    <p className="text-lg font-bold text-gray-800 capitalize leading-tight">{user?.name}</p>
                    <p className="text-sky-500 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                      <Shield size={12} /> {user?.role || "User"}
                    </p>
                    {avatarFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">⚠ Foto belum disimpan</span>
                        <button type="button" onClick={cancelAvatarChange} className="text-[11px] text-red-400 hover:text-red-600 underline transition-colors">
                          Batalkan
                        </button>
                      </div>
                    )}
                    {errors.avatar && (
                      <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.avatar}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-gray-400">Format: JPG, PNG, WebP · Maks. 2 MB · Foto akan dipotong otomatis menjadi lingkaran</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-sky-500 via-blue-400 to-cyan-400" />
              <div className="p-6 sm:p-8">
                <h2 className="font-bold text-gray-800 text-sm mb-5 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-linear-to-br from-sky-500 to-blue-500">
                    <AtSign size={13} className="text-white" />
                  </div>
                  Informasi Akun
                </h2>

                {success && (
                  <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    <p className="text-emerald-700 text-sm font-semibold flex-1">{success}</p>
                    <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                  {/* Nama */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User size={11} /> Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((p) => {
                          const n = { ...p };
                          delete n.name;
                          return n;
                        });
                      }}
                      placeholder="Masukkan nama lengkap"
                      className={fieldClass("name")}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* NIP */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Hash size={11} /> NIP <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => {
                        setNip(e.target.value.replace(/\D/g, ""));
                        setErrors((p) => {
                          const n = { ...p };
                          delete n.nip;
                          return n;
                        });
                      }}
                      placeholder="18 digit Nomor Induk Pegawai"
                      maxLength={18}
                      className={`${fieldClass("nip")} font-mono tracking-widest`}
                    />
                    <div className="flex items-center justify-between">
                      {errors.nip ? (
                        <p className="text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors.nip}
                        </p>
                      ) : nip.length > 0 && nip.length < 18 ? (
                        <p className="text-[11px] text-amber-500 flex items-center gap-1">
                          <AlertCircle size={11} /> Kurang {18 - nip.length} digit lagi
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className={`text-[11px] tabular-nums font-semibold ${nip.length === 18 ? "text-sky-500" : nip.length > 0 ? "text-red-400" : "text-gray-400"}`}>{nip.length}/18</p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <AtSign size={11} /> Username <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium select-none pointer-events-none">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s/g, "").toLowerCase();
                          setUsername(val);
                          setUsernameAvailable(null);
                          setErrors((p) => {
                            const n = { ...p };
                            delete n.username;
                            return n;
                          });
                          clearTimeout(usernameTimer.current);
                          if (val.trim() && val.trim() !== user?.username) {
                            usernameTimer.current = setTimeout(() => checkUsernameAvailability(val, user?.username), 600);
                          }
                        }}
                        placeholder="username"
                        className={`${fieldClass("username")} pl-8 pr-8`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {checkingUsername && <Loader2 size={14} className="animate-spin text-gray-400" />}
                        {!checkingUsername && usernameAvailable === true && username !== user?.username && <CheckCircle size={14} className="text-emerald-500" />}
                        {!checkingUsername && usernameAvailable === false && <AlertCircle size={14} className="text-red-500" />}
                      </div>
                    </div>
                    {errors.username ? (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.username}
                      </p>
                    ) : usernameAvailable === false ? (
                      <p className="text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} /> Username sudah digunakan
                      </p>
                    ) : usernameAvailable === true && username !== user?.username ? (
                      <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                        <CheckCircle size={11} /> Username tersedia
                      </p>
                    ) : null}
                  </div>

                  <div className="border-t border-slate-100 pt-1" />

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving || checkingUsername || usernameAvailable === false}
                      className="flex-1 sm:flex-none sm:w-auto px-7 py-2.5 rounded-xl bg-linear-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm text-white shadow-lg shadow-sky-400/25 flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      disabled={saving}
                      className="flex-1 sm:flex-none sm:w-auto px-7 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm text-gray-600 shadow-sm flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <X size={15} /> Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
