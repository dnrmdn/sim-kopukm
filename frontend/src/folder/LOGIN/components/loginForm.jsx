
import React, { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import ErrorAlert from './errorAlert';
import FormInput from './formInput';
import PasswordInput from './passwordInput';
import RememberMeCheckbox from './rememberMe';
import LoadingSpinner from './loadingSpinner';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.65 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function LoginForm({ onLoginSuccess, onNavigateRegister, onNavigateForgot }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi input
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username dan password tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', form);

      if (response.data?.success) {
        // Simpan token
        localStorage.setItem('token', response.data.token);

        // Simpan preferensi remember me
        if (rememberMe) {
          localStorage.setItem('rememberUsername', form.username);
        } else {
          localStorage.removeItem('rememberUsername');
        }

        // Callback success
        onLoginSuccess?.(response.data.user);
      } else {
        setError(response.data?.message || 'Login gagal, periksa username/password');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan server';
      setError(errorMessage);
      console.error('Login Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      <ErrorAlert
        message={error}
        onDismiss={() => setError('')}
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
      />

      {/* Password Input */}
      <PasswordInput
        name="password"
        label="Password"
        placeholder="masukkan password"
        value={form.password}
        onChange={handleChange}
        ariaLabel="password"
        required
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-2">
        <RememberMeCheckbox
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          label="Ingat saya"
        />
        <button
          type="button"
          className="text-sm text-sky-600 hover:text-sky-700 font-medium transition"
          onClick={() => onNavigateForgot?.()}
        >
          Lupa password?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white py-2.5 px-4 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <LoadingSpinner size="sm" />}
        <span>{loading ? 'Memproses...' : 'Masuk'}</span>
      </button>

      {/* Register Link */}
      <div className="pt-3 text-center">
        <p className="text-sm text-slate-500">
          Belum punya akun?{' '}
          <button
            type="button"
            className="text-sky-600 hover:text-sky-700 font-medium transition"
            onClick={() => onNavigateRegister?.()}
          >
            Daftar
          </button>
        </p>
      </div>
    </form>
  );
}
