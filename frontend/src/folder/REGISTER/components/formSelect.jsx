export default function FormSelect({
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  ariaLabel,
  required = false
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm text-slate-600 font-medium">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-label={ariaLabel}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}