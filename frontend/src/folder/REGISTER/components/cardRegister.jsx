import RegisterForm from "./formRegister";

export default function RegisterCard({
  logos,
  title,
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateTerms
}) {
  return (
    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl border border-slate-100">
      {/* Logo Section */}
      {logos && logos.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-6">
          {logos.map((logo, idx) => (
            <div key={idx} className="flex items-center">
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>
          ))}
        </div>
      )}

      {/* Title */}
      {title && (
        <h1 className="text-center text-2xl md:text-3xl font-bold text-slate-800 mb-6">
          {title}
        </h1>
      )}

      {/* Description */}
      <p className="text-center text-sm text-slate-600 mb-6">
        Buat akun baru untuk mengakses sistem
      </p>

      {/* Form */}
      <RegisterForm
        onRegisterSuccess={onRegisterSuccess}
        onNavigateLogin={onNavigateLogin}
        onNavigateTerms={onNavigateTerms}
      />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs text-center text-slate-400">
          © DinkopUKM • Sistem Internal
        </p>
      </div>
    </div>
  );
}
