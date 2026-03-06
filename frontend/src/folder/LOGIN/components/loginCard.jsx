import LoginForm from "./loginForm";

export default function LoginCard({
  logos,
  title,
  onLoginSuccess,
  onNavigateRegister,
  onNavigateForgot
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

      {/* Form */}
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        onNavigateRegister={onNavigateRegister}
        onNavigateForgot={onNavigateForgot}
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