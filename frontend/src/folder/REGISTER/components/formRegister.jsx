import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { getPegawai } from "@/services/pegawaiService";
import ErrorAlert from "../../LOGIN/components/errorAlert.jsx";
import FormInput from "../../LOGIN/components/formInput.jsx";
import PasswordInput from "../../LOGIN/components/passwordInput.jsx";
import LoadingSpinner from "../../LOGIN/components/loadingSpinner.jsx";
import AvatarUpload from "./avatarUpload.jsx";

// Icon Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.65 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IdCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2H9.17C9.583 16.835 10.694 16 12 16z" />
  </svg>
);

const BadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MAX_ATTEMPTS = 3;
const COOLDOWN_MINUTES = 5;

export default function RegisterForm({ onRegisterSuccess, onNavigateLogin }) {
  const [form, setForm] = useState({
    nip: "",
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "super_admin",
  });
  const [avatar, setAvatar] = useState(null); // { file: File, url: string } | null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nipVerified, setNipVerified] = useState(false);
  const [nipData, setNipData] = useState(null);
  const [checkingNip, setCheckingNip] = useState(false);
  const [nipError, setNipError] = useState("");
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loadingPegawai, setLoadingPegawai] = useState(true);

  // Rate limiter state
  const [verifyAttempts, setVerifyAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const NIP_LENGTH = 18;

  // ✅ Load pegawai data on component mount
  useEffect(() => {
    const loadPegawaiData = async () => {
      setLoadingPegawai(true);
      try {
        const response = await getPegawai();
        const data = response?.data?.data;
        let pegawaiArray = [];
        if (Array.isArray(data)) {
          pegawaiArray = data;
        } else {
          console.warn("⚠️ Data is not array");
        }
        setPegawaiList(pegawaiArray);
      } catch (err) {
        console.error("Failed to load pegawai:", err);
        setPegawaiList([]);
        setError("Gagal memuat data pegawai");
      } finally {
        setLoadingPegawai(false);
      }
    };
    loadPegawaiData();
  }, []);

  // ✅ Cooldown countdown timer
  useEffect(() => {
    if (!cooldownUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownRemaining(0);
        setVerifyAttempts(0);
        setNipError("");
      } else {
        setCooldownRemaining(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  // ✅ Handle NIP input
  const handleNipChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > NIP_LENGTH) value = value.slice(0, NIP_LENGTH);
    setForm((prev) => ({ ...prev, nip: value }));
    setNipVerified(false);
    setNipData(null);
    setNipError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Verify NIP with rate limiter
  const handleVerifyNip = async () => {
    if (cooldownUntil && Date.now() < cooldownUntil) {
      setNipError(`Terlalu banyak percobaan gagal. Coba lagi dalam ${cooldownRemaining} detik.`);
      return;
    }
    if (form.nip.length === 0) { setNipError("NIP tidak boleh kosong"); return; }
    if (form.nip.length < NIP_LENGTH) { setNipError(`NIP harus tepat ${NIP_LENGTH} digit (Anda masukkan ${form.nip.length} digit)`); return; }
    if (!Array.isArray(pegawaiList)) { setNipError("Data pegawai tidak valid. Silakan refresh halaman."); return; }
    if (pegawaiList.length === 0) { setNipError("Data pegawai kosong. Silakan refresh halaman."); return; }

    setCheckingNip(true);
    setNipError("");
    setError("");

    try {
      const pegawai = pegawaiList.find((p) => p.nip === form.nip);
      if (pegawai) {
        setVerifyAttempts(0);
        setNipVerified(true);
        setNipData(pegawai);
        const namaLengkap = pegawai.nama || pegawai.nama_lengkap || "";
        setForm((prev) => ({ ...prev, name: namaLengkap }));
        setNipError("");
      } else {
        const newAttempts = verifyAttempts + 1;
        setVerifyAttempts(newAttempts);
        setNipVerified(false);
        setNipData(null);
        setForm((prev) => ({ ...prev, name: "" }));
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + COOLDOWN_MINUTES * 60 * 1000;
          setCooldownUntil(until);
          setCooldownRemaining(COOLDOWN_MINUTES * 60);
          setNipError(`NIP tidak terdaftar. Anda telah gagal ${MAX_ATTEMPTS}x. Verifikasi dikunci selama ${COOLDOWN_MINUTES} menit.`);
        } else {
          setNipError(`NIP tidak terdaftar di database pegawai. Sisa percobaan: ${remainingAttempts}x`);
        }
      }
    } catch (err) {
      setNipVerified(false);
      setNipData(null);
      setForm((prev) => ({ ...prev, name: "" }));
      setNipError("Gagal verifikasi NIP");
      console.error("NIP Verification Error:", err);
    } finally {
      setCheckingNip(false);
    }
  };

  const validateForm = () => {
    if (!nipVerified) { setError("Verifikasi NIP terlebih dahulu"); return false; }
    if (!form.username.trim()) { setError("Username tidak boleh kosong"); return false; }
    if (form.username.length < 3) { setError("Username minimal 3 karakter"); return false; }
    if (!form.name.trim()) { setError("Nama tidak boleh kosong"); return false; }
    if (!form.password.trim()) { setError("Password tidak boleh kosong"); return false; }
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return false; }
    if (form.password !== form.confirmPassword) { setError("Password tidak cocok"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // ✅ Gunakan FormData jika ada avatar, JSON biasa jika tidak
      let response;

      if (avatar?.file) {
        const formData = new FormData();
        formData.append("nip", form.nip);
        formData.append("username", form.username);
        formData.append("name", form.name);
        formData.append("password", form.password);
        formData.append("role", form.role || "super_admin");
        formData.append("avatar", avatar.file);

        response = await axiosInstance.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post("/auth/register", {
          nip: form.nip,
          username: form.username,
          name: form.name,
          password: form.password,
          role: form.role || "super_admin",
        });
      }

      if (response.data?.success) {
        onRegisterSuccess?.(form);
      } else {
        setError(response.data?.message || "Registrasi gagal");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan server";
      setError(errorMessage);
      console.error("Register Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      <ErrorAlert message={error} onDismiss={() => setError("")} />

      {/* Loading pegawai data indicator */}
      {loadingPegawai && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">⟳ Memuat data pegawai...</p>
        </div>
      )}

      {/* NIP Input */}
      <div className="space-y-2">
        <label className="block text-sm text-slate-600 font-medium">
          Nomor Induk Pegawai (NIP) *
          <span className="text-slate-400 text-xs ml-2">({form.nip.length}/{NIP_LENGTH})</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
            <div className="px-3 text-slate-400"><IdCardIcon /></div>
            <input
              type="text"
              inputMode="numeric"
              placeholder={`masukkan NIP (${NIP_LENGTH} digit)`}
              value={form.nip}
              onChange={handleNipChange}
              maxLength={NIP_LENGTH}
              disabled={nipVerified || loadingPegawai || !!cooldownUntil}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wider"
              aria-label="nip"
            />
          </div>
          <button
            type="button"
            onClick={handleVerifyNip}
            disabled={checkingNip || nipVerified || form.nip.length < NIP_LENGTH || loadingPegawai || pegawaiList.length === 0 || !!cooldownUntil}
            className={`px-4 py-2.5 rounded-lg font-medium transition text-white whitespace-nowrap ${
              nipVerified ? "bg-green-600 cursor-not-allowed"
              : cooldownUntil ? "bg-red-400 cursor-not-allowed"
              : checkingNip ? "bg-slate-400 cursor-not-allowed"
              : form.nip.length < NIP_LENGTH || loadingPegawai || pegawaiList.length === 0 ? "bg-slate-300 cursor-not-allowed text-slate-600"
              : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
            }`}
          >
            {nipVerified ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Terverifikasi
              </span>
            ) : cooldownUntil ? (
              <span className="flex items-center gap-1">
                🔒 {Math.floor(cooldownRemaining / 60)}:{String(cooldownRemaining % 60).padStart(2, "0")}
              </span>
            ) : checkingNip ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Verifikasi...
              </span>
            ) : "Verifikasi"}
          </button>
        </div>

        {/* NIP Error */}
        {nipError && (
          <div className={`mt-2 p-3 border rounded-lg ${cooldownUntil ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-sm font-medium ${cooldownUntil ? "text-orange-800" : "text-red-800"}`}>
              {cooldownUntil ? "🔒" : "✗"} {nipError}
            </p>
            {cooldownUntil && (
              <p className="text-xs text-orange-600 mt-1">
                Sisa waktu: <span className="font-mono font-bold">{Math.floor(cooldownRemaining / 60)}:{String(cooldownRemaining % 60).padStart(2, "0")}</span>
              </p>
            )}
          </div>
        )}

        {/* Attempts progress bar */}
        {!cooldownUntil && verifyAttempts > 0 && verifyAttempts < MAX_ATTEMPTS && !nipVerified && (
          <div className="mt-1 flex gap-1 items-center">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < verifyAttempts ? "bg-red-400" : "bg-slate-200"}`} />
            ))}
          </div>
        )}

        {/* NIP Verified Success */}
        {nipVerified && nipData && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">
              ✓ NIP Terverifikasi: {nipData.nama || nipData.nama_lengkap}
            </p>
          </div>
        )}

        {/* NIP length helper */}
        {!nipVerified && !cooldownUntil && form.nip.length > 0 && form.nip.length < NIP_LENGTH && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ NIP harus {NIP_LENGTH} digit, masukkan {NIP_LENGTH - form.nip.length} digit lagi
          </p>
        )}
      </div>

      {/* ✅ Avatar Upload — muncul setelah NIP terverifikasi */}
      <AvatarUpload
        value={avatar}
        onChange={setAvatar}
        disabled={!nipVerified}
      />

      {/* Username Input */}
      <FormInput
        name="username"
        type="text"
        label="Username"
        placeholder="masukkan username"
        value={form.username}
        onChange={handleChange}
        icon={UserIcon}
        ariaLabel="username"
        required
        disabled={!nipVerified}
      />

      {/* Name Input */}
      <div className="space-y-1.5">
        <label className="block text-sm text-slate-600 font-medium">
          Nama Lengkap *
          {nipVerified && <span className="text-green-600 ml-2">✓ Otomatis diisi</span>}
        </label>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
          <div className="px-3 text-slate-400"><BadgeIcon /></div>
          <input
            name="name"
            type="text"
            placeholder="nama akan otomatis terisi setelah verifikasi NIP"
            value={form.name}
            onChange={handleChange}
            readOnly={nipVerified}
            disabled={!nipVerified}
            required
            className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="nama-lengkap"
          />
        </div>
        {nipVerified && (
          <p className="text-xs text-slate-500 mt-1">
            📌 Nama diambil dari data pegawai. Verifikasi NIP lagi jika ingin mengubah.
          </p>
        )}
      </div>

      {/* Password Input */}
      <PasswordInput
        name="password"
        label="Password"
        placeholder="masukkan password"
        value={form.password}
        onChange={handleChange}
        ariaLabel="password"
        required
        disabled={!nipVerified}
      />

      {/* Confirm Password Input */}
      <PasswordInput
        name="confirmPassword"
        label="Konfirmasi Password"
        placeholder="masukkan ulang password"
        value={form.confirmPassword}
        onChange={handleChange}
        ariaLabel="confirm-password"
        required
        disabled={!nipVerified}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !nipVerified}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white py-2.5 px-4 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <LoadingSpinner size="sm" />}
        <span>{loading ? "Mendaftar..." : "Daftar"}</span>
      </button>

      {/* Login Link */}
      <div className="pt-3 text-center">
        <p className="text-sm text-slate-500">
          Sudah punya akun?{" "}
          <button
            type="button"
            className="text-sky-600 hover:text-sky-700 font-medium transition"
            onClick={() => onNavigateLogin?.()}
          >
            Masuk
          </button>
        </p>
      </div>
    </form>
  );
}