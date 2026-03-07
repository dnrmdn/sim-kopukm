import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { getPegawai } from "@/services/pegawaiService";
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2H9.17C9.583 16.835 10.694 16 12 16z" />
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
    role: "super_admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nipVerified, setNipVerified] = useState(false);
  const [nipData, setNipData] = useState(null);
  const [checkingNip, setCheckingNip] = useState(false);
  const [nipError, setNipError] = useState("");
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loadingPegawai, setLoadingPegawai] = useState(true);

  const NIP_LENGTH = 18;

  // ✅ Load pegawai data on component mount with proper error handling
 useEffect(() => {
  const loadPegawaiData = async () => {
    setLoadingPegawai(true);
    try {
      const response = await getPegawai();
      
      // ✅ FIX: Backend now returns array directly
      const data = response?.data?.data; // response.data.data = array
      
      // console.log("=== Pegawai Load ===");
      // console.log("Response:", response?.data);
      // console.log("Data type:", typeof data);
      // console.log("Is array?", Array.isArray(data));
      
      let pegawaiArray = [];
      
      // Since backend should return array:
      if (Array.isArray(data)) {
        // console.log(`✓ Loaded ${data.length} pegawai`);
        pegawaiArray = data;
      } else {
        console.warn("⚠️ Data is not array");
        pegawaiArray = [];
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

  // ✅ Handle NIP input dengan pembatasan length
  const handleNipChange = (e) => {
    let value = e.target.value;

    // Hanya terima angka
    value = value.replace(/[^0-9]/g, "");

    // Batasi maksimal 18 karakter
    if (value.length > NIP_LENGTH) {
      value = value.slice(0, NIP_LENGTH);
    }

    setForm((prev) => ({ ...prev, nip: value }));

    // Reset verification jika NIP berubah
    setNipVerified(false);
    setNipData(null);
    setNipError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Verify NIP from pegawai data (client-side lookup) dengan safety checks
  const handleVerifyNip = async () => {
    // Validasi NIP length
    if (form.nip.length === 0) {
      setNipError("NIP tidak boleh kosong");
      return;
    }

    if (form.nip.length < NIP_LENGTH) {
      setNipError(`NIP harus tepat ${NIP_LENGTH} digit (Anda masukkan ${form.nip.length} digit)`);
      return;
    }

    // ✅ FIX: Check if pegawaiList is valid array
    if (!Array.isArray(pegawaiList)) {
      setNipError("Data pegawai tidak valid. Silakan refresh halaman.");
      console.error("pegawaiList is not an array:", typeof pegawaiList, pegawaiList);
      return;
    }

    if (pegawaiList.length === 0) {
      setNipError("Data pegawai kosong. Silakan refresh halaman.");
      return;
    }

    setCheckingNip(true);
    setNipError("");
    setError("");

    try {
      // ✅ Safe search
      const pegawai = pegawaiList.find((p) => p.nip === form.nip);

      if (pegawai) {
        // NIP ditemukan - auto-fill name
        setNipVerified(true);
        setNipData(pegawai);

        // Auto-fill name dari pegawai data
        const namaLengkap = pegawai.nama || pegawai.nama_lengkap || "";
        setForm((prev) => ({
          ...prev,
          name: namaLengkap,
        }));

        setNipError("");
        // console.log("NIP verified:", pegawai);
      } else {
        // NIP tidak ditemukan
        setNipVerified(false);
        setNipData(null);
        setForm((prev) => ({ ...prev, name: "" }));
        setNipError("NIP tidak terdaftar di database pegawai");
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

    // Check name (should be auto-filled)
    if (!form.name.trim()) {
      setError("Nama tidak boleh kosong");
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
      // ✅ Use axiosInstance for registration
      const response = await axiosInstance.post("/auth/register", {
        nip: form.nip,
        username: form.username,
        name: form.name,
        password: form.password,
        role: form.role || "super_admin",
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

      {/* Loading pegawai data indicator */}
      {loadingPegawai && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">⟳ Memuat data pegawai...</p>
        </div>
      )}

      {/* NIP Input with Length Validation */}
      <div className="space-y-2">
        <label className="block text-sm text-slate-600 font-medium">
          Nomor Induk Pegawai (NIP) * 
          <span className="text-slate-400 text-xs ml-2">({form.nip.length}/{NIP_LENGTH})</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
            <div className="px-3 text-slate-400">
              <IdCardIcon />
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder={`masukkan NIP (${NIP_LENGTH} digit)`}
              value={form.nip}
              onChange={handleNipChange}
              maxLength={NIP_LENGTH}
              disabled={nipVerified || loadingPegawai}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono tracking-wider"
              aria-label="nip"
            />
          </div>
          <button
            type="button"
            onClick={handleVerifyNip}
            disabled={checkingNip || nipVerified || form.nip.length < NIP_LENGTH || loadingPegawai || pegawaiList.length === 0}
            className={`px-4 py-2.5 rounded-lg font-medium transition text-white whitespace-nowrap ${
              nipVerified
                ? "bg-green-600 cursor-not-allowed"
                : checkingNip
                ? "bg-slate-400 cursor-not-allowed"
                : form.nip.length < NIP_LENGTH || loadingPegawai || pegawaiList.length === 0
                ? "bg-slate-300 cursor-not-allowed text-slate-600"
                : "bg-sky-600 hover:bg-sky-700 active:bg-sky-800"
            }`}
            title={
              loadingPegawai ? "Sedang memuat data..." :
              pegawaiList.length === 0 ? "Data pegawai tidak tersedia" :
              form.nip.length < NIP_LENGTH ? `NIP harus ${NIP_LENGTH} digit` : ""
            }
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

        {/* NIP Error Message */}
        {nipError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ✗ {nipError}
            </p>
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

        {/* NIP Length Helper */}
        {!nipVerified && form.nip.length > 0 && form.nip.length < NIP_LENGTH && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ NIP harus {NIP_LENGTH} digit, masukkan {NIP_LENGTH - form.nip.length} digit lagi
          </p>
        )}
      </div>

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

      {/* Name Input (Auto-filled from pegawai data) */}
      <div className="space-y-1.5">
        <label className="block text-sm text-slate-600 font-medium">
          Nama Lengkap *
          {nipVerified && <span className="text-green-600 ml-2">✓ Otomatis diisi</span>}
        </label>
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
          <div className="px-3 text-slate-400">
            <BadgeIcon />
          </div>
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