export default function FormInput({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  label,
  ariaLabel,
  required = false
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-slate-600 font-medium">
          {label}
        </label>
      )}
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-300 transition">
        {Icon && (
          <div className="px-3 text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder-slate-400"
        />
      </div>
    </div>
  );
}
