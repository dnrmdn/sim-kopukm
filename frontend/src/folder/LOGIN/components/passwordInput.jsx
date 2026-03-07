import { useState } from "react";

const EyeIcon = ({ show }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {show ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-3.582-10-8s4.477-8 10-8c1.108 0 2.172.17 3.174.486M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    )}
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

export default function PasswordInput({ name = "password", value, onChange, label = "Password", placeholder = "password", ariaLabel = "password", required = false }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm text-slate-600 font-medium">{label}</label>}
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
        <div className="px-3 text-slate-400">
          <LockIcon />
        </div>

        <input
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400"
        />

        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="px-3 text-slate-400 hover:text-slate-600 transition" aria-label={showPassword ? "sembunyikan password" : "tampilkan password"}>
          <EyeIcon show={showPassword} />
        </button>
      </div>
    </div>
  );
}
