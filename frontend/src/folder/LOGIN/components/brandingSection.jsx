export default function BrandingSection({ logoSrc, title, description, features }) {
  return (
    <div className="hidden md:flex flex-col items-start justify-center bg-linear-to-tr from-white/60 to-white/30 p-8 rounded-2xl shadow-lg border border-white/60 backdrop-blur-md">
      {/* Logo */}
      {logoSrc && (
        <div className="mb-6">
          <img
            src={logoSrc}
            alt="Logo"
            className="w-52 h-auto object-contain"
          />
        </div>
      )}

      {/* Title & Description */}
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">
        {title}
      </h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>

      {/* Features List */}
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-600 rounded-full shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
