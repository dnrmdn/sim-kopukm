import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import ErrorAlert from "../../LOGIN/components/errorAlert.jsx";
import FormInput from "../../LOGIN/components/formInput.jsx";
import PasswordInput from "../../LOGIN/components/passwordInput.jsx";
import LoadingSpinner from "../../LOGIN/components/loadingSpinner.jsx";

// Icon Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.65 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IdCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2H9.17C9.583 16.835 10.694 16 12 16z"
    />
  </svg>
);

const BadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function RegisterForm({ onRegisterSuccess, onNavigateLogin }) {
  const [form, setForm] = useState({
    nip: "",
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nipVerified, setNipVerified] = useState(false);
  const [nipData, setNipData] = useState(null);
  const [checkingNip, setCheckingNip] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Reset NIP verification if NIP changes
    if (name === "nip") {
      setNipVerified(false);
      setNipData(null);
    }
  };

  // ✅ Check NIP exists di database pegawai
  const handleVerifyNip = async () => {
    if (!form.nip.trim()) {
      setError("NIP tidak boleh kosong");
      return;
    }

    if (form.nip.length < 16) {
      setError("NIP harus 16 digit");
      return;
    }

    setCheckingNip(true);
    setError("");

    try {
      // Call endpoint untuk verify NIP
      const response = await axiosInstance.get(`/api/pegawai/verify-nip/${form.nip}`);

      if (response.data?.success && response.data?.data) {
        // NIP ditemukan di database
        setNipVerified(true);
        setNipData(response.data.data);
        setError("");
      } else {
        setNipVerified(false);
        setNipData(null);
        setError("NIP tidak terdaftar di database");
      }
    } catch (err) {
      setNipVerified(false);
      setNipData(null);
      const errorMessage = err.response?.data?.message || "NIP tidak ditemukan";
      setError(errorMessage);
      console.error("NIP Verification Error:", err);
    } finally {
      setCheckingNip(false);
    }
  };

  const validateForm = () => {
    // Check NIP verified
    if (!nipVerified) {
      setError("Verifikasi NIP terlebih dahulu");
      return false;
    }

    // Check required fields
    if (!form.username.trim()) {
      setError("Username tidak boleh kosong");
      return false;
    }

    // Username validation (min 3 chars)
    if (form.username.length < 3) {
      setError("Username minimal 3 karakter");
      return false;
    }

    // Check name
    if (!form.name.trim()) {
      setError("Nama tidak boleh kosong");
      return false;
    }

    // Name validation (min 3 chars)
    if (form.name.length < 3) {
      setError("Nama minimal 3 karakter");
      return false;
    }

    // Password validation
    if (!form.password.trim()) {
      setError("Password tidak boleh kosong");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    // Password confirmation
    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/register", {
        nip: form.nip,
        username: form.username,
        name: form.name,
        password: form.password,
        role: form.role || "user",
      });

      if (response.data?.success) {
        // Success callback
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

      {/* NIP Input with Verification */}
      <div className="space-y-2">
        <label className="block text-sm text-slate-600 font-medium">Nomor Induk Pegawai (NIP) *</label>
        <div className="flex gap-2">
          <FormInput name="nip" type="text" placeholder="masukkan NIP (16 digit)" value={form.nip} onChange={handleChange} icon={IdCardIcon} ariaLabel="nip" required className="flex-1" />
          <button
            type="button"
            onClick={handleVerifyNip}
            disabled={checkingNip || nipVerified || !form.nip.trim()}
            className={`px-4 py-2.5 rounded-lg font-medium transition text-white whitespace-nowrap ${
              nipVerified ? "bg-green-600 cursor-not-allowed" : checkingNip ? "bg-slate-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
            }`}
          >
            {nipVerified ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Terverifikasi
              </span>
            ) : checkingNip ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Verifikasi...
              </span>
            ) : (
              "Verifikasi"
            )}
          </button>
        </div>
        {nipVerified && nipData && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">✓ NIP Terverifikasi: {nipData.nama_lengkap}</p>
          </div>
        )}
      </div>

      {/* Username Input */}
      <FormInput name="username" type="text" label="Username" placeholder="masukkan username" value={form.username} onChange={handleChange} icon={UserIcon} ariaLabel="username" required disabled={!nipVerified} />

      {/* Name Input dengan info gelar */}
      <div className="space-y-1.5">
        <label className="block text-sm text-slate-600 font-medium">Nama Lengkap (dengan Gelar) *</label>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
          <div className="px-3">
            <BadgeIcon />
          </div>
          <input
            name="name"
            type="text"
            placeholder="contoh: Drs. John Doe, M.Si"
            value={form.name}
            onChange={handleChange}
            disabled={!nipVerified}
            required
            className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="nama-lengkap"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">📌 Masukkan nama lengkap dengan gelar (contoh: Drs., S.E., M.Si, S.H., dll)</p>
      </div>

      {/* Password Input */}
      <PasswordInput name="password" label="Password" placeholder="masukkan password" value={form.password} onChange={handleChange} ariaLabel="password" required disabled={!nipVerified} />

      {/* Confirm Password Input */}
      <PasswordInput name="confirmPassword" label="Konfirmasi Password" placeholder="masukkan ulang password" value={form.confirmPassword} onChange={handleChange} ariaLabel="confirm-password" required disabled={!nipVerified} />

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
          <button type="button" className="text-sky-600 hover:text-sky-700 font-medium transition" onClick={() => onNavigateLogin?.()}>
            Masuk
          </button>
        </p>
      </div>
    </form>
  );
}
